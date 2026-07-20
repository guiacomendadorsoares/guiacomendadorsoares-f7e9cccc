import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/ui-bits";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Guia Comendador Soares" },
      { name: "description", content: "Seus lugares, vagas e conteúdos favoritos do bairro." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: FavoritosPage,
});

function FavoritosPage() {
  return (
    <AppShell title="Favoritos" subtitle="Seus salvos ficam aqui">
      <div className="mx-auto w-full max-w-2xl">
        <EmptyState
          icon={<Heart className="h-5 w-5" />}
          title="Em breve"
          description="Você vai poder salvar empresas, imóveis, vagas, eventos e notícias favoritos."
        />
        <div className="mt-4 flex justify-center">
          <Link
            to="/guia"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-elegant"
          >
            Explorar o Guia
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
