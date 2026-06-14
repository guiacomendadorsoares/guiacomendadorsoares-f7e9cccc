import { supabase } from "@/integrations/supabase/client";
import type { Restaurant } from "@/lib/restaurants";

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("[restaurants.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Restaurant[];
}
