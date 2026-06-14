import { supabase } from "@/integrations/supabase/client";
import { sampleNews, type NewsItem } from "@/lib/news";

export async function fetchNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[news.service] fetch error:", error.message);
    return sampleNews;
  }
  if (!data || data.length === 0) return sampleNews;
  return data as unknown as NewsItem[];
}
