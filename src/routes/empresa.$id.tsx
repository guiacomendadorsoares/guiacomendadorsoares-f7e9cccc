import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Instagram,
  Star,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { GlassCard } from "@/components/cards";
import { fetchBusinessById } from "@/services/businesses.service";
import { useOwnerPlan, can } from "@/lib/plan-limits";



export const Route = createFileRoute("/empresa/$id")({
  head: () => ({
    meta: [{ title: "Empresa — Guia CS" }],
  }),
  component: EmpresaPage,
});

function EmpresaPage() {
  const { id } = Route.useParams();
  const { data: business, isLoading } = useQuery({
    queryKey: ["business", id],
    queryFn: () => fetchBusinessById(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center p-6 text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-display text-lg font-bold text-foreground">Empresa não encontrada</p>
        <Link to="/guia" className="text-sm font-semibold text-primary-vibrant">
          Voltar ao guia
        </Link>
      </div>
    );
  }

  const b: any = business;
  const { plan: ownerPlan } = useOwnerPlan(b.submitted_by);
  const showWhatsapp = can(ownerPlan, "business", "whatsapp");
  const showSocial = can(ownerPlan, "business", "social");
  const showGallery = can(ownerPlan, "business", "gallery");
  const showBanner = can(ownerPlan, "business", "banner");
  const showVerified = can(ownerPlan, "business", "verified_badge");
  const cover = showBanner ? (b.cover_url || b.banner_url || b.logo_url || null) : (b.logo_url || null);
  const description = (b.description || "").slice(0, ownerPlan?.slug === "free" ? 500 : 4000);
  const instagram = showSocial ? (b.instagram || "") : "";
  const whatsapp = showWhatsapp ? (b.whatsapp || "") : "";
  const waUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "#";
  const initials = b.name.split(/\s+/).filter(Boolean).slice(0, 2).map((s: string) => s[0]).join("").toUpperCase();
  const from = b.from || "#1f3a2e";
  const to = b.to || "#4a8a6b";
  const hours: Array<{ day: string; hours: string }> = Array.isArray(b.hours) ? b.hours : [];
  const rawGallery: string[] = Array.isArray(b.gallery_urls) && b.gallery_urls.length
    ? b.gallery_urls
    : Array.isArray(b.gallery) ? (b.gallery as string[]) : [];
  const gallery = showGallery ? rawGallery : [];



  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <div className="relative h-56 w-full overflow-hidden">
        {cover ? (
          <img src={cover} alt={`Capa de ${b.name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />

        <Link
          to="/guia"
          aria-label="Voltar"
          className="absolute left-4 top-[max(env(safe-area-inset-top),1rem)] grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <main className="-mt-14 flex-1 px-5 pb-32">
        <GlassCard className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl font-display text-2xl font-bold text-white shadow-elegant"
              style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
            >
              {b.logo_url ? (
                <img src={b.logo_url} alt={b.name} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-xl font-bold leading-tight text-foreground">
                  {b.name}
                </h1>
                {b.verified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary-vibrant" />
                )}
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {b.categoryLabel || b.category_label || b.subcategory || b.main_category}
              </p>


            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </GlassCard>

        <div className="mt-4 flex flex-col gap-2">
          {b.address && <InfoRow icon={<MapPin className="h-4 w-4" />} label={b.address} />}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <InfoRow icon={<Instagram className="h-4 w-4" />} label={`@${instagram}`} />
            </a>
          )}
        </div>

        {hours.length > 0 && (
          <section className="mt-6">
            <SectionTitle>Horário de funcionamento</SectionTitle>
            <GlassCard className="p-4">
              <ul className="flex flex-col gap-2 text-sm">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary-vibrant" />
                      {h.day}
                    </span>
                    <span className="font-semibold text-foreground">{h.hours}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>
        )}

        {gallery.length > 0 && (
          <section className="mt-6">
            <SectionTitle>Galeria</SectionTitle>
            <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-3 pb-1">
                {gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Foto ${i + 1} de ${b.name}`}
                    loading="lazy"
                    className="h-40 w-40 shrink-0 rounded-2xl object-cover shadow-card"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {whatsapp && (
        <div className="fixed inset-x-0 bottom-[68px] z-40 mx-auto max-w-md px-5 pb-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-elegant transition-all active:scale-95"
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </a>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <GlassCard className="flex items-center gap-3 p-3 text-sm text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary-vibrant">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </GlassCard>
  );
}
