import { supabase } from "@/integrations/supabase/client";

export interface EventItem {
  id: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  is_free: boolean;
  price: number | null;
}

export async function fetchUpcomingEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id,title,summary,cover_url,location,starts_at,ends_at,is_free,price")
    .eq("active", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("[events.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as EventItem[];
}
