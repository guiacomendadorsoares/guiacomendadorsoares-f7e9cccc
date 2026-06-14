import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ComingSoon } from "@/components/admin-content-table";

export const Route = createFileRoute("/_authenticated/painel-imoveis")({
  component: PainelImoveis,
});

function PainelImoveis() {
  const { ready } = useRequireAnyRole(["broker", "admin"]);
  if (!ready) return null;
  return (
    <DashboardShell role="broker" title="Painel de Imóveis" subtitle="Cadastre e acompanhe seus imóveis">
      <ComingSoon title="Painel do Corretor / Imobiliária" />
    </DashboardShell>
  );
}
