// Service layer for businesses. Reads from Supabase when tables are populated.
// Returns sample data as a fallback so the UI continues to render in dev.
import { supabase } from "@/integrations/supabase/client";
import { SAMPLE_BUSINESSES, type Business } from "@/lib/businesses";

export async function fetchBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("[businesses.service] fetch error:", error.message);
    return SAMPLE_BUSINESSES;
  }
  if (!data || data.length === 0) return SAMPLE_BUSINESSES;
  return data as unknown as Business[];
}

export async function fetchBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[businesses.service] fetch by id error:", error.message);
    return SAMPLE_BUSINESSES.find((b) => b.id === id) ?? null;
  }
  return (data as unknown as Business) ?? null;
}
