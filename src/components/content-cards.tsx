import type { ReactNode } from "react";
import { Calendar, MapPin, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { GlassCard } from "@/components/cards";
import { cn } from "@/lib/utils";

/** Event card — used in /eventos and admin lists. */
export function CardEvento({
  title,
  date,
  location,
  image,
  badge,
  onClick,
}: {
  title: string;
  date: string;
  location?: string;
  image?: string;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <GlassCard interactive className="group overflow-hidden" >
      <div onClick={onClick} className="cursor-pointer">
        {image && (
          <div className="relative h-40 w-full overflow-hidden">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {badge && (
              <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground shadow-gold">
                {badge}
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        <div className="p-4">
          <h3 className="mb-2 font-display text-base font-bold leading-snug">{title}</h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary-vibrant" />
            {date}
          </p>
          {location && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary-vibrant" />
              <span className="truncate">{location}</span>
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

/** Dashboard metric tile. */
export function CardDashboard({
  label,
  value,
  icon,
  delta,
  hint,
  accent = "primary",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  delta?: number;
  hint?: string;
  accent?: "primary" | "gold" | "premium";
}) {
  const accents = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/20 text-gold-foreground",
    premium: "bg-foreground/10 text-foreground",
  };
  const trendUp = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        {icon && (
          <span className={cn("grid h-9 w-9 place-items-center rounded-xl", accents[accent])}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">{value}</p>
      {(typeof delta === "number" || hint) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {typeof delta === "number" && (
            <span className={cn("inline-flex items-center gap-1 font-semibold", trendUp ? "text-primary" : "text-destructive")}>
              {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      )}
    </div>
  );
}

/** Reusable skeleton matching the content card surface. */
export function CardSkeleton({ height = "h-56" }: { height?: string }) {
  return (
    <div className={cn("animate-pulse rounded-2xl border border-border bg-card shadow-card", height)} />
  );
}

/** Standard CTA used in card footers. */
export function CardCta({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "gold" | "premium";
}) {
  const styles = {
    primary: "gradient-brand text-primary-foreground shadow-elegant",
    gold: "bg-gold text-gold-foreground shadow-gold",
    premium: "bg-foreground text-background shadow-elegant",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all active:scale-95",
        styles[variant],
      )}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </button>
  );
}
