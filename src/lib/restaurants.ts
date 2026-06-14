// Restaurant types and sample data.
// Ready to be swapped by Supabase: `supabase.from('restaurants').select('*')`.

import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";
import food4 from "@/assets/food-4.jpg";
import food5 from "@/assets/food-5.jpg";
import food6 from "@/assets/food-6.jpg";

export type RestaurantCategory =
  | "restaurante"
  | "hamburgueria"
  | "pizzaria"
  | "padaria"
  | "japones"
  | "acai";

export interface Restaurant {
  id: string;
  name: string;
  category: RestaurantCategory;
  categoryLabel: string;
  image: string;
  rating: number;
  reviews: number;
  priceRange: 1 | 2 | 3 | 4; // $ to $$$$
  whatsapp: string; // digits only, e.g. "5521999999999"
  distanceKm?: number;
  featured?: boolean;
}

export const RESTAURANT_FILTERS: { value: RestaurantCategory | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "restaurante", label: "Restaurante" },
  { value: "hamburgueria", label: "Hamburgueria" },
  { value: "pizzaria", label: "Pizzaria" },
  { value: "padaria", label: "Padaria" },
  { value: "japones", label: "Japonês" },
  { value: "acai", label: "Açaí" },
];

export const sampleRestaurants: Restaurant[] = [];

export function formatPriceRange(range: 1 | 2 | 3 | 4): string {
  return "$".repeat(range);
}
