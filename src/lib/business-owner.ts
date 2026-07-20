import { supabase } from "@/integrations/supabase/client";

export type MemberRole = "proprietario" | "gerente" | "editor" | "financeiro";

export const ROLE_LABEL: Record<MemberRole, string> = {
  proprietario: "Proprietário",
  gerente: "Gerente",
  editor: "Editor",
  financeiro: "Financeiro",
};

export const ROLE_DESC: Record<MemberRole, string> = {
  proprietario: "Controle total. Gerencia equipe e transfere titularidade.",
  gerente: "Edita a empresa e gerencia a equipe (exceto proprietário).",
  editor: "Edita conteúdo da empresa (posts, fotos, dados).",
  financeiro: "Somente leitura + acesso a plano e cobrança.",
};

export const ASSIGNABLE_ROLES: MemberRole[] = ["gerente", "editor", "financeiro"];

export type MyBusiness = {
  id: string;
  name: string;
  category_label: string | null;
  status: string | null;
  cover_image: string | null;
  role: MemberRole;
  is_primary_owner: boolean;
};

export type TeamMember = {
  id: string;
  business_id: string;
  user_id: string;
  role: MemberRole;
  status: string;
  is_primary_owner: boolean;
  created_at: string;
  profile?: { email: string | null; full_name: string | null; avatar_url: string | null } | null;
};

export async function listMyBusinesses(userId: string): Promise<MyBusiness[]> {
  // Businesses via membership
  const { data: memberships, error: mErr } = await (supabase as any)
    .from("business_members")
    .select("business_id, role, is_primary_owner, status, businesses:business_id(id,name,category_label,status,cover_image)")
    .eq("user_id", userId)
    .eq("status", "active")
    .is("deleted_at", null);
  if (mErr) throw mErr;

  const rows: MyBusiness[] = [];
  const seen = new Set<string>();
  for (const m of memberships ?? []) {
    const b = (m as any).businesses;
    if (!b?.id || seen.has(b.id)) continue;
    seen.add(b.id);
    rows.push({
      id: b.id,
      name: b.name,
      category_label: b.category_label ?? null,
      status: b.status ?? null,
      cover_image: b.cover_image ?? null,
      role: (m as any).role as MemberRole,
      is_primary_owner: !!(m as any).is_primary_owner,
    });
  }

  // Legacy: businesses submitted by the user without a membership yet
  const { data: legacy } = await supabase
    .from("businesses")
    .select("id,name,category_label,status,cover_image")
    .eq("submitted_by", userId)
    .limit(200);
  for (const b of legacy ?? []) {
    if (seen.has(b.id)) continue;
    seen.add(b.id);
    rows.push({
      id: b.id,
      name: b.name,
      category_label: (b as any).category_label ?? null,
      status: (b as any).status ?? null,
      cover_image: (b as any).cover_image ?? null,
      role: "proprietario",
      is_primary_owner: true,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

export async function listTeam(businessId: string): Promise<TeamMember[]> {
  const { data, error } = await (supabase as any)
    .from("business_members")
    .select("id,business_id,user_id,role,status,is_primary_owner,created_at")
    .eq("business_id", businessId)
    .is("deleted_at", null)
    .order("is_primary_owner", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as TeamMember[];
  if (!rows.length) return [];
  const ids = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: profs } = await (supabase as any)
    .from("profiles")
    .select("user_id,email,full_name,avatar_url")
    .in("user_id", ids);
  const byId = new Map<string, any>((profs ?? []).map((p: any) => [p.user_id, p]));
  return rows.map((r) => ({ ...r, profile: byId.get(r.user_id) ?? null }));
}

export async function inviteMemberByEmail(params: {
  businessId: string;
  email: string;
  role: MemberRole;
}): Promise<void> {
  const email = params.email.trim().toLowerCase();
  if (!email) throw new Error("Informe o e-mail.");
  const { data: prof, error } = await (supabase as any)
    .from("profiles")
    .select("user_id")
    .ilike("email", email)
    .maybeSingle();
  if (error) throw error;
  if (!prof?.user_id) throw new Error("Usuário não encontrado. Peça para essa pessoa criar uma conta primeiro.");

  const { data: existing } = await (supabase as any)
    .from("business_members")
    .select("id,status,role")
    .eq("business_id", params.businessId)
    .eq("user_id", prof.user_id)
    .maybeSingle();

  if (existing?.id) {
    const { error: upErr } = await (supabase as any)
      .from("business_members")
      .update({ role: params.role, status: "active", deleted_at: null })
      .eq("id", existing.id);
    if (upErr) throw upErr;
    return;
  }

  const { data: u } = await supabase.auth.getUser();
  const { error: insErr } = await (supabase as any).from("business_members").insert({
    business_id: params.businessId,
    user_id: prof.user_id,
    role: params.role,
    status: "active",
    is_primary_owner: false,
    invited_by: u.user?.id ?? null,
  });
  if (insErr) throw insErr;
}

export async function updateMemberRole(memberId: string, role: MemberRole): Promise<void> {
  const { error } = await (supabase as any)
    .from("business_members")
    .update({ role })
    .eq("id", memberId);
  if (error) throw error;
}

export async function removeMember(memberId: string): Promise<void> {
  const { error } = await (supabase as any)
    .from("business_members")
    .update({ status: "removed", deleted_at: new Date().toISOString() })
    .eq("id", memberId);
  if (error) throw error;
}

export function canManageTeam(role: MemberRole, isPrimary: boolean): boolean {
  return isPrimary || role === "proprietario" || role === "gerente";
}

export function canEditBusiness(role: MemberRole, isPrimary: boolean): boolean {
  return isPrimary || role === "proprietario" || role === "gerente" || role === "editor";
}
