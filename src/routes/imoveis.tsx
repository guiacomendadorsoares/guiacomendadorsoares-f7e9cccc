import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { PropertyCard } from "@/components/property-card";
import {
  sampleProperties,
  LISTING_FILTERS,
  KIND_FILTERS,
  type ListingType,
  type PropertyKind,
} from "@/lib/properties";
import { Search, Building2 } from "lucide-react";

export const Route = createFileRoute("/imoveis")({
  head: () => ({
    meta: [
      { title: "Imóveis — Guia CS" },
      { name: "description", content: "Imóveis para alugar e comprar em Comendador Soares." },
    ],
  }),
  component: ImoveisPage,
});

function ImoveisPage() {
  const [listingFilter, setListingFilter] = useState<ListingType | "todos">("todos");
  const [kindFilter, setKindFilter] = useState<PropertyKind | "todos">("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return sampleProperties.filter((p) => {
      const matchListing = listingFilter === "todos" || p.listingType === listingFilter;
      const matchKind = kindFilter === "todos" || p.kind === kindFilter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.kindLabel.toLowerCase().includes(q);
      return matchListing && matchKind && matchQuery;
    });
  }, [listingFilter, kindFilter, query]);

  return (
    <AppShell title="Imóveis" subtitle="Alugar e comprar no bairro">
      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-card">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por endereço, tipo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Listing type filter (Venda / Aluguel) */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {LISTING_FILTERS.map((f) => {
          const active = listingFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setListingFilter(f.value)}
              className={`rounded-full px-3 py-2 text-center text-xs font-semibold transition-all active:scale-95 ${
                active
                  ? "gradient-brand text-primary-foreground shadow-elegant"
                  : "border border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Kind sub-filter (horizontal scroll) */}
      <div className="mb-4 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-1">
          {KIND_FILTERS.map((f) => {
            const active = kindFilter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setKindFilter(f.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                  active
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <p className="mb-3 text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-5 w-5" />}
          title="Nenhum imóvel encontrado"
          description="Tente ajustar os filtros ou busque por outro termo."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
