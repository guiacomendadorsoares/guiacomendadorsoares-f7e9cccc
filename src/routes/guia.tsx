import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { CategoryTile } from "@/components/category-tile";
import { GuiaBusinessCard } from "@/components/guia-business-card";
import { CATEGORIES } from "@/lib/guia-taxonomy";
import { fetchBusinesses, fetchCategoryCounts } from "@/services/businesses.service";
import { Search, Store, ChevronDown, MapPin } from "lucide-react";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guia Comercial — Guia CS" },
      { name: "description", content: "Encontre estabelecimentos, serviços e comércios em Comendador Soares." },
      { property: "og:title", content: "Guia Comercial — Guia CS" },
      { property: "og:description", content: "A vitrine digital do comércio de Comendador Soares." },
    ],
  }),
  component: GuiaHome,
});

function GuiaHome() {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { data: counts = {} } = useQuery({
    queryKey: ["guia", "counts"],
    queryFn: fetchCategoryCounts,
  });

  const { data: all = [] } = useQuery({
    queryKey: ["guia", "all"],
    queryFn: fetchBusinesses,
    enabled: query.trim().length >= 2,
  });

  const visibleCategories = useMemo(
    () => (showAll ? CATEGORIES : CATEGORIES.filter((c) => c.showOnHome)),
    [showAll],
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return all.filter((b) => {
      const name = b.name.toLowerCase();
      const cat = (b.main_category ?? "").toLowerCase();
      const sub = (b.subcategory ?? "").toLowerCase();
      return name.includes(q) || cat.includes(q) || sub.includes(q);
    }).slice(0, 30);
  }, [all, query]);

  return (
    <AppShell title="Guia comercial" subtitle="Descubra o comércio do bairro">
      {/* Busca global */}
      <div className="mb-3 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empresa, categoria ou serviço…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
        <MapPin className="h-3 w-3 text-primary-vibrant" />
        Resultados em <span className="font-semibold text-foreground">Comendador Soares</span>
      </div>

      {/* Resultados de busca global */}
      {query.trim().length >= 2 ? (
        <section className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {searchResults.length} resultado{searchResults.length === 1 ? "" : "s"}
          </h2>
          {searchResults.length === 0 ? (
            <EmptyState
              icon={<Store className="h-5 w-5" />}
              title="Nada encontrado"
              description="Tente outro termo ou explore as categorias abaixo."
            />
          ) : (
            <div className="flex flex-col gap-3">
              {searchResults.map((b) => <GuiaBusinessCard key={b.id} b={b} />)}
            </div>
          )}
        </section>
      ) : null}

      {/* Grid de categorias */}
      <section>
        <h2 className="mb-3 font-display text-base font-bold">Categorias</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {visibleCategories.map((c) => (
            <CategoryTile key={c.slug} c={c} count={counts[c.slug]} />
          ))}
        </div>

        {!showAll && CATEGORIES.length > visibleCategories.length && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-foreground shadow-card transition-all hover:bg-secondary"
          >
            Ver todas as categorias <ChevronDown className="h-4 w-4" />
          </button>
        )}

        {showAll && (
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="mt-4 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Mostrar menos
          </button>
        )}
      </section>

      {/* Anuncie */}
      <div className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-gold/10 p-5 text-center shadow-card">
        <p className="font-display text-base font-bold">É dono de um negócio?</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Cadastre sua empresa e apareça para milhares de moradores.
        </p>
        <Link
          to="/anuncie"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-elegant"
        >
          Anunciar agora
        </Link>
      </div>
    </AppShell>
  );
}
