DROP POLICY IF EXISTS "Anyone can view active banners" ON public.banners;

CREATE POLICY "Anyone can view active banners" ON public.banners
  FOR SELECT TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Admins can view all banners" ON public.banners;

CREATE POLICY "Admins can view all banners" ON public.banners
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
