import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Upload, Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, findCategory } from "@/lib/guia-taxonomy";

// -------- CSV parser (RFC 4180-ish, handles quotes/newlines) ---------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && src[i + 1] === "\n") i++;
        cur.push(field); rows.push(cur); cur = []; field = "";
      } else field += c;
    }
  }
  if (field.length > 0 || cur.length > 0) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const HEADER_KEYS = ["name", "category", "address", "phone"] as const;
type Key = typeof HEADER_KEYS[number];

const HEADER_ALIASES: Record<string, Key> = {
  nome: "name", name: "name",
  categoria: "category", category: "category",
  endereco: "address", "endereço": "address", address: "address",
  telefone: "phone", phone: "phone", tel: "phone",
};

function norm(s: string) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function resolveCategory(input: string): { slug: string; label: string } | null {
  const q = norm(input);
  if (!q) return null;
  const c = CATEGORIES.find((cat) => norm(cat.slug) === q || norm(cat.label) === q);
  return c ? { slug: c.slug, label: c.label } : null;
}


type ParsedRow = {
  index: number;
  raw: Record<string, string>;
  values?: Record<string, any>;
  error?: string;
  status: "ok" | "invalid" | "duplicate";
};

const TEMPLATE_CSV =
  "name,category,address,phone\n" +
  "Padaria Exemplo,alimentacao,Rua das Flores 123,(21) 99999-0000\n";

export function BusinessesCsvImport({ onDone }: { onDone?: () => void }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ ok: number; skip: number; err: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const okCount = useMemo(() => rows.filter((r) => r.status === "ok").length, [rows]);
  const errCount = useMemo(() => rows.filter((r) => r.status === "invalid").length, [rows]);
  const dupCount = useMemo(() => rows.filter((r) => r.status === "duplicate").length, [rows]);

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "modelo-empresas.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleFile(file: File) {
    setProgress(null);
    const text = await file.text();
    const table = parseCsv(text);
    if (table.length < 2) { toast.error("Planilha vazia ou sem linhas."); return; }
    const header = table[0].map((h) => HEADER_ALIASES[norm(h)] ?? (norm(h) as Key));
    const missing = ["name", "category", "address"].filter((k) => !header.includes(k as Key));
    if (missing.length) { toast.error(`Colunas obrigatórias faltando: ${missing.join(", ")}`); return; }

    // Fetch existing names within categories to detect duplicates (single query).
    const { data: existing } = await supabase
      .from("businesses").select("name, category").limit(5000);
    const dupSet = new Set(
      (existing ?? []).map((r: any) => `${norm(r.name ?? "")}|${norm(r.category ?? "")}`)
    );

    const parsed: ParsedRow[] = [];
    for (let i = 1; i < table.length; i++) {
      const rec: Record<string, string> = {};
      header.forEach((k, j) => { rec[k] = (table[i][j] ?? "").trim(); });
      const row: ParsedRow = { index: i, raw: rec, status: "invalid" };

      if (!rec.name) { row.error = "Nome vazio"; parsed.push(row); continue; }
      if (!rec.address) { row.error = "Endereço vazio"; parsed.push(row); continue; }
      const cat = resolveCategory(rec.category ?? "");
      if (!cat) { row.error = `Categoria inválida: "${rec.category}"`; parsed.push(row); continue; }

      const key = `${norm(rec.name)}|${norm(cat.slug)}`;
      if (dupSet.has(key)) { row.status = "duplicate"; row.error = "Já existe (pulado)"; parsed.push(row); continue; }
      dupSet.add(key);

      row.status = "ok";
      row.values = {
        name: rec.name,
        main_category: cat.slug,
        category: cat.slug,
        subcategory: null,
        category_label: cat.label,
        address: rec.address,
        phone: rec.phone || null,
        status: "approved",
      };
      parsed.push(row);
    }
    setRows(parsed);
  }

  async function runImport() {
    if (!okCount) { toast.error("Nenhuma linha válida para importar."); return; }
    setImporting(true);
    const { data: u } = await supabase.auth.getUser();
    const submittedBy = u.user?.id ?? null;
    let ok = 0, err = 0;
    const toInsert = rows.filter((r) => r.status === "ok" && r.values).map((r) => ({ ...r.values!, submitted_by: submittedBy }));
    // Insert in chunks of 50
    for (let i = 0; i < toInsert.length; i += 50) {
      const chunk = toInsert.slice(i, i + 50);
      const { error, data } = await (supabase.from("businesses") as any).insert(chunk).select("id");
      if (error) { err += chunk.length; console.error(error); }
      else ok += (data?.length ?? chunk.length);
    }
    setImporting(false);
    setProgress({ ok, skip: dupCount, err: err + errCount });
    if (ok > 0) toast.success(`${ok} empresa(s) importada(s).`);
    if (err > 0) toast.error(`${err} linha(s) falharam no banco.`);
    qc.invalidateQueries({ queryKey: ["crud", "businesses"] });
    onDone?.();
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="mr-1 h-4 w-4" /> Importar planilha
      </Button>

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); setRows([]); setProgress(null); } }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar empresas via CSV</DialogTitle>
            <DialogDescription>
              Cada linha vira uma empresa no <strong>plano Free</strong>, já <strong>aprovada</strong> e vinculada à categoria informada.
              Duplicatas (mesmo nome + categoria) são puladas automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="mr-1 h-4 w-4" /> Baixar modelo CSV
              </Button>
              <Button type="button" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-1 h-4 w-4" /> Escolher arquivo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f).catch((err) => toast.error(err.message));
                  e.target.value = "";
                }}
              />
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground">Colunas da planilha (todas obrigatórias exceto telefone):</p>
              <p className="mt-1"><code>name, category, address, phone</code></p>
              <p className="mt-2"><strong>category</strong> pode ser o slug (<code>alimentacao</code>) ou o nome (<code>Alimentação</code>).</p>
            </div>

            {rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> {okCount} válidas
                  </span>
                  {dupCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-amber-600">
                      {dupCount} duplicadas (puladas)
                    </span>
                  )}
                  {errCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-destructive">
                      <AlertCircle className="h-3 w-3" /> {errCount} inválidas
                    </span>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-muted">
                      <tr>
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Nome</th>
                        <th className="p-2 text-left">Categoria</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.index} className="border-t border-border">
                          <td className="p-2 text-muted-foreground">{r.index}</td>
                          <td className="p-2">{r.raw.name || <span className="text-muted-foreground">—</span>}</td>
                          <td className="p-2">{r.raw.category}{r.raw.subcategory ? ` / ${r.raw.subcategory}` : ""}</td>
                          <td className="p-2">
                            {r.status === "ok" && <span className="text-emerald-600">OK</span>}
                            {r.status === "duplicate" && <span className="text-amber-600">Duplicada</span>}
                            {r.status === "invalid" && <span className="text-destructive">{r.error}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {progress && (
              <div className="rounded-lg border border-border bg-card p-3 text-sm">
                <p><strong>{progress.ok}</strong> importadas · <strong>{progress.skip}</strong> puladas · <strong>{progress.err}</strong> com erro.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setRows([]); setProgress(null); }} disabled={importing}>
              Fechar
            </Button>
            <Button onClick={runImport} disabled={importing || okCount === 0}>
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Importar ${okCount || ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
