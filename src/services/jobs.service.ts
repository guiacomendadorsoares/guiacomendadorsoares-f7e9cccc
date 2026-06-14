import { supabase } from "@/integrations/supabase/client";
import type { Job } from "@/lib/jobs";

export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("active", true)
    .eq("status", "approved")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("[jobs.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as unknown as Job[];
}
