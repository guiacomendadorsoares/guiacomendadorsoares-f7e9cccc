import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Building2, Briefcase, Home, Newspaper, Calendar, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

const TABLES = ["businesses", "jobs", "properties", "news", "events", "curiosities"] as const;

function useCounts() {
  return useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const out: Record<string, { total: number; pending: number; approved: number }> = {};
      await Promise.all(
        TABLES.map(async (t) => {
          const [total, pending, approved] = await Promise.all([
            supabase.from(t).select("*", { count: "exact", head: true }),
            supabase.from(t).select("*", { count: "exact", head: true }).eq("status", "pending"),
            supabase.from(t).select("*", { count: "exact", head: true }).eq("status", "approved"),
          ]);
          out[t] = { total: total.count ?? 0, pending: pending.count ?? 0, approved: approved.count ?? 0 };
        }),
      );
      const usersRes = await supabase.from("profiles").select("*", { count: "exact", head: true });
      return { byTable: out, users: usersRes.count ?? 0 };
    },
  });
}

const ICONS = {
  businesses: Building2, jobs: Briefcase, properties: Home,
  news: Newspaper, events: Calendar, curiosities: Sparkles,
} as const;

const LABELS = {
  businesses: "Empresas", jobs: "Vagas", properties: "Imóveis",
  news: "Notícias", events: "Eventos", curiosities: "Curiosidades",
} as const;

function AdminHome() {
  const { data, isLoading } = useCounts();
  const totalPending = data ? TABLES.reduce((acc, t) => acc + (data.byTable[t]?.pending ?? 0), 0) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Aprovações pendentes" value={isLoading ? "…" : totalPending} icon={CheckCircle2} accent="gold" href="/admin/aprovacoes" />
        <KpiCard label="Usuários" value={isLoading ? "…" : data?.users ?? 0} icon={Users} href="/admin/usuarios" />
        <KpiCard label="Empresas" value={isLoading ? "…" : data?.byTable.businesses.total ?? 0} icon={Building2} href="/admin/empresas" />
        <KpiCard label="Imóveis" value={isLoading ? "…" : data?.byTable.properties.total ?? 0} icon={Home} href="/admin/imoveis" />
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Conteúdo por módulo</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TABLES.map((t) => {
            const Icon = ICONS[t];
            const c = data?.byTable[t];
            return (
              <Link
                key={t}
                to={`/admin/${moduleRoute(t)}` as string}
                className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary hover:shadow-elegant"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold">{LABELS[t]}</h3>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="Total" value={c?.total ?? 0} />
                  <Stat label="Pendente" value={c?.pending ?? 0} tone="gold" />
                  <Stat label="Aprovado" value={c?.approved ?? 0} tone="primary" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function moduleRoute(t: string) {
  return { businesses: "empresas", jobs: "vagas", properties: "imoveis", news: "noticias", events: "eventos", curiosities: "curiosidades" }[t]!;
}

function KpiCard({ label, value, icon: Icon, accent, href }: { label: string; value: number | string; icon: any; accent?: "gold"; href: string }) {
  return (
    <Link to={href} className="rounded-2xl border border-border bg-card p-5 shadow-card transition hover:shadow-elegant">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${accent === "gold" ? "gradient-gold text-gold-foreground" : "gradient-brand text-primary-foreground"}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </Link>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "gold" | "primary" }) {
  return (
    <div>
      <p className={`font-display text-xl font-bold ${tone === "gold" ? "text-gold-foreground" : tone === "primary" ? "text-primary" : ""}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
