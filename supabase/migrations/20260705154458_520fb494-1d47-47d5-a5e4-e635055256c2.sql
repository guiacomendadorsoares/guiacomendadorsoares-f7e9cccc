
-- Enums
CREATE TYPE public.crm_stage AS ENUM (
  'lead','contato','visita','proposta','negociacao','teste','ativo','renovacao','cancelado'
);
CREATE TYPE public.crm_partner_type AS ENUM ('empresa','farmacia','corretor','imobiliaria','lead');
CREATE TYPE public.crm_activity_type AS ENUM ('ligacao','visita','whatsapp','email','proposta','reuniao','observacao');

-- crm_leads
CREATE TABLE public.crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT,
  partner_type public.crm_partner_type NOT NULL DEFAULT 'lead',
  contact_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  neighborhood TEXT,
  stage public.crm_stage NOT NULL DEFAULT 'lead',
  plan_slug TEXT NOT NULL DEFAULT 'free',
  plan_source TEXT NOT NULL DEFAULT 'manual_admin',
  monthly_value NUMERIC(10,2),
  next_action TEXT,
  next_action_at TIMESTAMPTZ,
  renewal_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_leads TO authenticated;
GRANT ALL ON public.crm_leads TO service_role;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm_leads" ON public.crm_leads
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_crm_leads_updated BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- crm_activities
CREATE TABLE public.crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  type public.crm_activity_type NOT NULL,
  content TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_activities TO authenticated;
GRANT ALL ON public.crm_activities TO service_role;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm_activities" ON public.crm_activities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_crm_activities_lead ON public.crm_activities(lead_id, created_at DESC);

-- crm_reminders
CREATE TABLE public.crm_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_reminders TO authenticated;
GRANT ALL ON public.crm_reminders TO service_role;
ALTER TABLE public.crm_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage crm_reminders" ON public.crm_reminders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_crm_reminders_updated BEFORE UPDATE ON public.crm_reminders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_crm_reminders_due ON public.crm_reminders(due_at) WHERE done = false;

-- crm_audit_log
CREATE TABLE public.crm_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  changed_by UUID,
  previous_stage public.crm_stage,
  new_stage public.crm_stage,
  previous_plan TEXT,
  new_plan TEXT,
  previous_source TEXT,
  new_source TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.crm_audit_log TO authenticated;
GRANT ALL ON public.crm_audit_log TO service_role;
ALTER TABLE public.crm_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read crm_audit_log" ON public.crm_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert crm_audit_log" ON public.crm_audit_log
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Audit trigger
CREATE OR REPLACE FUNCTION public.log_crm_lead_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (
    NEW.stage IS DISTINCT FROM OLD.stage
    OR NEW.plan_slug IS DISTINCT FROM OLD.plan_slug
    OR NEW.plan_source IS DISTINCT FROM OLD.plan_source
  ) THEN
    INSERT INTO public.crm_audit_log(
      lead_id, changed_by,
      previous_stage, new_stage,
      previous_plan, new_plan,
      previous_source, new_source,
      reason
    ) VALUES (
      NEW.id, auth.uid(),
      OLD.stage, NEW.stage,
      OLD.plan_slug, NEW.plan_slug,
      OLD.plan_source, NEW.plan_source,
      NEW.notes
    );
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_crm_leads_audit AFTER UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.log_crm_lead_change();
