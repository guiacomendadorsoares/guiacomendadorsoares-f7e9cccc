-- Restrict SECURITY DEFINER functions and tighten pharmacy_search_events insert policy

-- Trigger functions must not be callable via RPC by anyone
REVOKE EXECUTE ON FUNCTION public.log_plan_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_crm_lead_change() FROM PUBLIC, anon, authenticated;

-- effective_plan reveals a user's plan; restrict to signed-in callers
REVOKE EXECUTE ON FUNCTION public.effective_plan(uuid) FROM PUBLIC, anon;

-- Tighten analytics insert: cap size and constrain event types (public read-only allowed elsewhere)
DROP POLICY IF EXISTS "Anyone can log events" ON public.pharmacy_search_events;
CREATE POLICY "Anyone can log events"
  ON public.pharmacy_search_events
  FOR INSERT
  TO public
  WITH CHECK (
    length(query) <= 200
    AND event_type IN ('search','click','view','impression')
    AND (user_id IS NULL OR user_id = auth.uid())
  );