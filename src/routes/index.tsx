import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesGrid } from "@/components/categories-grid";
import { SectionHeader } from "@/components/cards";
import { getDisplayImageUrl } from "@/lib/storage";
import { MapPin, Search, Sparkles } from "lucide-react";
import { NotificationsBell } from "@/components/notifications-bell";
import logoUrl from "@/assets/logo.png";
import phEmpresa from "@/assets/placeholders/empresa.jpg.asset.json";
import phEmpresa2 from "@/assets/placeholders/empresa-2.jpg.asset.json";
import phEmpresa3 from "@/assets/placeholders/empresa-3.jpg.asset.json";
import phVaga from "@/assets/placeholders/vaga.jpg.asset.json";
import phVaga2 from "@/assets/placeholders/vaga-2.jpg.asset.json";
import phVaga3 from "@/assets/placeholders/vaga-3.jpg.asset.json";
import phImovel from "@/assets/placeholders/imovel.jpg.asset.json";
import phImovel2 from "@/assets/placeholders/imovel-2.jpg.asset.json";
import phImovel3 from "@/assets/placeholders/imovel-3.jpg.asset.json";
import phEvento from "@/assets/placeholders/evento.jpg.asset.json";
import phEvento2 from "@/assets/placeholders/evento-2.jpg.asset.json";
import phEvento3 from "@/assets/placeholders/evento-3.jpg.asset.json";
import phNoticia from "@/assets/placeholders/noticia.jpg.asset.json";
import phNoticia2 from "@/assets/placeholders/noticia-2.jpg.asset.json";
import phNoticia3 from "@/assets/placeholders/noticia-3.jpg.asset.json";
import phComer from "@/assets/placeholders/comer.jpg.asset.json";
import phComer2 from "@/assets/placeholders/comer-2.jpg.asset.json";
import phComer3 from "@/assets/placeholders/comer-3.jpg.asset.json";
import phCuriosidade from "@/assets/placeholders/curiosidade.jpg.asset.json";
import phCuriosidade2 from "@/assets/placeholders/curiosidade-2.jpg.asset.json";
import phCuriosidade3 from "@/assets/placeholders/curiosidade-3.jpg.asset.json";

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
        <div className="ml-auto">
          <NotificationsBell variant="card" />
        </div>
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

/* ---------- Shared row helpers ---------- */

type ApprovedItem = {
  id: string;
  name?: string;
  title?: string;
  cover_url?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  featured?: boolean;
};

function useApprovedItems(table: "businesses" | "jobs" | "properties" | "events" | "news" | "curiosities") {
  return useQuery({
    queryKey: ["home-items", table],
    queryFn: async () => {
      const hasFeatured = table === "businesses" || table === "properties";
      const cols = table === "businesses"
        ? "id,name,logo_url,banner_url,featured"
        : hasFeatured
        ? "id,title,cover_url,featured"
        : "id,title,cover_url";
      let q = supabase.from(table).select(cols).eq("status", "approved");
      if (hasFeatured) q = q.order("featured", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data, error } = await q.limit(3);
      if (error) {
        console.error(`[home] ${table} fetch error:`, error.message);
        return [];
      }
      return Promise.all(
        ((data ?? []) as unknown as ApprovedItem[]).map(async (item) => ({
          ...item,
          cover_url: await getDisplayImageUrl(item.cover_url ?? item.banner_url ?? item.logo_url ?? null),
          banner_url: await getDisplayImageUrl(item.banner_url ?? null),
          logo_url: await getDisplayImageUrl(item.logo_url ?? null),
        })),
      );
    },
  });
}

type PHCard = { title: string; subtitle: string; image: string };

function PlaceholderRow({ cards }: { cards: PHCard[] }) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {cards.map((c, i) => (
        <article
          key={i}
          className="relative min-w-[230px] max-w-[230px] overflow-hidden rounded-2xl border border-border bg-card shadow-card"
        >
          <div className="relative h-32 w-full overflow-hidden">
            <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3" /> Em breve
            </span>
          </div>
          <div className="p-3">
            <p className="text-sm font-semibold leading-tight">{c.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function RealRow({ items, to, fallbackImage }: { items: ApprovedItem[]; to: (id: string) => string; fallbackImage: string }) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((it) => {
        const cover = it.cover_url || it.banner_url || fallbackImage;
        const title = it.name || it.title || "Sem título";
        return (
          <Link
            key={it.id}
            to={to(it.id)}
            className="relative min-w-[230px] max-w-[230px] overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
          >
            <div className="relative h-32 w-full overflow-hidden">
              <img src={cover} alt={title} loading="lazy" className="h-full w-full object-cover" />
              {it.featured ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-gold-foreground">
                  <Sparkles className="h-3 w-3" /> Ouro
                </span>
              ) : null}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold leading-tight line-clamp-2">{title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/* ---------- Sections ---------- */

function FeaturedCompanies() {
  const { data: items = [] } = useApprovedItems("businesses");
  const placeholders: PHCard[] = [
    { title: "Sua empresa aqui", subtitle: "Anuncie seu negócio e apareça em destaque.", image: phEmpresa.url },
    { title: "Comércio local", subtitle: "Conecte-se com clientes da sua vizinhança.", image: phEmpresa2.url },
    { title: "Plano Ouro", subtitle: "Tenha prioridade no guia com o premium.", image: phEmpresa3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Empresas em destaque" subtitle="Os queridinhos do bairro" to="/guia" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => `/empresa/${id}`} fallbackImage={phEmpresa.url} />}
    </section>
  );
}

function LatestJobs() {
  const { data: items = [] } = useApprovedItems("jobs");
  const placeholders: PHCard[] = [
    { title: "Vagas no bairro", subtitle: "Empresas locais publicarão oportunidades aqui.", image: phVaga.url },
    { title: "Trabalhe perto de casa", subtitle: "Menos deslocamento, mais qualidade de vida.", image: phVaga2.url },
    { title: "Cadastre sua vaga", subtitle: "Encontre talentos da vizinhança.", image: phVaga3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Últimas vagas" subtitle="Trabalhe perto de casa" to="/vagas" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={() => "/vagas"} fallbackImage={phVaga.url} />}
    </section>
  );
}

function RecentProperties() {
  const { data: items = [] } = useApprovedItems("properties");
  const placeholders: PHCard[] = [
    { title: "Casas para alugar", subtitle: "Confira opções por aqui em breve.", image: phImovel.url },
    { title: "Imóveis à venda", subtitle: "Corretores parceiros publicam aqui.", image: phImovel2.url },
    { title: "Terrenos", subtitle: "Oportunidades para investir no bairro.", image: phImovel3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Imóveis recentes" subtitle="Alugar e comprar" to="/imoveis" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => `/imoveis/${id}`} fallbackImage={phImovel.url} />}
    </section>
  );
}

function UpcomingEvents() {
  const { data: items = [] } = useApprovedItems("events");
  const placeholders: PHCard[] = [
    { title: "Festas do bairro", subtitle: "Eventos da comunidade aparecerão aqui.", image: phEvento.url },
    { title: "Shows e feiras", subtitle: "Fique por dentro da agenda local.", image: phEvento2.url },
    { title: "Encontros culturais", subtitle: "Cultura e lazer pertinho de você.", image: phEvento3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Eventos próximos" subtitle="Acontece pertinho de você" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={() => "/"} fallbackImage={phEvento.url} />}
    </section>
  );
}

function NeighborhoodNews() {
  const { data: items = [] } = useApprovedItems("news");
  const placeholders: PHCard[] = [
    { title: "Notícias do bairro", subtitle: "A redação está preparando os conteúdos.", image: phNoticia.url },
    { title: "Comunidade", subtitle: "Histórias dos moradores.", image: phNoticia2.url },
    { title: "Acontece em CS", subtitle: "Acompanhe o que rola por aqui.", image: phNoticia3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Notícias do bairro" subtitle="Fique por dentro" to="/noticias" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={() => "/noticias"} fallbackImage={phNoticia.url} />}
    </section>
  );
}

function WhereToEat() {
  const placeholders: PHCard[] = [
    { title: "Restaurantes locais", subtitle: "Os favoritos da vizinhança em breve.", image: phComer.url },
    { title: "Lanchonetes", subtitle: "Sabores do bairro pertinho de você.", image: phComer2.url },
    { title: "Cafés e padarias", subtitle: "Comece bem o dia no comércio local.", image: phComer3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Onde comer" subtitle="Os favoritos da vizinhança" to="/onde-comer" />
      <PlaceholderRow cards={placeholders} />
    </section>
  );
}

function Curiosities() {
  const { data: items = [] } = useApprovedItems("curiosities");
  const placeholders: PHCard[] = [
    { title: "Você sabia?", subtitle: "Histórias e fatos do bairro em breve.", image: phCuriosidade.url },
    { title: "Memórias de CS", subtitle: "O passado contado pelos moradores.", image: phCuriosidade2.url },
    { title: "Cantinhos do bairro", subtitle: "Lugares que poucos conhecem.", image: phCuriosidade3.url },
  ];
  return (
    <section className="mb-2">
      <SectionHeader title="Curiosidades" subtitle="Você sabia?" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={() => "/"} fallbackImage={phCuriosidade.url} />}
    </section>
  );
}
