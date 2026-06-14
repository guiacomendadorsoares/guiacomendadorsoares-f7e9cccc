import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ComingSoon } from "@/components/admin-content-table";

export const Route = createFileRoute("/_authenticated/painel-empresa")({
  component: PainelEmpresa,
});

function PainelEmpresa() {
  const { ready } = useRequireAnyRole(["partner", "admin"]);
  if (!ready) return null;
  return (
    <DashboardShell role="partner" title="Painel da Empresa" subtitle="Gerencie sua presença no Guia">
      <ComingSoon title="Painel de Empresa / Parceiro" />
    </DashboardShell>
  );
}
