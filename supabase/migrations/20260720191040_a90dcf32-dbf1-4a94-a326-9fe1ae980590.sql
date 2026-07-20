
-- Helper: is user an active manager (proprietario or gerente) of a business?
CREATE OR REPLACE FUNCTION public.is_business_manager(_user_id uuid, _business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members
    WHERE user_id = _user_id
      AND business_id = _business_id
      AND status = 'active'
      AND deleted_at IS NULL
      AND (role IN ('proprietario','gerente') OR is_primary_owner = true)
  )
$$;

-- Helper: is user any active member (any role)
CREATE OR REPLACE FUNCTION public.is_business_member(_user_id uuid, _business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members
    WHERE user_id = _user_id
      AND business_id = _business_id
      AND status = 'active'
      AND deleted_at IS NULL
  )
$$;

-- business_members: managers can manage team
DROP POLICY IF EXISTS "managers view team" ON public.business_members;
CREATE POLICY "managers view team" ON public.business_members
FOR SELECT TO authenticated
USING (public.is_business_manager(auth.uid(), business_id));

DROP POLICY IF EXISTS "managers insert team" ON public.business_members;
CREATE POLICY "managers insert team" ON public.business_members
FOR INSERT TO authenticated
WITH CHECK (
  public.is_business_manager(auth.uid(), business_id)
  AND is_primary_owner = false
  AND role IN ('gerente','editor','financeiro')
);

DROP POLICY IF EXISTS "managers update team" ON public.business_members;
CREATE POLICY "managers update team" ON public.business_members
FOR UPDATE TO authenticated
USING (public.is_business_manager(auth.uid(), business_id))
WITH CHECK (
  public.is_business_manager(auth.uid(), business_id)
  AND is_primary_owner = false
  AND role IN ('gerente','editor','financeiro')
);

DROP POLICY IF EXISTS "managers delete team" ON public.business_members;
CREATE POLICY "managers delete team" ON public.business_members
FOR DELETE TO authenticated
USING (
  public.is_business_manager(auth.uid(), business_id)
  AND is_primary_owner = false
);

-- businesses: members can read their business regardless of status
DROP POLICY IF EXISTS "members read own business" ON public.businesses;
CREATE POLICY "members read own business" ON public.businesses
FOR SELECT TO authenticated
USING (public.is_business_member(auth.uid(), id));

-- businesses: managers/editors can update their business (respecting existing forcePending trigger)
DROP POLICY IF EXISTS "members update own business" ON public.businesses;
CREATE POLICY "members update own business" ON public.businesses
FOR UPDATE TO authenticated
USING (public.is_business_member(auth.uid(), id))
WITH CHECK (public.is_business_member(auth.uid(), id));
