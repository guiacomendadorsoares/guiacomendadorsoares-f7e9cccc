import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesGrid } from "@/components/categories-grid";
import { SectionHeader } from "@/components/cards";
import { EmptyState } from "@/components/ui-bits";
import {
  Bell,
  MapPin,
  Search,
  Briefcase,
  Home as HomeIcon,
  Calendar,
  Newspaper,
  Lightbulb,
  Building2,
  UtensilsCrossed,
} from "lucide-react";
import logoUrl from "@/assets/logo.png";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia Comendador Soares — O guia do bairro" },
      {
        name: "description",
        content:
          "Descubra empresas, vagas, imóveis, eventos e notícias do bairro Comendador Soares.",
      },
      { property: "og:title", content: "Guia Comendador Soares" },
      {
        property: "og:description",
        content: "O guia oficial do bairro: comércio, vagas, imóveis e comunidade.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <AppShell>
      <TopBar />
      <HeroCarousel />
      <InstallPrompt />

      <section className="mb-7">
        <SectionHeader title="Categorias" subtitle="Encontre tudo do bairro" />
        <CategoriesGrid />
      </section>

      <FeaturedCompanies />
      <LatestJobs />
      <RecentProperties />
      <UpcomingEvents />
      <NeighborhoodNews />
      <WhereToEat />
      <Curiosities />
    </AppShell>
  );
}

/* ---------- Top bar ---------- */

function TopBar() {
  return (
    <div className="-mx-5 -mt-4 mb-4 px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-3">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="Guia Comendador Soares" className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <p className="font-display text-[13px] font-extrabold text-foreground">Guia CS</p>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5" /> Comendador Soares
            </p>
          </div>
        </Link>
        <button
          aria-label="Notificações"
          className="relative ml-auto grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground shadow-card"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold ring-2 ring-card" />
        </button>
      </div>
      <Link
        to="/guia"
        className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-card"
      >
        <Search className="h-4 w-4 text-primary" />
        <span>O que você procura hoje?</span>
      </Link>
    </div>
  );
}

/* ---------- Section helpers ---------- */

function useApprovedCount(table: "businesses" | "jobs" | "properties" | "events" | "news" | "curiosities") {
  return useQuery({
    queryKey: ["home-count", table],
    queryFn: async () => {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");
      return count ?? 0;
    },
  });
}

function FeaturedCompanies() {
  const { data: count } = useApprovedCount("businesses");
  return (
    <section className="mb-7">
      <SectionHeader title="Empresas em destaque" subtitle="Os queridinhos do bairro" to="/guia" />
      {!count ? (
        <EmptyState icon={<Building2 className="h-5 w-5" />} title="Nenhuma empresa cadastrada ainda." description="Em breve, as empresas do bairro estarão por aqui." />
      ) : (
        <Link to="/guia" className="block rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">
          Ver {count} empresa{count === 1 ? "" : "s"} no guia →
        </Link>
      )}
    </section>
  );
}

function LatestJobs() {
  const { data: count } = useApprovedCount("jobs");
  return (
    <section className="mb-7">
      <SectionHeader title="Últimas vagas" subtitle="Trabalhe perto de casa" to="/vagas" />
      {!count ? (
        <EmptyState icon={<Briefcase className="h-5 w-5" />} title="Nenhuma vaga publicada." description="As empresas parceiras ainda não publicaram oportunidades." />
      ) : (
        <Link to="/vagas" className="block rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">
          Ver {count} vaga{count === 1 ? "" : "s"} →
        </Link>
      )}
    </section>
  );
}

function RecentProperties() {
  const { data: count } = useApprovedCount("properties");
  return (
    <section className="mb-7">
      <SectionHeader title="Imóveis recentes" subtitle="Alugar e comprar" to="/imoveis" />
      {!count ? (
        <EmptyState icon={<HomeIcon className="h-5 w-5" />} title="Nenhum imóvel disponível." description="Em breve novos imóveis pelos corretores parceiros." />
      ) : (
        <Link to="/imoveis" className="block rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">
          Ver {count} imóve{count === 1 ? "l" : "is"} →
        </Link>
      )}
    </section>
  );
}

function UpcomingEvents() {
  const { data: count } = useApprovedCount("events");
  return (
    <section className="mb-7">
      <SectionHeader title="Eventos próximos" subtitle="Acontece pertinho de você" />
      {!count ? (
        <EmptyState icon={<Calendar className="h-5 w-5" />} title="Nenhum evento cadastrado." description="Eventos do bairro aparecerão aqui assim que forem publicados." />
      ) : (
        <p className="rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">{count} evento{count === 1 ? "" : "s"} agendado{count === 1 ? "" : "s"}</p>
      )}
    </section>
  );
}

function NeighborhoodNews() {
  const { data: count } = useApprovedCount("news");
  return (
    <section className="mb-7">
      <SectionHeader title="Notícias do bairro" subtitle="Fique por dentro" to="/noticias" />
      {!count ? (
        <EmptyState icon={<Newspaper className="h-5 w-5" />} title="Nenhuma notícia disponível." description="A redação está preparando os próximos conteúdos." />
      ) : (
        <Link to="/noticias" className="block rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">
          Ver {count} notícia{count === 1 ? "" : "s"} →
        </Link>
      )}
    </section>
  );
}

function WhereToEat() {
  return (
    <section className="mb-7">
      <SectionHeader title="Onde comer" subtitle="Os favoritos da vizinhança" to="/onde-comer" />
      <EmptyState icon={<UtensilsCrossed className="h-5 w-5" />} title="Nenhum restaurante cadastrado ainda." description="Em breve os estabelecimentos do bairro estarão aqui." />
    </section>
  );
}

function Curiosities() {
  const { data: count } = useApprovedCount("curiosities");
  return (
    <section className="mb-2">
      <SectionHeader title="Curiosidades" subtitle="Você sabia?" />
      {!count ? (
        <EmptyState icon={<Lightbulb className="h-5 w-5" />} title="Nenhuma curiosidade cadastrada ainda." description="Histórias e fatos do bairro aparecerão aqui em breve." />
      ) : (
        <p className="rounded-2xl border border-border bg-card p-4 text-center text-sm font-semibold text-primary shadow-card">{count} curiosidade{count === 1 ? "" : "s"} disponíve{count === 1 ? "l" : "is"}</p>
      )}
    </section>
  );
}

