import { supabase } from "@/integrations/supabase/client";
import { sampleJobs, type Job } from "@/lib/jobs";

export async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("active", true)
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("[jobs.service] fetch error:", error.message);
    return sampleJobs;
  }
  if (!data || data.length === 0) return sampleJobs;
  return data as unknown as Job[];
}
