import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { Search, Store, Utensils, Scissors, Stethoscope, Wrench, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/guia")({
  head: () => ({
    meta: [
      { title: "Guia Comercial — Guia CS" },
      { name: "description", content: "Encontre estabelecimentos, serviços e comércios em Comendador Soares." },
    ],
  }),
  component: GuiaPage,
});

const categorias = [
  { label: "Alimentação", icon: Utensils },
  { label: "Beleza", icon: Scissors },
  { label: "Saúde", icon: Stethoscope },
  { label: "Serviços", icon: Wrench },
  { label: "Lojas", icon: ShoppingBag },
  { label: "Outros", icon: Store },
];

function GuiaPage() {
  return (
    <AppShell title="Guia comercial" subtitle="Descubra o que tem perto de você">
      <div className="mb-5 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Buscar comércio, serviço…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {categorias.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-card transition-transform active:scale-95"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium text-foreground">{label}</span>
          </button>
        ))}
      </div>

      <EmptyState
        icon={<Store className="h-5 w-5" />}
        title="Nenhum estabelecimento cadastrado"
        description="Em breve você verá aqui os comércios do bairro."
      />
    </AppShell>
  );
}
