import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, useRequireAnyRole } from "@/components/dashboard-shell";
import { ContentCrud } from "@/components/content-crud";
import { MyPlanCard } from "@/components/my-plan-card";
import { useCurrentUser } from "@/hooks/use-auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/painel-empresa")({
  component: PainelEmpresa,
});

function PainelEmpresa() {
  const { ready } = useRequireAnyRole(["partner", "admin"]);
  const { user } = useCurrentUser();
  if (!ready || !user) return null;
  return (
    <DashboardShell role="partner" title="Painel da Empresa" subtitle="Gerencie sua presença no Guia">
      <div className="space-y-6">
        <MyPlanCard kind="business" />
        <Tabs defaultValue="vagas">
        <TabsList>
          <TabsTrigger value="vagas">Vagas</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>
        <TabsContent value="vagas" className="mt-4">
          <ContentCrud table="jobs" ownerOnly={user.id} forcePending />
        </TabsContent>
        <TabsContent value="eventos" className="mt-4">
          <ContentCrud table="events" ownerOnly={user.id} forcePending />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
