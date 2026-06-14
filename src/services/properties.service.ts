import { supabase } from "@/integrations/supabase/client";
import type { Property } from "@/lib/properties";

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[properties.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Property[];
}
