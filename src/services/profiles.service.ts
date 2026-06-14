import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
}

export async function fetchProfileByUserId(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[profiles.service] fetch error:", error.message);
    return null;
  }
  return (data as Profile) ?? null;
}
