import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ContentCrud } from "@/components/content-crud";
import { useCurrentUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/painel-imoveis")({
  component: PainelImoveis,
});

function PainelImoveis() {
  const { ready } = useRequireAnyRole(["broker", "admin"]);
  const { user } = useCurrentUser();
  if (!ready || !user) return null;
  return (
    <DashboardShell role="broker" title="Painel de Imóveis" subtitle="Cadastre e acompanhe seus imóveis">
      <ContentCrud table="properties" ownerOnly={user.id} forcePending />
    </DashboardShell>
  );
}
