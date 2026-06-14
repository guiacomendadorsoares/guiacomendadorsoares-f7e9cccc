import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { InstallPrompt } from "@/components/install-prompt";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesGrid } from "@/components/categories-grid";
import { GlassCard, HScroll, SectionHeader } from "@/components/cards";
import {
  Search,
  Bell,
  Star,
  MapPin,
  Briefcase,
  Home as HomeIcon,
  Bed,
  Bath,
  Calendar,
  Newspaper,
  Lightbulb,
} from "lucide-react";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import event1 from "@/assets/event-1.jpg";
import news1 from "@/assets/news-1.jpg";
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

/* ---------- Featured companies ---------- */

type Company = { name: string; cat: string; rating: number; tag?: string };
const companies: Company[] = [
  { name: "Padaria do Sô", cat: "Padaria · Café", rating: 4.9, tag: "Top do bairro" },
  { name: "Auto Center JR", cat: "Mecânica", rating: 4.8 },
  { name: "Studio Bella", cat: "Beleza", rating: 4.9, tag: "Novo" },
];

function FeaturedCompanies() {
  return (
    <section className="mb-7">
      <SectionHeader title="Empresas em destaque" subtitle="Os queridinhos do bairro" to="/guia" />
      <HScroll>
        {companies.map((c) => (
          <GlassCard interactive key={c.name} className="w-[220px] shrink-0 overflow-hidden">
            <div
              className="relative h-24 w-full"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-vibrant) 100%)",
              }}
            >
              {c.tag && (
                <span className="absolute left-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow-gold">
                  {c.tag}
                </span>
              )}
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                <Star className="h-3 w-3 fill-gold text-gold" /> {c.rating}
              </span>
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-bold text-foreground">{c.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{c.cat}</p>
            </div>
          </GlassCard>
        ))}
      </HScroll>
    </section>
  );
}

/* ---------- Latest jobs ---------- */

type Job = { title: string; company: string; type: string; salary: string };
const jobs: Job[] = [
  { title: "Atendente de loja", company: "Mercadinho Bom Preço", type: "CLT", salary: "R$ 1.600" },
  { title: "Auxiliar administrativo", company: "Imobiliária CS", type: "CLT", salary: "R$ 1.800" },
  { title: "Garçom", company: "Cantina da Esquina", type: "CLT", salary: "R$ 1.500 + gorjetas" },
];

function LatestJobs() {
  return (
    <section className="mb-7">
      <SectionHeader title="Últimas vagas" subtitle="Trabalhe perto de casa" to="/vagas" />
      <div className="space-y-2.5">
        {jobs.map((j) => (
          <GlassCard interactive key={j.title} className="p-3.5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-elegant">
                <Briefcase className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-foreground">
                  {j.title}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{j.company}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[11px] font-semibold text-primary-vibrant">{j.salary}</p>
                <span className="mt-0.5 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                  {j.type}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ---------- Recent properties ---------- */

type Property = { title: string; price: string; rooms: number; baths: number; area: string };
const props: Property[] = [
  { title: "Apto 2 quartos — Centro", price: "R$ 1.200/mês", rooms: 2, baths: 1, area: "55m²" },
  { title: "Casa com quintal", price: "R$ 1.800/mês", rooms: 3, baths: 2, area: "90m²" },
];

function RecentProperties() {
  return (
    <section className="mb-7">
      <SectionHeader title="Imóveis recentes" subtitle="Alugar e comprar" to="/imoveis" />
      <HScroll>
        {props.map((p) => (
          <GlassCard interactive key={p.title} className="w-[260px] shrink-0 overflow-hidden">
            <div
              className="grid h-28 place-items-center"
              style={{ background: "linear-gradient(135deg, #1f3a2e, #4a8a6b)" }}
            >
              <HomeIcon className="h-10 w-10 text-white/80" />
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-bold text-foreground">{p.title}</p>
              <p className="mt-0.5 text-[13px] font-bold text-primary-vibrant">{p.price}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Bed className="h-3.5 w-3.5" /> {p.rooms}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" /> {p.baths}
                </span>
                <span>{p.area}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </HScroll>
    </section>
  );
}

/* ---------- Upcoming events ---------- */

function UpcomingEvents() {
  const events = [
    { date: "Sáb 14", title: "Feirinha da Praça", place: "Praça Central", img: event1 },
    { date: "Dom 22", title: "Roda de samba do bairro", place: "Bar do Léo", img: event1 },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Eventos próximos" subtitle="Acontece pertinho de você" />
      <div className="space-y-3">
        {events.map((e) => (
          <GlassCard interactive key={e.title} className="flex gap-3 overflow-hidden p-2">
            <img
              src={e.img}
              alt=""
              loading="lazy"
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                <Calendar className="h-3 w-3" /> {e.date}
              </span>
              <p className="mt-1 truncate font-display text-sm font-bold text-foreground">
                {e.title}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{e.place}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ---------- Neighborhood news ---------- */

function NeighborhoodNews() {
  const items = [
    {
      tag: "Comunidade",
      title: "Mutirão de limpeza reúne moradores na praça",
      img: news1,
    },
    {
      tag: "Comércio",
      title: "Nova feira de produtores começa neste sábado",
      img: news1,
    },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Notícias do bairro" subtitle="Fique por dentro" />
      <div className="space-y-3">
        {items.map((n) => (
          <GlassCard interactive key={n.title} className="overflow-hidden">
            <div className="relative h-32 w-full">
              <img
                src={n.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-primary">
                <Newspaper className="h-3 w-3" /> {n.tag}
              </span>
              <p className="absolute inset-x-3 bottom-2 font-display text-sm font-bold text-white drop-shadow">
                {n.title}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ---------- Where to eat ---------- */

function WhereToEat() {
  const places = [
    { name: "Cantina da Esquina", tag: "Italiana", rating: 4.8, img: food2 },
    { name: "Sabor da Roça", tag: "Caseira", rating: 4.9, img: food1 },
  ];
  return (
    <section className="mb-7">
      <SectionHeader title="Onde comer" subtitle="Os favoritos da vizinhança" to="/guia" />
      <HScroll>
        {places.map((p) => (
          <GlassCard interactive key={p.name} className="w-[220px] shrink-0 overflow-hidden">
            <div className="relative h-32">
              <img
                src={p.img}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                <Star className="h-3 w-3 fill-gold text-gold" /> {p.rating}
              </span>
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-bold text-foreground">{p.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{p.tag}</p>
            </div>
          </GlassCard>
        ))}
      </HScroll>
    </section>
  );
}

/* ---------- Curiosities ---------- */

function Curiosities() {
  const facts = [
    "Comendador Soares é um dos bairros mais movimentados de Nova Iguaçu.",
    "A estação ferroviária local é um ponto histórico desde o início do século XX.",
  ];
  return (
    <section className="mb-2">
      <SectionHeader title="Curiosidades" subtitle="Você sabia?" />
      <div className="space-y-2.5">
        {facts.map((f, i) => (
          <GlassCard key={i} className="flex items-start gap-3 p-3.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-gold text-gold-foreground shadow-gold">
              <Lightbulb className="h-4 w-4" />
            </span>
            <p className="pt-1 text-sm leading-snug text-foreground">{f}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
