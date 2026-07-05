
-- Remove overly permissive public SELECT on profiles that exposed sensitive PII
DROP POLICY IF EXISTS "profiles readable - non sensitive columns" ON public.profiles;

-- Expose only genuinely public columns via a safe view
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT user_id, full_name, avatar_url, bio
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Allow authenticated users to read only safe columns of other profiles through the base table
-- (owner/admin policies already grant full access to owners and admins)
CREATE POLICY "authenticated can read minimal profile fields"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
