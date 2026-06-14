import { Star, MapPin } from "lucide-react";
import { GlassCard } from "@/components/cards";
import { formatPriceRange, type Restaurant } from "@/lib/restaurants";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const waUrl = `https://wa.me/${restaurant.whatsapp}`;

  return (
    <GlassCard className="group overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {restaurant.categoryLabel}
        </span>
        {restaurant.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-foreground shadow-gold">
            Top
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-bold leading-snug text-foreground">
            {restaurant.name}
          </h3>
          <span className="shrink-0 text-xs font-semibold text-primary-vibrant">
            {formatPriceRange(restaurant.priceRange)}
          </span>
        </div>

        <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="font-semibold text-foreground">{restaurant.rating.toFixed(1)}</span>
            <span>({restaurant.reviews})</span>
          </span>
          {typeof restaurant.distanceKm === "number" && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary-vibrant" />
              {restaurant.distanceKm.toFixed(1)} km
            </span>
          )}
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-elegant transition-all active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </GlassCard>
  );
}
