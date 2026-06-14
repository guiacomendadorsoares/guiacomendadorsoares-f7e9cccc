
-- ============ subscription_plans ============
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.subscription_plans TO anon, authenticated;
GRANT ALL ON public.subscription_plans TO service_role;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_active_public" ON public.subscription_plans
  FOR SELECT USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "plans_admin_write" ON public.subscription_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_plans_updated_at BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ subscriptions ============
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','cancelled','expired')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subs_select_own_or_admin" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "subs_admin_write" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_subs_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ profiles.current_plan ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_plan TEXT NOT NULL DEFAULT 'free'
  CHECK (current_plan IN ('free','destaque','ouro'));

-- ============ seed planos ============
INSERT INTO public.subscription_plans (name, slug, description, price, sort_order, features) VALUES
('Free', 'free', 'Plano gratuito para começar sua presença no Guia.', 0, 1, jsonb_build_object(
  'business', jsonb_build_object('logo',true,'banner',false,'gallery',false,'videos',false,'social',false,'whatsapp',false,'promotions',false,'stats','none','featured_home',false,'featured_category',false,'verified_badge',false),
  'properties', jsonb_build_object('max_listings',3,'max_photos',5,'videos',false,'featured_home',false,'featured_search',false,'stats','none','whatsapp',false)
)),
('Destaque', 'destaque', 'Para empresas que querem ganhar visibilidade.', 49.90, 2, jsonb_build_object(
  'business', jsonb_build_object('logo',true,'banner',true,'gallery',true,'gallery_max',20,'videos',false,'social',true,'whatsapp',true,'promotions',true,'stats','basic','featured_home',false,'featured_category',false,'verified_badge',true),
  'properties', jsonb_build_object('max_listings',30,'max_photos',20,'videos',false,'featured_home',false,'featured_search',false,'stats','basic','whatsapp',true)
)),
('Ouro', 'ouro', 'Máxima exposição e recursos premium.', 149.90, 3, jsonb_build_object(
  'business', jsonb_build_object('logo',true,'banner',true,'gallery',true,'gallery_max',100,'videos',true,'social',true,'whatsapp',true,'promotions',true,'stats','advanced','featured_home',true,'featured_category',true,'verified_badge',true,'rotating_banner',true,'priority_search',true,'sponsored_posts',true),
  'properties', jsonb_build_object('max_listings',-1,'max_photos',-1,'videos',true,'featured_home',true,'featured_search',true,'stats','advanced','whatsapp',true,'priority_search',true)
));
