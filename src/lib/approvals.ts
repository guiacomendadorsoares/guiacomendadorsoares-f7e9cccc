import { supabase } from "@/integrations/supabase/client";

export type ContentTable = "businesses" | "jobs" | "properties" | "news" | "events" | "curiosities";

export const CONTENT_TABLES: { key: ContentTable; label: string }[] = [
  { key: "businesses", label: "Empresas" },
  { key: "jobs", label: "Vagas" },
  { key: "properties", label: "Imóveis" },
  { key: "news", label: "Notícias" },
  { key: "events", label: "Eventos" },
  { key: "curiosities", label: "Curiosidades" },
];

export async function listPending(table: ContentTable) {
  const { data, error } = await supabase
    .from(table)
    .select("id, status, created_at, submitted_by, " + titleColumn(table))
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function titleColumn(table: ContentTable) {
  return table === "businesses" ? "name" : "title";
}
