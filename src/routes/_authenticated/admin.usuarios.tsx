import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import type { AppRole } from "@/hooks/use-auth";
import { grantRole, revokeRole } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/usuarios")({
  component: UsuariosPage,
});

const ROLES: AppRole[] = ["admin", "editor", "partner", "broker", "influencer", "user"];

function UsuariosPage() {
  const qc = useQueryClient();
  const grantFn = useServerFn(grantRole);
  const revokeFn = useServerFn(revokeRole);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles } = await supabase.from("profiles").select("id, user_id, email, full_name").order("created_at", { ascending: false }).limit(100);
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const rolesByUser = new Map<string, string[]>();
      (roles ?? []).forEach((r: any) => {
        if (!r.user_id) return;
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      });
      return (profiles ?? []).map((p: any) => ({ ...p, roles: rolesByUser.get(p.user_id) ?? [] }));
    },
  });

  const addRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      grantFn({ data: { userId, role } }),
    onSuccess: () => {
      toast.success("Perfil adicionado");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: AppRole }) =>
      revokeFn({ data: { userId, role } }),
    onSuccess: () => {
      toast.success("Perfil removido");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p>Carregando…</p>;

  return (
    <div className="space-y-3">
      {(data ?? []).map((u) => (
        <UserRow key={u.id} user={u} onAdd={(role) => addRole.mutate({ userId: u.user_id, role })} onRemove={(role) => removeRole.mutate({ userId: u.user_id, role })} />
      ))}
    </div>
  );
}

function UserRow({ user, onAdd, onRemove }: { user: any; onAdd: (r: AppRole) => void; onRemove: (r: AppRole) => void }) {
  const [picked, setPicked] = useState<AppRole>("user");
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <p className="truncate font-semibold">{user.full_name ?? user.email ?? "Sem nome"}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {user.roles.length === 0 && <span className="text-xs text-muted-foreground">Sem perfis</span>}
          {user.roles.map((r: AppRole) => (
            <button
              key={r}
              onClick={() => onRemove(r)}
              className="group rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium hover:bg-destructive hover:text-destructive-foreground"
              title="Clique para remover"
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Select value={picked} onValueChange={(v) => setPicked(v as AppRole)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => onAdd(picked)}>Adicionar</Button>
      </div>
    </div>
  );
}
