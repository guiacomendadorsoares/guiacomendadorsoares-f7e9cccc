import { supabase } from "@/integrations/supabase/client";

export interface RatingItem {
  id: string;
  business_id: string;
  author_id: string | null;
  author_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export async function fetchRatings(businessId: string): Promise<RatingItem[]> {
  const { data, error } = await supabase
    .from("ratings")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[ratings.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as RatingItem[];
}

export async function fetchRatingSummary(businessId: string): Promise<RatingSummary> {
  const { data, error } = await supabase
    .from("ratings")
    .select("rating")
    .eq("business_id", businessId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = data.reduce((acc, r) => acc + (r.rating ?? 0), 0);
  return { average: sum / data.length, count: data.length };
}
