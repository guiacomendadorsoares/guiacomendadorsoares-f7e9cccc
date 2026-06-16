import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X, Crown, Sparkles, Star, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans, useCurrentPlan, type PlanSlug, type Plan } from "@/lib/plans";
import { useCurrentUser } from "@/hooks/use-auth";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import logoUrl from "@/assets/logo.png";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createPlanCheckout } from "@/lib/asaas.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/planos")({
  head: () => ({
    meta: [
      { title: "Planos — Guia Comendador Soares" },
      { name: "description", content: "Escolha o plano ideal para destacar seu negócio no Guia Comendador Soares. Free, Destaque e Ouro." },
      { property: "og:title", content: "Planos — Guia Comendador Soares" },
      { property: "og:description", content: "Free, Destaque e Ouro: encontre o plano certo para sua empresa, imóveis e vagas." },
    ],
  }),
  component: PlanosPage,
});

const ICONS: Record<PlanSlug, typeof Crown> = { free: Sparkles, destaque: Star, ouro: Crown };

function PlanosPage() {
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <Hero />
      <PlansGrid />
      <Compare />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="" className="h-9 w-9 object-contain" />
          <span className="font-display text-sm font-bold leading-tight">
            Guia<br />Comendador Soares
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/anuncie" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block">
            Anuncie
          </Link>
          <Button asChild size="sm" variant="premium">
            <Link to="/auth">Começar agora</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-card to-background">
      <div className="absolute inset-0 -z-10 opacity-30" style={{
        backgroundImage: "radial-gradient(circle at 20% 10%, var(--primary-vibrant) 0%, transparent 40%), radial-gradient(circle at 80% 60%, var(--gold) 0%, transparent 35%)",
      }} />
      <div className="mx-auto max-w-4xl px-4 py-14 text-center md:py-20">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> Planos
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Escolha o plano ideal para{" "}
          <span className="bg-gradient-to-r from-primary to-primary-vibrant bg-clip-text text-transparent">
            seu negócio
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Comece grátis. Suba de plano quando precisar de mais alcance, fotos e prioridade nas buscas.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">Sem cartão de crédito • Cancele quando quiser</p>
      </div>
    </section>
  );
}

function PlansGrid() {
  const { data: plans = [], isLoading } = usePlans();
  const { slug: currentSlug } = useCurrentPlan();
  const { user } = useCurrentUser();
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <section className="border-b border-border bg-card/50 py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
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
                  className={`relative flex flex-col rounded-2xl border-2 p-6 shadow-card transition-all duration-200 hover:-translate-y-1 ${
                    isGold ? "border-primary bg-gradient-to-b from-primary/5 to-card shadow-elegant" : "border-border bg-card hover:shadow-elegant"
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
                      if (p.slug === "free") { toast.info("Você já pode usar o plano Free."); return; }
                      setSelected(p);
                    }}
                  >
                    {isCurrent ? "Plano atual" : `Selecionar ${p.name}`}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CheckoutDialog plan={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function CheckoutDialog({ plan, onClose }: { plan: Plan | null; onClose: () => void }) {
  const { user } = useCurrentUser();
  const checkout = useServerFn(createPlanCheckout);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? "");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [billingType, setBillingType] = useState<"PIX" | "CREDIT_CARD">("PIX");
  const monthly = Number(plan?.price ?? 0);
  const annual = monthly * 12;

  async function submit() {
    if (!plan) return;
    if (cpfCnpj.replace(/\D/g, "").length < 11) { toast.error("Informe um CPF/CNPJ válido"); return; }
    if (fullName.trim().length < 2) { toast.error("Informe o nome completo"); return; }
    setLoading(true);
    try {
      const r = await checkout({ data: { planSlug: plan.slug as "destaque" | "ouro", cpfCnpj, fullName, billingType } });
      toast.success("Assinatura criada! Abrindo fatura…");
      onClose();
      if (r.invoiceUrl) window.open(r.invoiceUrl, "_blank");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!plan} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assinar plano {plan?.name}</DialogTitle>
          <DialogDescription>
            R$ {Number(plan?.price ?? 0).toFixed(2).replace(".", ",")} / mês — cobrança mensal via Asaas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fn">Nome completo</Label>
            <Input id="fn" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF ou CNPJ</Label>
            <Input id="cpf" value={cpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} placeholder="000.000.000-00" />
          </div>
          <div className="space-y-1.5">
            <Label>Forma de pagamento</Label>
            <RadioGroup value={billingType} onValueChange={(v) => setBillingType(v as any)} className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"><RadioGroupItem value="UNDEFINED" /> Escolher na fatura</label>
              <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"><RadioGroupItem value="PIX" /> Pix</label>
              <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"><RadioGroupItem value="BOLETO" /> Boleto</label>
              <label className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"><RadioGroupItem value="CREDIT_CARD" /> Cartão</label>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />} Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const FEATURES: { label: string; free: boolean; destaque: boolean; ouro: boolean }[] = [
  { label: "Perfil da empresa", free: true, destaque: true, ouro: true },
  { label: "Logo + horário de funcionamento", free: true, destaque: true, ouro: true },
  { label: "WhatsApp + redes sociais", free: false, destaque: true, ouro: true },
  { label: "Banner + galeria de fotos", free: false, destaque: true, ouro: true },
  { label: "Selo Empresa Verificada", free: false, destaque: true, ouro: true },
  { label: "Promoções e cupons", free: false, destaque: true, ouro: true },
  { label: "Destaque na Home", free: false, destaque: false, ouro: true },
  { label: "Prioridade nas buscas", free: false, destaque: false, ouro: true },
  { label: "Estatísticas avançadas", free: false, destaque: false, ouro: true },
  { label: "Vídeos e imóveis ilimitados", free: false, destaque: false, ouro: true },
];

function Compare() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Comparativo</p>
        <h2 className="font-display text-3xl font-bold md:text-4xl">Tudo o que você ganha</h2>
      </div>
      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-semibold">Recurso</th>
              <th className="px-4 py-3 text-center font-semibold">Free</th>
              <th className="px-4 py-3 text-center font-semibold">Destaque</th>
              <th className="px-4 py-3 text-center font-semibold text-primary">Ouro</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f, i) => (
              <tr key={f.label} className={i % 2 ? "bg-secondary/20" : ""}>
                <td className="px-4 py-3 font-medium">{f.label}</td>
                <td className="px-4 py-3 text-center"><Cell on={f.free} /></td>
                <td className="px-4 py-3 text-center"><Cell on={f.destaque} /></td>
                <td className="px-4 py-3 text-center"><Cell on={f.ouro} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({ on }: { on: boolean }) {
  return on ? (
    <Check className="mx-auto h-4 w-4 text-primary" />
  ) : (
    <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-vibrant p-10 text-center text-primary-foreground shadow-elegant md:p-16">
        <h2 className="font-display text-3xl font-bold md:text-5xl">Pronto para anunciar?</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Cadastre-se grátis em poucos minutos e apareça para o bairro inteiro.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="gold">
            <Link to="/auth">Criar conta grátis <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="premium">
            <Link to="/anuncie">Saber mais</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


function buildBullets(slug: PlanSlug, b: any, p: any): string[] {
  const out: string[] = [];
  if (slug === "free") {
    out.push(
      "Nome, categoria, endereço e telefone",
      "Logo da empresa",
      "Horário de funcionamento",
      `Até ${p.max_listings ?? 3} imóveis · ${p.max_photos ?? 5} fotos cada`,
    );
  }
  if (slug === "destaque") {
    out.push(
      "Tudo do Free",
      "Banner e galeria de fotos",
      "Redes sociais + WhatsApp",
      "Promoções e estatísticas básicas",
      "Selo Empresa Verificada",
      `Até ${p.max_listings ?? 10} imóveis · ${p.max_photos ?? 15} fotos`,
    );
  }
  if (slug === "ouro") {
    out.push(
      "Tudo do Destaque",
      "Destaque na Home e na categoria",
      "Banner rotativo + prioridade nas buscas",
      "Estatísticas avançadas",
      "Postagens patrocinadas",
      "Imóveis ilimitados + vídeos",
    );
  }
  return out;
}
