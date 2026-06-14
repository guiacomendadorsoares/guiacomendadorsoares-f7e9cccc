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

export const sampleRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Cantina do Comendador",
    category: "restaurante",
    categoryLabel: "Restaurante",
    image: food1,
    rating: 4.8,
    reviews: 312,
    priceRange: 3,
    whatsapp: "5521999990001",
    distanceKm: 0.4,
    featured: true,
  },
  {
    id: "2",
    name: "Padaria Pão Dourado",
    category: "padaria",
    categoryLabel: "Padaria",
    image: food2,
    rating: 4.7,
    reviews: 580,
    priceRange: 1,
    whatsapp: "5521999990002",
    distanceKm: 0.2,
  },
  {
    id: "3",
    name: "Burger House CS",
    category: "hamburgueria",
    categoryLabel: "Hamburgueria",
    image: food3,
    rating: 4.6,
    reviews: 245,
    priceRange: 2,
    whatsapp: "5521999990003",
    distanceKm: 0.9,
    featured: true,
  },
  {
    id: "4",
    name: "Pizzaria Bella Forno",
    category: "pizzaria",
    categoryLabel: "Pizzaria",
    image: food4,
    rating: 4.9,
    reviews: 410,
    priceRange: 2,
    whatsapp: "5521999990004",
    distanceKm: 1.2,
  },
  {
    id: "5",
    name: "Sakura Sushi",
    category: "japones",
    categoryLabel: "Japonês",
    image: food5,
    rating: 4.8,
    reviews: 198,
    priceRange: 4,
    whatsapp: "5521999990005",
    distanceKm: 1.5,
  },
  {
    id: "6",
    name: "Açaí do Bairro",
    category: "acai",
    categoryLabel: "Açaí",
    image: food6,
    rating: 4.7,
    reviews: 320,
    priceRange: 1,
    whatsapp: "5521999990006",
    distanceKm: 0.6,
  },
];

export function formatPriceRange(range: 1 | 2 | 3 | 4): string {
  return "$".repeat(range);
}
