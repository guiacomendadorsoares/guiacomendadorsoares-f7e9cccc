import { supabase } from "@/integrations/supabase/client";

export type CommentTarget = "business" | "news" | "event";

export interface CommentItem {
  id: string;
  target_type: CommentTarget;
  target_id: string;
  author_id: string | null;
  author_name: string | null;
  content: string;
  approved: boolean;
  created_at: string;
}

export async function fetchComments(
  targetType: CommentTarget,
  targetId: string,
): Promise<CommentItem[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[comments.service] fetch error:", error.message);
    return [];
  }
  return (data ?? []) as CommentItem[];
}
