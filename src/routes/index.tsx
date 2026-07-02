import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { HomePopup } from "@/components/home-popup";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesGrid } from "@/components/categories-grid";
import { SectionHeader } from "@/components/cards";
import { getDisplayImageUrl } from "@/lib/storage";
import { MapPin, Search, Sparkles, ChevronRight, LifeBuoy, Phone, Landmark } from "lucide-react";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia Comendador Soares — O guia do bairro" },
      {
        name: "description",
        content:
          "Tudo o que você procura em Comendador Soares: empresas, serviços, vagas, imóveis, eventos e notícias.",
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

const PLACEHOLDER_HINTS = [
  "Academia",
  "Advogado",
  "Restaurante",
  "Farmácia",
  "Dentista",
  "Eletricista",
  "Pizzaria",
  "Mercado",
  "Pet Shop",
];

function HomePage() {
  return (
    <AppShell>
      <TopBar />
      <SearchHero />
      <HeroCarousel />
      <InstallPrompt />
      <HomePopup />

      <section className="mb-7">
        <SectionHeader title="Categorias" subtitle="Encontre tudo do bairro" to="/guia" />
        <CategoriesGrid />
      </section>

      <FeaturedCompanies />
      <WhereToEat />
      <LatestJobs />
      <RecentProperties />
      <NeighborhoodNews />
      <UpcomingEvents />
      <UtilidadePublicaHighlight />
    </AppShell>
  );
}

/* ---------- Top bar + Search hero ---------- */

function TopBar() {
  return (
    <div className="-mx-5 -mt-4 mb-3 px-5 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2">
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
    </div>
  );
}

function SearchHero() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % PLACEHOLDER_HINTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    navigate({ to: "/buscar", search: { q: term.trim() } });
  }

  return (
    <section className="relative -mx-5 mb-5 overflow-hidden px-5 pb-6 pt-2">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 0%, color-mix(in oklab, var(--primary) 22%, transparent) 0%, transparent 55%), radial-gradient(90% 70% at 100% 10%, color-mix(in oklab, var(--gold) 28%, transparent) 0%, transparent 60%)",
        }}
      />
      <h1 className="font-display text-[26px] font-black leading-[1.1] tracking-tight text-foreground sm:text-[30px]">
        Tudo o que você procura em <span className="text-primary">Comendador Soares</span>, em um só lugar.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Empresas, profissionais e serviços do bairro na palma da mão.
      </p>

      <form
        onSubmit={submit}
        className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 shadow-elegant"
      >
        <Search className="h-5 w-5 shrink-0 text-primary" />
        <div className="relative min-w-0 flex-1">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="O que você está procurando hoje?"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            aria-label="Buscar"
          />
          {term.length === 0 && (
            <span
              key={hintIndex}
              className="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-1 text-xs text-muted-foreground animate-fade-in sm:flex"
            >
              ex.: {PLACEHOLDER_HINTS[hintIndex]}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-card transition-transform active:scale-95"
        >
          Buscar
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PLACEHOLDER_HINTS.slice(0, 6).map((h) => (
          <Link
            key={h}
            to="/buscar"
            search={{ q: h }}
            className="rounded-full border border-border bg-card px-3 py-1 text-[11.5px] font-semibold text-foreground shadow-card hover:bg-secondary"
          >
            {h}
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Shared row helpers ---------- */

type ApprovedItem = {
  id: string;
  name?: string;
  title?: string;
  subtitle?: string | null;
  company?: string | null;
  summary?: string | null;
  address?: string | null;
  cover_url?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  featured?: boolean;
};

function useApprovedItems(
  table: "businesses" | "jobs" | "properties" | "events" | "news" | "curiosities",
  opts: { mainCategory?: string; limit?: number } = {},
) {
  const { mainCategory, limit = 3 } = opts;
  return useQuery({
    queryKey: ["home-items", table, mainCategory ?? "all", limit],
    queryFn: async () => {
      const hasFeatured = table === "businesses" || table === "properties";
      const cols = table === "businesses"
        ? "id,name,address,logo_url,banner_url,featured"
        : table === "jobs"
        ? "id,title,company,urgent"
        : table === "news"
        ? "id,title,summary,cover_url"
        : hasFeatured
        ? "id,title,cover_url,featured"
        : "id,title,cover_url";
      let q = supabase.from(table).select(cols).eq("status", "approved");
      if (table === "businesses" && mainCategory) q = (q as any).eq("main_category", mainCategory);
      if (hasFeatured) q = q.order("featured", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data, error } = await q.limit(limit);
      if (error) {
        console.error(`[home] ${table} fetch error:`, error.message);
        return [];
      }
      return Promise.all(
        ((data ?? []) as unknown as ApprovedItem[]).map(async (item) => ({
          ...item,
          subtitle: item.company ?? item.summary ?? item.address ?? null,
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

type HomeCardTarget =
  | { to: "/empresa/$id"; params: { id: string } }
  | { to: "/vagas/$id"; params: { id: string } }
  | { to: "/imoveis/$id"; params: { id: string } }
  | { to: "/eventos/$id"; params: { id: string } }
  | { to: "/noticias/$id"; params: { id: string } }
  | { to: "/curiosidades/$id"; params: { id: string } };

function RealRow({ items, to, fallbackImage }: { items: ApprovedItem[]; to: (id: string) => HomeCardTarget; fallbackImage: string }) {
  return (
    <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((it) => {
        const cover = it.cover_url || it.banner_url || fallbackImage;
        const title = it.name || it.title || "Sem título";
        const target = to(it.id);
        return (
          <Link
            key={it.id}
            to={target.to}
            params={target.params}
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
              {it.subtitle ? <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{it.subtitle}</p> : null}
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
      <SectionHeader title="Empresas em destaque" subtitle="Selecionadas com plano Ouro" to="/guia" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/empresa/$id", params: { id } })} fallbackImage={phEmpresa.url} />}
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
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/vagas/$id", params: { id } })} fallbackImage={phVaga.url} />}
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
      <SectionHeader title="Imóveis em destaque" subtitle="Alugar e comprar" to="/imoveis" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/imoveis/$id", params: { id } })} fallbackImage={phImovel.url} />}
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
      <SectionHeader title="Próximos eventos" subtitle="Acontece pertinho de você" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/eventos/$id", params: { id } })} fallbackImage={phEvento.url} />}
    </section>
  );
}

function NeighborhoodNews() {
  const { data: items = [] } = useApprovedItems("news", { limit: 5 });
  const placeholders: PHCard[] = [
    { title: "Notícias do bairro", subtitle: "A redação está preparando os conteúdos.", image: phNoticia.url },
    { title: "Comunidade", subtitle: "Histórias dos moradores.", image: phNoticia2.url },
    { title: "Acontece em CS", subtitle: "Acompanhe o que rola por aqui.", image: phNoticia3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Notícias do bairro" subtitle="As 5 mais recentes" to="/noticias" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/noticias/$id", params: { id } })} fallbackImage={phNoticia.url} />}
    </section>
  );
}

function WhereToEat() {
  const { data: items = [] } = useApprovedItems("businesses", { mainCategory: "alimentacao" });
  const placeholders: PHCard[] = [
    { title: "Restaurantes locais", subtitle: "Os favoritos da vizinhança em breve.", image: phComer.url },
    { title: "Lanchonetes", subtitle: "Sabores do bairro pertinho de você.", image: phComer2.url },
    { title: "Cafés e padarias", subtitle: "Comece bem o dia no comércio local.", image: phComer3.url },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Onde comer" subtitle="Restaurantes, pizzarias, açaí e mais" to="/onde-comer" />
      {items.length === 0 ? <PlaceholderRow cards={placeholders} /> : <RealRow items={items} to={(id) => ({ to: "/empresa/$id", params: { id } })} fallbackImage={phComer.url} />}
    </section>
  );
}

function UtilidadePublicaHighlight() {
  return (
    <section className="mb-2">
      <Link
        to="/utilidade-publica"
        className="group relative block overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-card to-gold/15 p-5 shadow-card transition-transform hover:-translate-y-0.5 hover:shadow-elegant"
      >
        <div className="flex items-start gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white"
            style={{
              background: "linear-gradient(135deg, #7a1f1f 0%, #d64545 100%)",
              boxShadow: "0 12px 24px -10px #7a1f1fcc, inset 0 1px 0 rgba(255,255,255,0.28)",
            }}
          >
            <LifeBuoy className="h-7 w-7 drop-shadow" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-black text-foreground">Utilidade Pública</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Emergências, telefones úteis e Prefeitura em um só lugar.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                <Phone className="h-3 w-3 text-primary" /> Emergência
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                <Phone className="h-3 w-3 text-primary" /> Telefones úteis
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                <Landmark className="h-3 w-3 text-primary" /> Prefeitura
              </span>
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}
