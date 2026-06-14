import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/dashboard-shell";
import { CATEGORY_FILTERS } from "@/lib/businesses";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/admin/empresas")({
  component: EmpresasPage,
});

const CATEGORIES = CATEGORY_FILTERS.filter((c) => c.id !== "all");

const schema = z.object({
  name: z.string().trim().min(2, "Nome obrigatório").max(120),
  category: z.string().min(1, "Categoria obrigatória"),
  address: z.string().trim().min(3, "Endereço obrigatório").max(255),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  instagram: z.string().trim().max(120).optional().or(z.literal("")),
  logo_url: z.string().trim().url("URL inválida").max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;
type Row = {
  id: string;
  name: string;
  category: string;
  category_label: string;
  address: string;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  logo_url: string | null;
  status: "draft" | "pending" | "approved" | "rejected";
  created_at: string;
};

const emptyForm: FormValues = {
  name: "", category: "", address: "", description: "",
  phone: "", whatsapp: "", email: "", instagram: "", logo_url: "",
};

function EmpresasPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-businesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("id,name,category,category_label,address,description,phone,whatsapp,email,instagram,logo_url,status,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: FormValues & { id?: string }) => {
      const cat = CATEGORIES.find((c) => c.id === values.category);
      const payload = {
        name: values.name.trim(),
        category: values.category,
        category_label: cat?.label ?? values.category,
        address: values.address.trim(),
        description: values.description || null,
        phone: values.phone || null,
        whatsapp: values.whatsapp || null,
        email: values.email || null,
        instagram: values.instagram || null,
        logo_url: values.logo_url || null,
        status: "approved" as const,
      };
      if (values.id) {
        const { error } = await supabase.from("businesses").update(payload).eq("id", values.id);
        if (error) throw error;
      } else {
        const { data: u } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("businesses")
          .insert({ ...payload, submitted_by: u.user?.id ?? null });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Empresa salva");
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
      setEditing(null);
      setCreating(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Empresa removida");
      qc.invalidateQueries({ queryKey: ["admin-businesses"] });
      setConfirmDelete(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">Empresas</h2>
          <p className="text-xs text-muted-foreground">
            Cadastro manual do guia comercial. {data?.length ?? 0} registros.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="shrink-0">
          <Plus className="mr-1 h-4 w-4" /> Nova empresa
        </Button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-12"><Loader2 className="h-5 w-5 animate-spin" /></div>
      ) : !data?.length ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Nenhuma empresa cadastrada ainda.
        </p>
      ) : (
        <ul className="space-y-2">
          {data.map((row) => (
            <li key={row.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold">{row.name}</p>
                  <StatusBadge status={row.status} />
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {row.category_label} · {row.address}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(row)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setConfirmDelete(row)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <BusinessFormDialog
        open={creating || !!editing}
        initial={editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSubmit={(v) => upsert.mutate(editing ? { ...v, id: editing.id } : v)}
        saving={upsert.isPending}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover empresa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente <strong>{confirmDelete?.name}</strong> do guia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && remove.mutate(confirmDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BusinessFormDialog({
  open, initial, onClose, onSubmit, saving,
}: {
  open: boolean;
  initial: Row | null;
  onClose: () => void;
  onSubmit: (v: FormValues) => void;
  saving: boolean;
}) {
  const [values, setValues] = useState<FormValues>(emptyForm);

  // sync when dialog opens
  useState(() => values); // noop, keeps lint happy
  if (open && initial && values.name !== initial.name && values.address !== initial.address) {
    setValues({
      name: initial.name,
      category: initial.category,
      address: initial.address,
      description: initial.description ?? "",
      phone: initial.phone ?? "",
      whatsapp: initial.whatsapp ?? "",
      email: initial.email ?? "",
      instagram: initial.instagram ?? "",
      logo_url: initial.logo_url ?? "",
    });
  }
  if (open && !initial && values.name && !values.category && !values.address) {
    // entering create mode after edit, reset
  }

  function handleClose() {
    setValues(emptyForm);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    onSubmit(parsed.data);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? "Editar empresa" : "Nova empresa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3" id="business-form">
          <Field label="Nome *">
            <Input value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} maxLength={120} required />
          </Field>
          <Field label="Categoria *">
            <Select value={values.category} onValueChange={(v) => setValues({ ...values, category: v })}>
              <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Endereço *">
            <Input value={values.address} onChange={(e) => setValues({ ...values, address: e.target.value })} maxLength={255} required />
          </Field>
          <Field label="Descrição">
            <Textarea value={values.description} onChange={(e) => setValues({ ...values, description: e.target.value })} maxLength={2000} rows={3} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Telefone">
              <Input value={values.phone} onChange={(e) => setValues({ ...values, phone: e.target.value })} maxLength={40} />
            </Field>
            <Field label="WhatsApp">
              <Input value={values.whatsapp} onChange={(e) => setValues({ ...values, whatsapp: e.target.value })} maxLength={40} placeholder="5521999990000" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} maxLength={255} />
            </Field>
            <Field label="Instagram">
              <Input value={values.instagram} onChange={(e) => setValues({ ...values, instagram: e.target.value })} maxLength={120} placeholder="@usuario" />
            </Field>
          </div>
          <Field label="URL do logo">
            <Input value={values.logo_url} onChange={(e) => setValues({ ...values, logo_url: e.target.value })} maxLength={500} placeholder="https://…" />
          </Field>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>Cancelar</Button>
          <Button type="submit" form="business-form" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
