import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser, useUserRoles } from "@/hooks/use-auth";
import { LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/minha-conta")({
  component: MinhaContaPage,
});

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

  return (
    <AppShell title="Minha conta" subtitle={user?.email ?? ""}>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full gradient-brand text-primary-foreground">
            <Shield className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {user?.user_metadata?.full_name ?? user?.email}
            </p>
            <p className="mt-1 flex flex-wrap gap-1">
              {roles.length === 0 ? (
                <span className="text-xs text-muted-foreground">Sem perfis atribuídos</span>
              ) : (
                roles.map((r) => (
                  <span key={r} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                    {r}
                  </span>
                ))
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Painéis disponíveis</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Os dashboards completos (admin, parceiros, corretores e imprensa) serão liberados na próxima fase.
        </p>
      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Sair da conta
      </Button>
    </AppShell>
  );
}
