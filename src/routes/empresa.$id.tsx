import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import { SAMPLE_BUSINESSES } from "@/lib/businesses";
import { getBusinessProfile, formatReviewDate } from "@/lib/business-profile";

export const Route = createFileRoute("/empresa/$id")({
  loader: ({ params }) => {
    const business = SAMPLE_BUSINESSES.find((b) => b.id === params.id);
    if (!business) throw notFound();
    return { business, profile: getBusinessProfile(params.id) };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.business.name ?? "Empresa"} — Guia CS` },
      {
        name: "description",
        content: loaderData?.profile.description ?? "Perfil da empresa no Guia Comendador Soares.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="font-display text-lg font-bold text-foreground">Empresa não encontrada</p>
      <Link to="/guia" className="text-sm font-semibold text-primary-vibrant">
        Voltar ao guia
      </Link>
    </div>
  ),
  component: EmpresaPage,
});

function EmpresaPage() {
  const { business, profile } = Route.useLoaderData();
  const waUrl = `https://wa.me/${business.whatsapp}`;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      {/* Cover + back */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={profile.cover}
          alt={`Capa de ${business.name}`}
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
        />
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
        {/* Header card */}
        <GlassCard className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl font-display text-2xl font-bold text-white shadow-elegant"
              style={{
                backgroundImage: `linear-gradient(135deg, ${business.from}, ${business.to})`,
              }}
            >
              {business.initials}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display text-xl font-bold leading-tight text-foreground">
                  {business.name}
                </h1>
                {business.verified && (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary-vibrant" />
                )}
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {business.categoryLabel}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                <span className="font-semibold text-foreground">
                  {business.rating.toFixed(1)}
                </span>
                <span>({business.reviews} avaliações)</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {profile.description}
          </p>
        </GlassCard>

        {/* Contact / address / instagram */}
        <div className="mt-4 flex flex-col gap-2">
          <InfoRow icon={<MapPin className="h-4 w-4" />} label={business.address} />
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <InfoRow icon={<Instagram className="h-4 w-4" />} label={`@${profile.instagram}`} />
            </a>
          )}
        </div>

        {/* Hours */}
        <section className="mt-6">
          <SectionTitle>Horário de funcionamento</SectionTitle>
          <GlassCard className="p-4">
            <ul className="flex flex-col gap-2 text-sm">
              {profile.hours.map((h) => (
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

        {/* Gallery */}
        <section className="mt-6">
          <SectionTitle>Galeria</SectionTitle>
          <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-3 pb-1">
              {profile.gallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Foto ${i + 1} de ${business.name}`}
                  loading="lazy"
                  width={400}
                  height={400}
                  className="h-40 w-40 shrink-0 rounded-2xl object-cover shadow-card"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="mt-6">
          <SectionTitle>Avaliações & Comentários</SectionTitle>
          <div className="flex flex-col gap-3">
            {profile.reviews.map((r) => (
              <GlassCard key={r.id} className="p-4">
                <div className="mb-2 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full gradient-brand text-sm font-bold text-primary-foreground">
                    {r.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{r.author}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatReviewDate(r.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-muted"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{r.comment}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      {/* Sticky WhatsApp CTA */}
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
