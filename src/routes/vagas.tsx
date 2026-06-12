import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/vagas")({
  head: () => ({
    meta: [
      { title: "Vagas — Guia CS" },
      { name: "description", content: "Vagas de emprego e oportunidades no bairro Comendador Soares." },
    ],
  }),
  component: VagasPage,
});

function VagasPage() {
  return (
    <AppShell title="Vagas" subtitle="Oportunidades perto de casa">
      <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs">
        {["Todas", "CLT", "Freela"].map((t, i) => (
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
        icon={<Briefcase className="h-5 w-5" />}
        title="Nenhuma vaga publicada"
        description="Assim que comerciantes do bairro publicarem vagas, elas aparecerão aqui."
      />
    </AppShell>
  );
}
