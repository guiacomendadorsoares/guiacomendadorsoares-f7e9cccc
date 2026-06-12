import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { BusinessCard } from "@/components/business-card";
import {
  CATEGORY_FILTERS,
  SAMPLE_BUSINESSES,
  type BusinessCategory,
} from "@/lib/businesses";
import { Search, SlidersHorizontal, Store, MapPin } from "lucide-react";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guia Comercial — Guia CS" },
      {
        name: "description",
        content:
          "Encontre estabelecimentos, serviços e comércios em Comendador Soares.",
      },
    ],
  }),
  component: GuiaPage,
});

function GuiaPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BusinessCategory>("all");

  const results = useMemo(() => {
    return SAMPLE_BUSINESSES.filter((b) => {
      const matchCat = category === "all" || b.category === category;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.categoryLabel.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  return (
    <AppShell title="Guia comercial" subtitle="Descubra o comércio do bairro">
      {/* Search */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar comércio, serviço…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          aria-label="Filtros"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full gradient-brand text-primary-foreground shadow-elegant"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Location pill (Google Maps style) */}
      <div className="mb-4 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <MapPin className="h-3 w-3 text-primary-vibrant" />
        Mostrando resultados em{" "}
        <span className="font-semibold text-foreground">Comendador Soares</span>
      </div>

      {/* Category filter pills */}
      <div className="-mx-5 mb-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-1">
          {CATEGORY_FILTERS.map((c) => {
            const active = c.id === category;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all " +
                  (active
                    ? "border-transparent gradient-brand text-primary-foreground shadow-elegant"
                    : "border-border bg-card text-foreground/80 hover:bg-secondary")
                }
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count */}
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{results.length}</span>{" "}
          {results.length === 1 ? "estabelecimento" : "estabelecimentos"}
        </p>
        <button className="text-xs font-semibold text-primary-vibrant">
          Ordenar
        </button>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <EmptyState
          icon={<Store className="h-5 w-5" />}
          title="Nenhum resultado"
          description="Tente outro termo ou remova os filtros."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((b) => (
            <BusinessCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
