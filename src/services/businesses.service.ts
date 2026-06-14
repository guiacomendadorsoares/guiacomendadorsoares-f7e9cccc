// Service layer for businesses. Reads exclusively from Supabase — no sample fallback.
import { supabase } from "@/integrations/supabase/client";
import type { Business } from "@/lib/businesses";

export async function fetchBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.error("[businesses.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Business[];
}

export async function fetchBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[businesses.service] fetch by id error:", error.message);
    return null;
  }
  return (data as unknown as Business) ?? null;
}
