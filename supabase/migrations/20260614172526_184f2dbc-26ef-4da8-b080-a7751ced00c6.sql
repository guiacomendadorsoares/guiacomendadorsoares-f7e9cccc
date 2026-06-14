
-- =========================================================
-- Shared updated_at trigger function
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- Enums
-- =========================================================
CREATE TYPE public.job_type AS ENUM ('emprego', 'estagio', 'jovem-aprendiz', 'freelancer');
CREATE TYPE public.listing_type AS ENUM ('venda', 'aluguel');
CREATE TYPE public.property_kind AS ENUM ('casa', 'apartamento', 'terreno', 'comercial');
CREATE TYPE public.restaurant_category AS ENUM ('restaurante', 'hamburgueria', 'pizzaria', 'padaria', 'japones', 'acai');
CREATE TYPE public.news_category AS ENUM ('bairro', 'seguranca', 'transito', 'obras', 'saude', 'educacao');
CREATE TYPE public.comment_target AS ENUM ('business', 'news', 'event');

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- businesses
-- =========================================================
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  whatsapp TEXT,
  instagram TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  cover_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  hours JSONB NOT NULL DEFAULT '[]'::jsonb,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  verified BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Businesses are viewable by everyone" ON public.businesses FOR SELECT USING (true);
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_featured ON public.businesses(featured) WHERE featured;
CREATE TRIGGER trg_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- jobs
-- =========================================================
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  type public.job_type NOT NULL,
  salary TEXT,
  location TEXT NOT NULL,
  description TEXT,
  apply_url TEXT,
  whatsapp TEXT,
  urgent BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active jobs are viewable by everyone" ON public.jobs FOR SELECT USING (active = true);
CREATE INDEX idx_jobs_type ON public.jobs(type);
CREATE INDEX idx_jobs_active_posted ON public.jobs(active, posted_at DESC);
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- properties
-- =========================================================
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  listing_type public.listing_type NOT NULL,
  kind public.property_kind NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  price_label TEXT,
  bedrooms SMALLINT,
  bathrooms SMALLINT,
  parking SMALLINT,
  area_m2 NUMERIC(10,2),
  address TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active properties are viewable by everyone" ON public.properties FOR SELECT USING (active = true);
CREATE INDEX idx_properties_listing_kind ON public.properties(listing_type, kind);
CREATE INDEX idx_properties_featured ON public.properties(featured) WHERE featured;
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- restaurants
-- =========================================================
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category public.restaurant_category NOT NULL,
  cover_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  price_range SMALLINT NOT NULL DEFAULT 2 CHECK (price_range BETWEEN 1 AND 4),
  whatsapp TEXT,
  address TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.restaurants TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.restaurants TO authenticated;
GRANT ALL ON public.restaurants TO service_role;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Restaurants are viewable by everyone" ON public.restaurants FOR SELECT USING (true);
CREATE INDEX idx_restaurants_category ON public.restaurants(category);
CREATE TRIGGER trg_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- events
-- =========================================================
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  cover_url TEXT,
  location TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  price NUMERIC(12,2),
  is_free BOOLEAN NOT NULL DEFAULT true,
  url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active events are viewable by everyone" ON public.events FOR SELECT USING (active = true);
CREATE INDEX idx_events_starts_at ON public.events(starts_at);
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- news
-- =========================================================
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  summary TEXT,
  content TEXT,
  cover_url TEXT,
  category public.news_category NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT ALL ON public.news TO service_role;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news are viewable by everyone" ON public.news FOR SELECT USING (published = true);
CREATE INDEX idx_news_category_published ON public.news(category, published_at DESC);
CREATE TRIGGER trg_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- comments (polymorphic: business / news / event)
-- =========================================================
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type public.comment_target NOT NULL,
  target_id UUID NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved comments are viewable by everyone" ON public.comments FOR SELECT USING (approved = true);
CREATE INDEX idx_comments_target ON public.comments(target_type, target_id, created_at DESC);
CREATE TRIGGER trg_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- ratings (1-5 stars on a business)
-- =========================================================
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ratings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT ALL ON public.ratings TO service_role;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE INDEX idx_ratings_business ON public.ratings(business_id, created_at DESC);
CREATE TRIGGER trg_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
