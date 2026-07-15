import { createFileRoute } from "@tanstack/react-router";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

// Asaas webhook receiver.
// Configure no painel Asaas: URL = https://<seu-dominio>/api/public/asaas-webhook
// e Token de autenticação = ASAAS_WEBHOOK_TOKEN (header: asaas-access-token)
export const Route = createFileRoute("/api/public/asaas-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.ASAAS_WEBHOOK_TOKEN;
        const provided = request.headers.get("asaas-access-token") ?? "";
        if (!expected || !safeEqual(provided, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Idempotency
        const eventId: string | undefined = payload?.id ?? payload?.event_id;
        if (eventId) {
          const { data: existing } = await supabaseAdmin
            .from("asaas_webhook_events")
            .select("id")
            .eq("event_id", eventId)
            .maybeSingle();
          if (existing) return new Response("ok");
        }

        await supabaseAdmin.from("asaas_webhook_events").insert({
          event_id: eventId ?? null,
          event: payload?.event ?? "UNKNOWN",
          payload,
        });

        const event: string = payload?.event ?? "";
        const p = payload?.payment ?? {};
        const subscriptionId: string | undefined = p?.subscription;
        const userId: string | undefined = p?.externalReference;

        // Map Asaas events → subscription status
        const statusMap: Record<string, string> = {
          PAYMENT_CONFIRMED: "active",
          PAYMENT_RECEIVED: "active",
          PAYMENT_OVERDUE: "overdue",
          PAYMENT_DELETED: "canceled",
          PAYMENT_REFUNDED: "refunded",
          PAYMENT_CHARGEBACK_REQUESTED: "chargeback",
          PAYMENT_CREATED: "pending",
          PAYMENT_UPDATED: "pending",
        };
        const newStatus = statusMap[event];

        if (subscriptionId && newStatus) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status: newStatus,
              asaas_payment_id: p?.id ?? null,
              invoice_url: p?.invoiceUrl ?? null,
              next_due_date: p?.dueDate ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("asaas_subscription_id", subscriptionId);

          // On confirmed payment, upgrade profile.current_plan
          if (newStatus === "active" && userId) {
            const { data: sub } = await supabaseAdmin
              .from("subscriptions")
              .select("plan_id")
              .eq("asaas_subscription_id", subscriptionId)
              .maybeSingle();
            if (sub?.plan_id) {
              const { data: plan } = await supabaseAdmin
                .from("subscription_plans")
                .select("slug")
                .eq("id", sub.plan_id)
                .maybeSingle();
              if (plan?.slug) {
                await supabaseAdmin
                  .from("profiles")
                  .update({ current_plan: plan.slug })
                  .eq("user_id", userId);
              }
            }
          }

          // On cancel/refund downgrade to free
          if ((newStatus === "canceled" || newStatus === "refunded") && userId) {
            await supabaseAdmin
              .from("profiles")
              .update({ current_plan: "free" })
              .eq("user_id", userId);
          }
        }

        return new Response("ok");
      },
    },
  },
});
