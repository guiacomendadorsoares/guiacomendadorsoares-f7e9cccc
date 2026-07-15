import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Loader2, MapPin, Ticket } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { getDisplayImageUrl } from "@/lib/storage";
import fallback from "@/assets/placeholders/evento.jpg.asset.json";

export const Route = createFileRoute("/eventos/$id")({
  component: EventoDetalhe,
  errorComponent: ({ error }) => (
    <AppShell title="Evento">
      <p className="text-sm text-destructive">{error.message}</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Evento">
      <p className="text-sm text-muted-foreground">Evento não encontrado.</p>
    </AppShell>
  ),
});

function formatDateRange(start?: string | null, end?: string | null) {
  if (!start) return "";
  const s = new Date(start);
  const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" });
  if (!end) return fmt.format(s);
  const e = new Date(end);
  return `${fmt.format(s)} — ${fmt.format(e)}`;
}

function EventoDetalhe() {
  const { id } = Route.useParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events", "detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,summary,description,cover_url,location,starts_at,ends_at,price,is_free,url")
        .eq("id", id)
        .eq("status", "approved")
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return {
        ...data,
        image: (await getDisplayImageUrl(data.cover_url)) || fallback.url,
      };
    },
  });

  return (
    <AppShell title="Evento">
      <button
        onClick={() => router.history.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      {isLoading ? (
        <div className="grid place-items-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Erro ao carregar evento.</p>
      ) : !data ? (
        <p className="text-sm text-muted-foreground">
          Evento não encontrado. <Link to="/" className="text-primary underline">Voltar</Link>
        </p>
      ) : (
        <article className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          <div className="relative w-full overflow-hidden rounded-2xl">
            <img src={data.image} alt={data.title} className="h-64 w-full object-cover" />
          </div>
          <h1 className="font-display text-2xl font-bold leading-tight">{data.title}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {data.starts_at && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary-vibrant" />
                {formatDateRange(data.starts_at, data.ends_at)}
              </span>
            )}
            {data.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary-vibrant" />
                {data.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Ticket className="h-3.5 w-3.5 text-primary-vibrant" />
              {data.is_free ? "Gratuito" : data.price ? `R$ ${Number(data.price).toFixed(2)}` : "Consultar"}
            </span>
          </div>
          {data.summary && <p className="text-base text-muted-foreground">{data.summary}</p>}
          {data.description && (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {data.description}
            </div>
          )}
          {data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card"
            >
              Saiba mais →
            </a>
          )}
        </article>
      )}
    </AppShell>
  );
}
