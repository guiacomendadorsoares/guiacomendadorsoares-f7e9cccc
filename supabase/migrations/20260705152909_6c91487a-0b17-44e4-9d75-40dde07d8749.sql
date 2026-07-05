
-- Enums
DO $$ BEGIN
  CREATE TYPE public.plan_status AS ENUM ('active','suspended','canceled','trial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.plan_source AS ENUM ('manual_admin','asaas','promotion','courtesy','migration');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS plan_status public.plan_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan_source public.plan_source NOT NULL DEFAULT 'manual_admin',
  ADD COLUMN IF NOT EXISTS plan_started_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS plan_notes text;

-- Effective plan function (respects status & expiry)
CREATE OR REPLACE FUNCTION public.effective_plan(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN p.plan_status IN ('suspended','canceled') THEN 'free'
    WHEN p.plan_expires_at IS NOT NULL AND p.plan_expires_at < now() THEN 'free'
    ELSE p.current_plan
  END
  FROM public.profiles p
  WHERE p.user_id = _user_id
  LIMIT 1
$$;

-- Audit log table
CREATE TABLE IF NOT EXISTS public.plan_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_user_id uuid NOT NULL,
  changed_by uuid,
  previous_plan text,
  new_plan text,
  previous_status public.plan_status,
  new_status public.plan_status,
  previous_expires_at timestamptz,
  new_expires_at timestamptz,
  previous_source public.plan_source,
  new_source public.plan_source,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.plan_audit_log TO authenticated;
GRANT ALL ON public.plan_audit_log TO service_role;

ALTER TABLE public.plan_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin reads plan audit" ON public.plan_audit_log;
CREATE POLICY "admin reads plan audit" ON public.plan_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "admin inserts plan audit" ON public.plan_audit_log;
CREATE POLICY "admin inserts plan audit" ON public.plan_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS plan_audit_log_user_idx
  ON public.plan_audit_log (profile_user_id, created_at DESC);

-- Trigger: log plan changes
CREATE OR REPLACE FUNCTION public.log_plan_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (
    NEW.current_plan IS DISTINCT FROM OLD.current_plan
    OR NEW.plan_status IS DISTINCT FROM OLD.plan_status
    OR NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at
    OR NEW.plan_source IS DISTINCT FROM OLD.plan_source
  ) THEN
    INSERT INTO public.plan_audit_log(
      profile_user_id, changed_by,
      previous_plan, new_plan,
      previous_status, new_status,
      previous_expires_at, new_expires_at,
      previous_source, new_source,
      reason
    ) VALUES (
      NEW.user_id, auth.uid(),
      OLD.current_plan, NEW.current_plan,
      OLD.plan_status, NEW.plan_status,
      OLD.plan_expires_at, NEW.plan_expires_at,
      OLD.plan_source, NEW.plan_source,
      NEW.plan_notes
    );
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_log_plan_change ON public.profiles;
CREATE TRIGGER trg_log_plan_change
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_plan_change();
