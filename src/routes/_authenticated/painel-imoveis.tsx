import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ContentCrud } from "@/components/content-crud";
import { MyPlanCard } from "@/components/my-plan-card";
import { useCurrentUser } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/painel-imoveis")({
  component: PainelImoveis,
});

function PainelImoveis() {
  const { ready } = useRequireAnyRole(["broker", "admin"]);
  const { user } = useCurrentUser();
  const { data: count = 0 } = useQuery({
    queryKey: ["my-properties-count", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { count } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("submitted_by", user!.id);
      return count ?? 0;
    },
  });
  if (!ready || !user) return null;
  return (
    <DashboardShell role="broker" title="Painel de Imóveis" subtitle="Cadastre e acompanhe seus imóveis">
      <div className="space-y-6">
        <MyPlanCard kind="properties" usage={{ used: count }} />
        <ContentCrud table="properties" ownerOnly={user.id} forcePending />
      </div>
    </DashboardShell>
  );
}
