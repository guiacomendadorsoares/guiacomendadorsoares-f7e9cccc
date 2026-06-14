import { Link } from "@tanstack/react-router";
import { Crown, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentPlan } from "@/lib/plans";

const BUSINESS_LABELS: Record<string, string> = {
  logo: "Logo", banner: "Banner", gallery: "Galeria de fotos", videos: "Vídeos",
  social: "Redes sociais", whatsapp: "Botão WhatsApp", promotions: "Promoções",
  verified_badge: "Selo verificado", featured_home: "Destaque na Home",
  featured_category: "Destaque na categoria", rotating_banner: "Banner rotativo",
  priority_search: "Prioridade nas buscas", sponsored_posts: "Postagens patrocinadas",
};

export function MyPlanCard({ kind = "business", usage }: { kind?: "business" | "properties"; usage?: { used: number } }) {
  const { plan, loading } = useCurrentPlan();
  if (loading || !plan) return null;
  const features = (plan.features as any)?.[kind] ?? {};

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-brand text-primary-foreground">
            <Crown className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Meu plano</p>
            <p className="font-display text-lg font-bold">{plan.name}</p>
          </div>
        </div>
        <Button asChild size="sm" variant={plan.slug === "ouro" ? "outline" : "default"}>
          <Link to="/planos">{plan.slug === "ouro" ? "Gerenciar" : "Fazer upgrade"}</Link>
        </Button>
      </div>

      {kind === "properties" && usage && (
        <div className="mt-4 rounded-lg bg-secondary/50 p-3 text-sm">
          <p className="font-medium">Imóveis usados: <span className="text-primary">{usage.used}</span> / {features.max_listings === -1 ? "∞" : features.max_listings}</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Object.entries(BUSINESS_LABELS).filter(([k]) => k in (kind === "business" ? features : {})).map(([k, label]) => {
          const enabled = !!features[k];
          return (
            <div key={k} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${enabled ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30 text-muted-foreground"}`}>
              {enabled ? <Check className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4" />}
              <span>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
