import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AppRole } from "@/hooks/use-auth";
import { grantRole, revokeRole } from "@/lib/admin.functions";

export function RoleUsersList({ role, title }: { role: AppRole; title: string }) {
  const qc = useQueryClient();
  const grantFn = useServerFn(grantRole);
  const revokeFn = useServerFn(revokeRole);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-role-users", role],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", role);
      const ids = (roles ?? []).map((r: any) => r.user_id).filter(Boolean);
      if (ids.length === 0) return [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, user_id, email, full_name, avatar_url, created_at")
        .in("user_id", ids)
        .order("created_at", { ascending: false });
      return profiles ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: (userId: string) => revokeFn({ data: { userId, role } }),
    onSuccess: () => {
      toast.success("Perfil removido");
      qc.invalidateQueries({ queryKey: ["admin-role-users", role] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const grantPrompt = useMutation({
    mutationFn: (userId: string) => grantFn({ data: { userId, role } }),
    onSuccess: () => {
      toast.success("Perfil adicionado");
      qc.invalidateQueries({ queryKey: ["admin-role-users", role] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{(data ?? []).length} cadastrado(s)</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const id = window.prompt(`Cole o user_id para conceder o perfil "${role}":`);
            if (id) grantPrompt.mutate(id.trim());
          }}
        >
          Conceder perfil
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {!isLoading && (data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum usuário com este perfil ainda.</p>
      )}

      {(data ?? []).map((u: any) => (
        <div
          key={u.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-card"
        >
          <div className="flex min-w-0 items-center gap-3">
            {u.avatar_url ? (
              <img src={u.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-secondary" />
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold">{u.full_name ?? u.email ?? "Sem nome"}</p>
              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => remove.mutate(u.user_id)}>
            Remover
          </Button>
        </div>
      ))}
    </div>
  );
}
