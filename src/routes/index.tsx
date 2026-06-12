import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SectionTitle } from "@/components/ui-bits";
import { InstallPrompt } from "@/components/install-prompt";
import { Search, Store, Briefcase, Building2, Sparkles, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guia Comendador Soares — O guia do bairro" },
      { name: "description", content: "Descubra o comércio, vagas de emprego e imóveis no bairro Comendador Soares." },
      { property: "og:title", content: "Guia Comendador Soares" },
      { property: "og:description", content: "O guia oficial do bairro: comércio, vagas, imóveis e comunidade." },
    ],
  }),
  component: HomePage,
});

const shortcuts = [
  { to: "/guia", label: "Guia comercial", icon: Store, tint: "gradient-brand text-primary-foreground" },
  { to: "/vagas", label: "Vagas", icon: Briefcase, tint: "bg-secondary text-primary" },
  { to: "/imoveis", label: "Imóveis", icon: Building2, tint: "bg-secondary text-primary" },
  { to: "/perfil", label: "Anunciar", icon: Sparkles, tint: "gradient-gold text-gold-foreground" },
] as const;

function HomePage() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative -mx-5 -mt-4 mb-5 overflow-hidden rounded-b-[2rem] px-5 pb-7 pt-[max(env(safe-area-inset-top),1.25rem)] text-primary-foreground gradient-brand shadow-elegant">
        <div className="flex items-center gap-2 text-xs font-medium opacity-90">
          <MapPin className="h-3.5 w-3.5" />
          <span>Comendador Soares · Nova Iguaçu</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold leading-tight">
          Tudo do seu bairro,<br />
          <span className="text-gold">na palma da mão.</span>
        </h1>
        <p className="mt-1.5 max-w-[18rem] text-sm opacity-85">
          Comércio local, vagas e imóveis, em um só lugar.
        </p>

        <Link
          to="/guia"
          className="mt-5 flex items-center gap-2 rounded-full bg-background/95 px-4 py-3 text-sm text-muted-foreground shadow-card"
        >
          <Search className="h-4 w-4 text-primary" />
          <span>O que você procura hoje?</span>
        </Link>
      </section>

      <InstallPrompt />

      <SectionTitle>Atalhos</SectionTitle>
      <div className="mb-6 grid grid-cols-4 gap-3">
        {shortcuts.map(({ to, label, icon: Icon, tint }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-3 text-center shadow-card transition-transform active:scale-95"
          >
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] font-medium leading-tight text-foreground">{label}</span>
          </Link>
        ))}
      </div>

      <SectionTitle action={<Link to="/guia" className="text-xs font-semibold text-primary-vibrant">Ver tudo</Link>}>
        Destaques do bairro
      </SectionTitle>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full gradient-gold text-gold-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-display font-semibold text-foreground">Comércios em breve</p>
            <p className="text-xs text-muted-foreground">
              Estamos reunindo os melhores do bairro. Volte logo!
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
