
-- ============ business_members ============
CREATE TABLE public.business_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'proprietario',
  status TEXT NOT NULL DEFAULT 'active',
  is_primary_owner BOOLEAN NOT NULL DEFAULT false,
  invited_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT business_members_status_ck CHECK (status IN ('active','suspended','pending')),
  CONSTRAINT business_members_role_ck CHECK (role IN ('proprietario','admin_empresa','gerente','marketing','financeiro','editor','operador','atendimento','leitura'))
);
CREATE UNIQUE INDEX business_members_unique_active ON public.business_members(business_id, user_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX business_members_one_primary_owner ON public.business_members(business_id) WHERE is_primary_owner = true AND deleted_at IS NULL;
CREATE INDEX business_members_user_idx ON public.business_members(user_id) WHERE deleted_at IS NULL;
CREATE INDEX business_members_business_idx ON public.business_members(business_id) WHERE deleted_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_members TO authenticated;
GRANT ALL ON public.business_members TO service_role;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

-- Helper: business_has_owner (bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.business_has_owner(_business_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_id = _business_id
      AND is_primary_owner = true
      AND status = 'active'
      AND deleted_at IS NULL
  )
$$;

-- Helper: has_business_permission (used by RLS on business-owned tables in later phases)
CREATE OR REPLACE FUNCTION public.has_business_permission(_user_id UUID, _business_id UUID, _permission TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
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

CREATE POLICY "members read own memberships"
  ON public.business_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins manage memberships"
  ON public.business_members FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER business_members_set_updated_at
  BEFORE UPDATE ON public.business_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ business_claims ============
CREATE TABLE public.business_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  claimant_user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  role_in_company TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT NOT NULL,
  verification_method TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'pending',
  internal_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT claims_status_ck CHECK (status IN ('pending','in_review','awaiting_docs','approved','rejected','already_claimed','canceled')),
  CONSTRAINT claims_method_ck CHECK (verification_method IN ('manual','email_code','whatsapp_code','sms_code','domain'))
);
CREATE INDEX claims_business_idx ON public.business_claims(business_id);
CREATE INDEX claims_user_idx ON public.business_claims(claimant_user_id);
CREATE INDEX claims_status_idx ON public.business_claims(status);
CREATE INDEX claims_created_idx ON public.business_claims(created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_claims TO authenticated;
GRANT ALL ON public.business_claims TO service_role;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

-- Claimants can create + read their own claims (status forced to pending server-side via trigger below)
CREATE POLICY "claimants create own claims"
  ON public.business_claims FOR INSERT TO authenticated
  WITH CHECK (claimant_user_id = auth.uid());

CREATE POLICY "claimants read own claims"
  ON public.business_claims FOR SELECT TO authenticated
  USING (claimant_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "claimants cancel own pending claims"
  ON public.business_claims FOR UPDATE TO authenticated
  USING (claimant_user_id = auth.uid() AND status IN ('pending','awaiting_docs'))
  WITH CHECK (claimant_user_id = auth.uid() AND status IN ('pending','canceled','awaiting_docs'));

CREATE POLICY "admins manage claims"
  ON public.business_claims FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Enforce: non-admins can never set an approved/reviewed status on insert or update
CREATE OR REPLACE FUNCTION public.enforce_claim_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF NOT public.has_role(auth.uid(),'admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.status := 'pending';
      NEW.reviewed_by := NULL;
      NEW.reviewed_at := NULL;
      NEW.internal_notes := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
      -- Non-admin owners can only cancel their claim
      IF NEW.status NOT IN ('canceled') THEN
        NEW.status := OLD.status;
      END IF;
      NEW.reviewed_by := OLD.reviewed_by;
      NEW.reviewed_at := OLD.reviewed_at;
      NEW.internal_notes := OLD.internal_notes;
      NEW.rejection_reason := OLD.rejection_reason;
    END IF;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER business_claims_enforce_status
  BEFORE INSERT OR UPDATE ON public.business_claims
  FOR EACH ROW EXECUTE FUNCTION public.enforce_claim_status();

CREATE TRIGGER business_claims_set_updated_at
  BEFORE UPDATE ON public.business_claims
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ business_claim_documents ============
CREATE TABLE public.business_claim_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.business_claims(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT doc_type_ck CHECK (doc_type IN ('cnpj_card','social_contract','bond_proof','identity','other'))
);
CREATE INDEX claim_docs_claim_idx ON public.business_claim_documents(claim_id);

GRANT SELECT, INSERT, DELETE ON public.business_claim_documents TO authenticated;
GRANT ALL ON public.business_claim_documents TO service_role;
ALTER TABLE public.business_claim_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "claimants manage own claim docs"
  ON public.business_claim_documents FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR EXISTS (
      SELECT 1 FROM public.business_claims c
      WHERE c.id = claim_id AND c.claimant_user_id = auth.uid()
    )
  )
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.business_claims c
      WHERE c.id = claim_id AND c.claimant_user_id = auth.uid()
    )
  );

CREATE POLICY "admins manage claim docs"
  ON public.business_claim_documents FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ business_audit_log ============
CREATE TABLE public.business_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  actor_user_id UUID,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  field_name TEXT,
  previous_value JSONB,
  new_value JSONB,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_business_idx ON public.business_audit_log(business_id);
CREATE INDEX audit_actor_idx ON public.business_audit_log(actor_user_id);
CREATE INDEX audit_created_idx ON public.business_audit_log(created_at DESC);

GRANT SELECT, INSERT ON public.business_audit_log TO authenticated;
GRANT ALL ON public.business_audit_log TO service_role;
ALTER TABLE public.business_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members read audit for their business"
  ON public.business_audit_log FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR public.has_business_permission(auth.uid(), business_id)
  );

CREATE POLICY "authenticated append audit"
  ON public.business_audit_log FOR INSERT TO authenticated
  WITH CHECK (actor_user_id = auth.uid());
