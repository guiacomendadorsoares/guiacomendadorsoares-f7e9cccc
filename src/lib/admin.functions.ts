import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CONTENT_TABLES = ["businesses", "jobs", "properties", "news", "events", "curiosities"] as const;
const ROLES = ["admin", "editor", "partner", "broker", "influencer", "user"] as const;

async function assertAdminOrEditor(context: { supabase: any; userId: string }, allowEditor = true) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (isAdmin) return;
  if (allowEditor) {
    const { data: isEditor } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "editor",
    });
    if (isEditor) return;
  }
  throw new Error("Forbidden");
}

const approveSchema = z.object({
  table: z.enum(CONTENT_TABLES),
  id: z.string().uuid(),
});

export const approveContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => approveSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminOrEditor(context);
    const { error } = await context.supabase
      .from(data.table)
      .update({
        status: "approved",
        approved_by: context.userId,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const rejectSchema = approveSchema.extend({
  reason: z.string().trim().min(1).max(500),
});

export const rejectContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => rejectSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminOrEditor(context);
    const { error } = await context.supabase
      .from(data.table)
      .update({
        status: "rejected",
        approved_by: context.userId,
        approved_at: new Date().toISOString(),
        rejection_reason: data.reason,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(ROLES),
});

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => roleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminOrEditor(context, false); // admin only
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => roleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminOrEditor(context, false); // admin only
    if (data.userId === context.userId && data.role === "admin") {
      throw new Error("Você não pode remover seu próprio perfil de admin.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const SELF_ROLES = ["partner", "broker", "influencer"] as const;
const selfRoleSchema = z.object({ role: z.enum(SELF_ROLES) });

export const requestSelfRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => selfRoleSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: data.role });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { ok: true };
  });

const PLAN_SLUGS = ["free", "destaque", "ouro"] as const;
const setPlanSchema = z.object({
  userId: z.string().uuid(),
  plan: z.enum(PLAN_SLUGS),
});

export const setUserPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => setPlanSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdminOrEditor(context, false); // admin only
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ current_plan: data.plan })
      .eq("user_id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

