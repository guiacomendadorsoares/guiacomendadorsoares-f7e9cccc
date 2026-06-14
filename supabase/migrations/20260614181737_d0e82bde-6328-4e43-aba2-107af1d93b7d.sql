-- =========================
-- FASE 1: RBAC + STATUS + RLS
-- =========================

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','editor','partner','broker','influencer','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.content_status AS ENUM ('draft','pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role (SECURITY DEFINER, evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin')
$$;

-- Policies user_roles
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "admin manage roles" ON public.user_roles;
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 4. profiles - garantir colunas
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- 5. Adicionar colunas de aprovação nas tabelas de conteúdo
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['businesses','jobs','properties','news','events']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS status public.content_status NOT NULL DEFAULT ''approved''', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS approved_at timestamptz', t);
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS rejection_reason text', t);
  END LOOP;
END $$;

-- 6. curiosities (nova)
CREATE TABLE IF NOT EXISTS public.curiosities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  cover_url text,
  status public.content_status NOT NULL DEFAULT 'pending',
  submitted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.curiosities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.curiosities TO authenticated;
GRANT ALL ON public.curiosities TO service_role;
ALTER TABLE public.curiosities ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_curiosities_updated_at BEFORE UPDATE ON public.curiosities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('business','property','job','event','news')),
  target_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own favorites" ON public.favorites FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 8. notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications read" ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "own notifications update" ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 9. RLS para tabelas de conteúdo (drop tudo e recriar padrão)
DO $$
DECLARE t text; pol record;
BEGIN
  FOREACH t IN ARRAY ARRAY['businesses','jobs','properties','news','events','curiosities']
  LOOP
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename=t LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
    END LOOP;

    EXECUTE format($p$
      CREATE POLICY "public read approved" ON public.%I FOR SELECT TO anon, authenticated
        USING (status = 'approved');
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "owner read own" ON public.%I FOR SELECT TO authenticated
        USING (submitted_by = auth.uid());
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "admin read all" ON public.%I FOR SELECT TO authenticated
        USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "auth insert" ON public.%I FOR INSERT TO authenticated
        WITH CHECK (submitted_by = auth.uid() OR public.has_role(auth.uid(),'admin'));
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "owner update own draft" ON public.%I FOR UPDATE TO authenticated
        USING (submitted_by = auth.uid() AND status IN ('draft','pending','rejected'))
        WITH CHECK (submitted_by = auth.uid());
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "admin update all" ON public.%I FOR UPDATE TO authenticated
        USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
        WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
    $p$, t);

    EXECUTE format($p$
      CREATE POLICY "admin delete" ON public.%I FOR DELETE TO authenticated
        USING (public.has_role(auth.uid(),'admin'));
    $p$, t);
  END LOOP;
END $$;

-- 10. Trigger: força status='pending' para não-admins/não-editores ao inserir
CREATE OR REPLACE FUNCTION public.enforce_pending_on_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF NOT (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor')) THEN
    IF NEW.status = 'approved' THEN
      NEW.status := 'pending';
    END IF;
    NEW.submitted_by := auth.uid();
    NEW.approved_by := NULL;
    NEW.approved_at := NULL;
  END IF;
  RETURN NEW;
END $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['businesses','jobs','properties','news','events','curiosities']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_enforce_pending ON public.%I', t);
    EXECUTE format('CREATE TRIGGER trg_enforce_pending BEFORE INSERT ON public.%I FOR EACH ROW EXECUTE FUNCTION public.enforce_pending_on_insert()', t);
  END LOOP;
END $$;

-- 11. Trigger: novo usuário cria profile + role 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 12. profiles policies (recriar)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='profiles' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "public read profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin manage profiles" ON public.profiles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
