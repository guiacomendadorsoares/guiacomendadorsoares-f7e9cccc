import { supabase } from "@/integrations/supabase/client";
import { sampleProperties, type Property } from "@/lib/properties";

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[properties.service] fetch error:", error.message);
    return sampleProperties;
  }
  if (!data || data.length === 0) return sampleProperties;
  return data as unknown as Property[];
}
