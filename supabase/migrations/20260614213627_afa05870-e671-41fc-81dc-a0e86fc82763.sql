
-- Add banner_url and gallery_urls (text[]) to businesses and properties
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}'::text[];

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS video_url text;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS latitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS longitude numeric(9,6);

-- Storage policies on bucket 'uploads'
-- Public READ for anyone (signed URLs not needed for public assets)
CREATE POLICY "uploads public read"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'uploads');

-- Authenticated users can INSERT into their own folder (owner=auth.uid())
CREATE POLICY "uploads auth insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads' AND owner = auth.uid());

-- Owners can UPDATE/DELETE their own objects; admins can manage all
CREATE POLICY "uploads owner update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'uploads' AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin')))
WITH CHECK (bucket_id = 'uploads' AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "uploads owner delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin')));
