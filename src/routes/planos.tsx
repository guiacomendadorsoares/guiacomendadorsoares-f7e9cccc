import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans, useCurrentPlan, type PlanSlug } from "@/lib/plans";
import { useCurrentUser } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Guia Comendador Soares" },
      { name: "description", content: "Escolha o plano ideal para destacar seu negócio no Guia Comendador Soares." },
      { property: "og:title", content: "Planos — Guia Comendador Soares" },
      { property: "og:description", content: "Free, Destaque e Ouro: encontre o plano certo para sua empresa." },
    ],
  }),
  component: PlanosPage,
});

const ICONS: Record<PlanSlug, typeof Crown> = { free: Sparkles, destaque: Star, ouro: Crown };

function PlanosPage() {
  const { data: plans = [], isLoading } = usePlans();
  const { slug: currentSlug } = useCurrentPlan();
  const { user } = useCurrentUser();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center md:py-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Planos</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Escolha o plano ideal para seu negócio</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Aumente sua visibilidade no Guia Comendador Soares com recursos premium.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Carregando planos…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => {
              const Icon = ICONS[p.slug] ?? Crown;
              const isCurrent = currentSlug === p.slug;
              const isGold = p.slug === "ouro";
              const businessFeatures = (p.features as any)?.business ?? {};
              const propsFeatures = (p.features as any)?.properties ?? {};
              const bullets = buildBullets(p.slug, businessFeatures, propsFeatures);
              return (
                <div
                  key={p.id}
                  className={`relative flex flex-col rounded-2xl border-2 p-6 shadow-card transition ${
                    isGold ? "border-primary bg-gradient-to-b from-primary/5 to-card shadow-elegant" : "border-border bg-card"
                  }`}
                >
                  {isGold && (
                    <span className="absolute -top-3 right-6 rounded-full gradient-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-elegant">
                      Mais popular
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className={`grid h-12 w-12 place-items-center rounded-xl ${isGold ? "gradient-brand text-primary-foreground" : "bg-secondary text-primary"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-xl font-bold">{p.name}</h2>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="font-display text-4xl font-bold">
                      {p.price === 0 ? "Grátis" : `R$ ${p.price.toFixed(2).replace(".", ",")}`}
                    </span>
                    {p.price > 0 && <span className="text-sm text-muted-foreground"> /mês</span>}
                  </div>

                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-6 w-full"
                    variant={isCurrent ? "outline" : isGold ? "default" : "secondary"}
                    disabled={isCurrent}
                    onClick={() => {
                      if (!user) { window.location.href = "/auth"; return; }
                      toast.info("Pagamentos estarão disponíveis em breve.");
                    }}
                  >
                    {isCurrent ? "Plano atual" : "Selecionar plano"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          <Link to="/" className="underline underline-offset-2">Voltar ao Guia</Link>
        </p>
      </main>
    </div>
  );
}

function buildBullets(slug: PlanSlug, b: any, p: any): string[] {
  const out: string[] = [];
  if (slug === "free") {
    out.push("Nome, categoria, endereço e telefone", "Logo da empresa", "Horário de funcionamento", `Até ${p.max_listings} imóveis · ${p.max_photos} fotos cada`);
  }
  if (slug === "destaque") {
    out.push("Tudo do Free", "Banner e galeria de fotos", "Redes sociais + WhatsApp", "Promoções e estatísticas básicas", "Selo Empresa Verificada", `Até ${p.max_listings} imóveis · ${p.max_photos} fotos`);
  }
  if (slug === "ouro") {
    out.push("Tudo do Destaque", "Destaque na Home e na categoria", "Banner rotativo + prioridade nas buscas", "Estatísticas avançadas", "Postagens patrocinadas", "Imóveis ilimitados + vídeos");
  }
  return out;
}
