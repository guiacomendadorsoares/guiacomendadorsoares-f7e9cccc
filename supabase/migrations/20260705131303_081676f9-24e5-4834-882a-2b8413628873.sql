
-- Pharmacy product categories
CREATE TABLE public.pharmacy_product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pharmacy_product_categories TO anon, authenticated;
GRANT ALL ON public.pharmacy_product_categories TO service_role;
ALTER TABLE public.pharmacy_product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.pharmacy_product_categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.pharmacy_product_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- Pharmacy products
CREATE TABLE public.pharmacy_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  brand text,
  active_ingredient text,
  description text,
  image_url text,
  price numeric(10,2),
  promo_price numeric(10,2),
  available boolean NOT NULL DEFAULT true,
  delivery boolean NOT NULL DEFAULT false,
  pickup boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pharmacy_products_business_idx ON public.pharmacy_products(business_id);
CREATE INDEX pharmacy_products_name_idx ON public.pharmacy_products(lower(name));
CREATE INDEX pharmacy_products_category_idx ON public.pharmacy_products(category);
CREATE INDEX pharmacy_products_promo_idx ON public.pharmacy_products(promo_price) WHERE promo_price IS NOT NULL;

GRANT SELECT ON public.pharmacy_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.pharmacy_products TO authenticated;
GRANT ALL ON public.pharmacy_products TO service_role;

ALTER TABLE public.pharmacy_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read available products" ON public.pharmacy_products FOR SELECT USING (available = true);
CREATE POLICY "Owners read own products" ON public.pharmacy_products FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.submitted_by = auth.uid()));
CREATE POLICY "Owners insert own products" ON public.pharmacy_products FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.submitted_by = auth.uid()));
CREATE POLICY "Owners update own products" ON public.pharmacy_products FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.submitted_by = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.submitted_by = auth.uid()));
CREATE POLICY "Owners delete own products" ON public.pharmacy_products FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.submitted_by = auth.uid()));
CREATE POLICY "Admins manage products" ON public.pharmacy_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE TRIGGER pharmacy_products_set_updated_at BEFORE UPDATE ON public.pharmacy_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Pharmacy search events
CREATE TABLE public.pharmacy_search_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  product_id uuid REFERENCES public.pharmacy_products(id) ON DELETE SET NULL,
  business_id uuid REFERENCES public.businesses(id) ON DELETE SET NULL,
  event_type text NOT NULL DEFAULT 'search',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pharmacy_search_events_query_idx ON public.pharmacy_search_events(lower(query));
CREATE INDEX pharmacy_search_events_created_idx ON public.pharmacy_search_events(created_at DESC);

GRANT INSERT ON public.pharmacy_search_events TO anon, authenticated;
GRANT SELECT ON public.pharmacy_search_events TO authenticated;
GRANT ALL ON public.pharmacy_search_events TO service_role;

ALTER TABLE public.pharmacy_search_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log events" ON public.pharmacy_search_events FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Admins read events" ON public.pharmacy_search_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

-- Seed default categories
INSERT INTO public.pharmacy_product_categories (slug, name, icon, sort_order) VALUES
  ('medicamentos','Medicamentos','💊',1),
  ('higiene','Higiene Pessoal','🧴',2),
  ('beleza','Beleza & Cosméticos','💄',3),
  ('bebes','Mamãe & Bebê','🍼',4),
  ('suplementos','Vitaminas & Suplementos','💪',5),
  ('dermocosmeticos','Dermocosméticos','🧖',6),
  ('primeiros-socorros','Primeiros Socorros','🩹',7),
  ('outros','Outros','📦',99)
ON CONFLICT (slug) DO NOTHING;
