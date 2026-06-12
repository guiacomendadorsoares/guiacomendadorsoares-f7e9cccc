import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { Building2 } from "lucide-react";

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
  return (
    <AppShell title="Imóveis" subtitle="Alugar e comprar no bairro">
      <div className="mb-5 grid grid-cols-2 gap-2 text-center text-xs">
        {["Alugar", "Comprar"].map((t, i) => (
          <button
            key={t}
            className={`rounded-full px-3 py-2 font-semibold transition-colors ${
              i === 0
                ? "gradient-brand text-primary-foreground shadow-elegant"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <EmptyState
        icon={<Building2 className="h-5 w-5" />}
        title="Nenhum imóvel anunciado"
        description="Imobiliárias e proprietários do bairro logo estarão por aqui."
      />
    </AppShell>
  );
}
