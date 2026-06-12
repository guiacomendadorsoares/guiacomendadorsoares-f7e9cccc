import { MapPin, Star, BadgeCheck, MessageCircle, ArrowUpRight } from "lucide-react";
import type { Business } from "@/lib/businesses";
import { GlassCard } from "@/components/cards";

export function BusinessCard({ b }: { b: Business }) {
  const waLink = `https://wa.me/${b.whatsapp}?text=${encodeURIComponent(
    `Olá! Encontrei vocês no Guia Comendador Soares.`,
  )}`;

  return (
    <GlassCard className="p-3.5">
      <div className="flex gap-3">
        {/* 3D logo */}
        <div
          className="relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white"
          style={{
            background: `linear-gradient(135deg, ${b.from} 0%, ${b.to} 100%)`,
            boxShadow: `0 10px 22px -10px ${b.from}cc, inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.2)`,
          }}
        >
          <span className="pointer-events-none absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/35 blur-[2px]" />
          <span className="relative font-display text-lg font-extrabold tracking-tight drop-shadow">
            {b.initials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="flex items-center gap-1 truncate font-display text-[15px] font-bold text-foreground">
                {b.name}
                {b.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary-vibrant" />
                )}
              </h3>
              <p className="truncate text-[11px] font-medium text-primary-vibrant">
                {b.categoryLabel}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-foreground">
              <Star className="h-3 w-3 fill-gold text-gold" />
              {b.rating.toFixed(1)}
            </div>
          </div>

          <div className="mt-1.5 flex items-start gap-1 text-[11.5px] text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{b.address}</span>
            {typeof b.distanceKm === "number" && (
              <span className="ml-auto shrink-0 font-semibold text-foreground/70">
                {b.distanceKm.toFixed(1)} km
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground transition-colors active:bg-secondary"
        >
          <MessageCircle className="h-3.5 w-3.5 text-primary-vibrant" />
          WhatsApp
        </a>
        <button
          type="button"
          className="flex h-9 flex-[1.3] items-center justify-center gap-1.5 rounded-xl gradient-brand text-xs font-semibold text-primary-foreground shadow-elegant transition-transform active:scale-[0.98]"
        >
          Ver perfil
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </GlassCard>
  );
}
