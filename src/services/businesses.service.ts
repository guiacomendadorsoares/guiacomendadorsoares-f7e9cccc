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

export async function fetchBusinessesByCategory(mainCategory: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .eq("main_category", mainCategory)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });
  if (error) {
    console.error("[businesses.service] by category error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Business[];
}

export async function fetchBusinessesBySubcategory(
  mainCategory: string,
  subcategory: string,
): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("status", "approved")
    .eq("main_category", mainCategory)
    .eq("subcategory", subcategory)
    .order("featured", { ascending: false })
    .order("name", { ascending: true });
  if (error) {
    console.error("[businesses.service] by subcategory error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Business[];
}

export async function fetchCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("businesses")
    .select("main_category")
    .eq("status", "approved");
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as any[]) {
    const k = row.main_category;
    if (!k) continue;
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}
