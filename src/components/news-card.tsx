import { Calendar } from "lucide-react";
import { GlassCard } from "@/components/cards";
import { formatNewsDate, getCategoryColor, type NewsItem } from "@/lib/news";

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <GlassCard interactive className="group overflow-hidden">
      <div className={`relative w-full overflow-hidden ${featured ? "h-56" : "h-40"}`}>
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-lg ${getCategoryColor(item.category)}`}
        >
          {item.categoryLabel}
        </span>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-4">
        <h3
          className={`mb-1.5 font-display font-bold leading-snug text-foreground ${featured ? "text-lg" : "text-base"}`}
        >
          {item.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary-vibrant" />
          {formatNewsDate(item.publishedAt)}
        </p>
      </div>
    </GlassCard>
  );
}
