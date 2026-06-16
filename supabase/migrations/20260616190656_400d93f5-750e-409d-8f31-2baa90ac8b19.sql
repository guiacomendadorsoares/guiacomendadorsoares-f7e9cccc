
CREATE TABLE public.popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  image_url text,
  link_url text,
  link_label text,
  active boolean NOT NULL DEFAULT true,
  frequency text NOT NULL DEFAULT 'session' CHECK (frequency IN ('once','session','always')),
  starts_at timestamptz,
  ends_at timestamptz,
  priority integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.popups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.popups TO authenticated;
GRANT ALL ON public.popups TO service_role;

ALTER TABLE public.popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active popups in window"
  ON public.popups FOR SELECT
  USING (
    active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at >= now())
  );

CREATE POLICY "Admins manage popups"
  ON public.popups FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER popups_set_updated_at
  BEFORE UPDATE ON public.popups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
