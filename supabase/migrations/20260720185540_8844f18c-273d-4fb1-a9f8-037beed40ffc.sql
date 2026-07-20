
-- Storage policies for business-claims bucket
CREATE POLICY "claim owners can upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'business-claims'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "claim owners can read own"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'business-claims'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
    )
  );

CREATE POLICY "claim owners can delete own"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'business-claims'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.has_role(auth.uid(),'admin')
    )
  );
