import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UtensilsCrossed } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { RestaurantCard } from "@/components/restaurant-card";
import {
  sampleRestaurants,
  RESTAURANT_FILTERS,
  type RestaurantCategory,
} from "@/lib/restaurants";

export const Route = createFileRoute("/onde-comer")({
  head: () => ({
    meta: [
      { title: "Onde Comer — Guia CS" },
      {
        name: "description",
        content: "Restaurantes, hamburguerias, pizzarias e mais em Comendador Soares.",
      },
    ],
  }),
  component: OndeComerPage,
});

function OndeComerPage() {
  const [filter, setFilter] = useState<RestaurantCategory | "todos">("todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return sampleRestaurants.filter((r) => {
      const matchCat = filter === "todos" || r.category === filter;
      const q = query.trim().toLowerCase();
      const matchQ =
        !q || r.name.toLowerCase().includes(q) || r.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [filter, query]);

  return (
    <AppShell title="Onde Comer" subtitle="Sabores do bairro">
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-card">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar restaurante..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      <div className="mb-4 -mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2 pb-1">
          {RESTAURANT_FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
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
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "lugar encontrado" : "lugares encontrados"}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="h-5 w-5" />}
          title="Nada por aqui"
          description="Tente outra categoria ou termo de busca."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </AppShell>
  );
}
