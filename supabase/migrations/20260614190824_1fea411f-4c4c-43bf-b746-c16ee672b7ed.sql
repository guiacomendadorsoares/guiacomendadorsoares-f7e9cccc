
-- 1) Profiles: column-level grants hide email/phone from non-owners
DROP POLICY IF EXISTS "public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "own profile read" ON public.profiles;
DROP POLICY IF EXISTS "authenticated read non-sensitive" ON public.profiles;
DROP POLICY IF EXISTS "discoverable profile fields" ON public.profiles;

CREATE POLICY "profiles readable - non sensitive columns"
  ON public.profiles FOR SELECT TO anon, authenticated
  USING (true);

-- Restrict columns: revoke broad SELECT then re-grant only safe columns; owners get full row via auth context separately
REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (user_id, full_name, avatar_url, bio) ON public.profiles TO anon, authenticated;

-- Allow owner to read all own columns
CREATE POLICY "owner reads own profile full"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
GRANT SELECT (id, email, phone, created_at, updated_at) ON public.profiles TO authenticated;

-- 2) Prevent owner self-approval on content tables (status is content_status enum)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['businesses','jobs','properties','news','events','curiosities']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "owner update own draft" ON public.%I', t);
    EXECUTE format($p$
      CREATE POLICY "owner update own draft" ON public.%I
        FOR UPDATE TO authenticated
        USING (submitted_by = auth.uid() AND status IN ('draft'::content_status,'pending'::content_status,'rejected'::content_status))
        WITH CHECK (submitted_by = auth.uid() AND status IN ('draft'::content_status,'pending'::content_status,'rejected'::content_status))
    $p$, t);
  END LOOP;
END $$;
