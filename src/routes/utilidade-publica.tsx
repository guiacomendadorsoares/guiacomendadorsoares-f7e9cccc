import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, Copy, Share2, Navigation, Mail, Globe, MapPin, AlertTriangle, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { directionsUrl } from "@/lib/geocode";
import imgPrefeitura from "@/assets/util/prefeitura.jpg";
import imgOuvidoria from "@/assets/util/ouvidoria.jpg";
import imgDefesa from "@/assets/util/defesa-civil.jpg";
import imgEmergencia from "@/assets/util/emergencia.jpg";
import imgSecretarias from "@/assets/util/secretarias.jpg";
import imgOrgaos from "@/assets/util/orgaos.jpg";

const CATEGORY_IMAGES: Record<string, string> = {
  "Prefeitura": imgPrefeitura,
  "Ouvidoria": imgOuvidoria,
  "Defesa Civil": imgDefesa,
  "Emergência": imgEmergencia,
  "Secretarias Municipais": imgSecretarias,
  "Órgãos Municipais": imgOrgaos,
};

type PublicService = {
  id: string;
  name: string;
  category: string;
  phone: string | null;
  phones: string[] | null;
  email: string | null;
  website: string | null;
  address: string | null;
  hours: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  source: string | null;
  is_emergency: boolean;
  active: boolean;
};

const FILTERS = [
  { key: "all", label: "Todos" },
  { key: "emergency", label: "Emergência" },
  { key: "Prefeitura", label: "Prefeitura" },
  { key: "Ouvidoria", label: "Ouvidoria" },
  { key: "Defesa Civil", label: "Defesa Civil" },
  { key: "Secretarias Municipais", label: "Secretarias" },
  { key: "Órgãos Municipais", label: "Órgãos" },
];

export const Route = createFileRoute("/utilidade-publica")({
  component: UtilidadePublicaPage,
  head: () => ({
    meta: [
      { title: "Utilidade Pública — Guia Comendador Soares" },
      {
        name: "description",
        content:
          "Contatos oficiais da Prefeitura de Nova Iguaçu: emergências, secretarias, ouvidoria, defesa civil e órgãos municipais.",
      },
    ],
  }),
});

function copyText(value: string) {
  navigator.clipboard?.writeText(value).then(
    () => toast.success("Copiado!"),
    () => toast.error("Não foi possível copiar"),
  );
}

function shareService(s: PublicService) {
  const text = [s.name, s.phones?.join(" / "), s.address, s.website].filter(Boolean).join("\n");
  if (navigator.share) {
    navigator.share({ title: s.name, text }).catch(() => {});
  } else {
    copyText(text);
  }
}

function ServiceCard({ s }: { s: PublicService }) {
  const phones = (s.phones ?? []).filter(Boolean);
  if (s.phone) phones.unshift(s.phone);
  const primary = phones[0];
  return (
    <article
      className={`rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant ${
        s.is_emergency ? "border-destructive/40" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.category}</p>
          <h3 className="font-display text-lg font-bold leading-tight">{s.name}</h3>
        </div>
        {s.is_emergency && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-bold uppercase text-destructive">
            <AlertTriangle className="h-3 w-3" /> SOS
          </span>
        )}
      </div>

      {s.description && <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>}

      <div className="mt-3 space-y-1.5 text-sm">
        {phones.map((p) => (
          <div key={p} className="flex items-center gap-2 text-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${p.replace(/\D/g, "")}`} className="font-semibold hover:underline">
              {p}
            </a>
          </div>
        ))}
        {s.email && (
          <div className="flex items-center gap-2 text-foreground">
            <Mail className="h-4 w-4 text-primary" />
            <a href={`mailto:${s.email}`} className="hover:underline">
              {s.email}
            </a>
          </div>
        )}
        {s.website && (
          <div className="flex items-center gap-2 text-foreground">
            <Globe className="h-4 w-4 text-primary" />
            <a href={s.website} target="_blank" rel="noreferrer" className="truncate hover:underline">
              {s.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
        {s.address && (
          <div className="flex items-start gap-2 text-foreground">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <span>{s.address}</span>
          </div>
        )}
        {s.hours && <p className="text-xs text-muted-foreground">{s.hours}</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {primary && (
          <Button asChild size="sm" className="rounded-full">
            <a href={`tel:${primary.replace(/\D/g, "")}`}>
              <Phone className="h-4 w-4" /> Ligar
            </a>
          </Button>
        )}
        {primary && (
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => copyText(primary)}>
            <Copy className="h-4 w-4" /> Copiar
          </Button>
        )}
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => shareService(s)}>
          <Share2 className="h-4 w-4" /> Compartilhar
        </Button>
        {(s.address || (s.latitude && s.longitude)) && (
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <a
              href={
                s.latitude && s.longitude
                  ? directionsUrl(s.latitude, s.longitude, s.name)
                  : `https://www.openstreetmap.org/search?query=${encodeURIComponent(s.address ?? "")}`
              }
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" /> Como chegar
            </a>
          </Button>
        )}
      </div>

      {s.source && (
        <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          Fonte oficial: Prefeitura de Nova Iguaçu
        </p>
      )}
    </article>
  );
}

function UtilidadePublicaPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["public_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_services")
        .select("*")
        .eq("active", true)
        .order("is_emergency", { ascending: false })
        .order("name");
      if (error) throw error;
      return (data ?? []) as PublicService[];
    },
  });

  const filtered = useMemo(() => {
    let rows = data ?? [];
    if (filter === "emergency") rows = rows.filter((r) => r.is_emergency);
    else if (filter !== "all") rows = rows.filter((r) => r.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [data, filter, search]);

  return (
    <AppShell
      title="Utilidade Pública"
      subtitle="Contatos oficiais de Nova Iguaçu"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar serviço, secretaria ou contato…"
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f.key
                  ? "border-primary bg-primary text-primary-foreground shadow-elegant"
                  : "border-border bg-card text-foreground/80 hover:border-primary/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
            Nenhum serviço encontrado.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
