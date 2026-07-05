import { Link } from "@tanstack/react-router";
import type { Category } from "@/lib/guia-taxonomy";

const IMAGE_QUERY: Record<string, string> = {
  "alimentacao": "restaurant,food",
  "saude": "hospital,healthcare",
  "beleza-estetica": "salon,beauty",
  "esportes-bem-estar": "gym,fitness",
  "servicos": "workshop,tools",
  "educacao": "school,classroom",
  "moda-vestuario": "clothing,fashion,store",
  "casa-construcao": "hardware,construction",
  "automotivo": "auto,car,workshop",
  "pet-shop": "petshop,dog",
  "advogados": "lawyer,office",
  "imobiliarias": "real-estate,house",
  "utilidade-publica": "city,public",
  "religiao": "church,cross",
  "eventos-festas": "party,event",
  "transportes": "delivery,truck",
  "midia-marketing": "marketing,studio",
};

function imgFor(c: Category) {
  const q = IMAGE_QUERY[c.slug] ?? c.label.toLowerCase().replace(/\s+/g, ",");
  return `https://source.unsplash.com/600x400/?${encodeURIComponent(q)}`;
}

export function CategoryImageCard({ c, count }: { c: Category; count?: number }) {
  return (
    <Link
      to="/guia/$categoria"
      params={{ categoria: c.slug }}
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl shadow-card ring-1 ring-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant"
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
      />
      <img
        src={imgFor(c)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

      {typeof count === "number" && count > 0 && (
        <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-foreground shadow">
          {count}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-3">
        <span className="text-2xl leading-none drop-shadow-lg">{c.emoji}</span>
        <span className="font-display text-sm font-bold leading-tight text-white drop-shadow-md sm:text-base">
          {c.label}
        </span>
      </div>
    </Link>
  );
}
