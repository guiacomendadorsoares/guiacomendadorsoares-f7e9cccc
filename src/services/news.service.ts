import { supabase } from "@/integrations/supabase/client";
import type { NewsItem } from "@/lib/news";

export async function fetchNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .eq("status", "approved")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[news.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as NewsItem[];
}
