import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ComingSoon } from "@/components/admin-content-table";

export const Route = createFileRoute("/_authenticated/portal-imprensa")({
  component: PortalImprensa,
});

function PortalImprensa() {
  const { ready } = useRequireAnyRole(["influencer", "editor", "admin"]);
  if (!ready) return null;
  return (
    <DashboardShell role="influencer" title="Portal de Imprensa" subtitle="Crie notícias, eventos e curiosidades">
      <ComingSoon title="Portal de Imprensa / Influenciador" />
    </DashboardShell>
  );
}
