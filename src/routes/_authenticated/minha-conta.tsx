import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser, useUserRoles } from "@/hooks/use-auth";
import { LogOut, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/minha-conta")({
  component: MinhaContaPage,
});

const PANEL_BY_ROLE: Record<string, { to: string; label: string }> = {
  admin: { to: "/admin", label: "Painel Master" },
  editor: { to: "/admin", label: "Painel de Edição" },
  partner: { to: "/painel-empresa", label: "Painel da Empresa" },
  broker: { to: "/painel-imoveis", label: "Painel de Imóveis" },
  influencer: { to: "/portal-imprensa", label: "Portal de Imprensa" },
};

function MinhaContaPage() {
  const { user } = useCurrentUser();
  const { data: roles = [] } = useUserRoles(user?.id);
  const navigate = useNavigate();
  const qc = useQueryClient();

  async function handleLogout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Você saiu.");
    navigate({ to: "/auth", replace: true });
  }

  const panels = roles.map((r) => PANEL_BY_ROLE[r]).filter(Boolean);

  return (
    <DashboardShell role="user" title="Minha conta" subtitle={user?.email ?? ""}>
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full gradient-brand text-primary-foreground">
              <Shield className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.user_metadata?.full_name ?? user?.email}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {roles.length === 0 ? (
                  <span className="text-xs text-muted-foreground">Sem perfis atribuídos</span>
                ) : (
                  roles.map((r) => (
                    <span key={r} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium">
                      {r}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {panels.length > 0 && (
          <div>
            <h2 className="mb-3 font-display text-lg font-bold">Meus painéis</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {panels.map((p) => (
                <Link
                  key={p!.to}
                  to={p!.to}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition hover:border-primary hover:shadow-elegant"
                >
                  <p className="font-semibold">{p!.label}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full sm:w-auto" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </div>
    </DashboardShell>
  );
}
