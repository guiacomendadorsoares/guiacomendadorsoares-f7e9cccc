DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Uploads are publicly readable'
  ) THEN
    CREATE POLICY "Uploads are publicly readable"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'uploads');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can upload to uploads'
  ) THEN
    CREATE POLICY "Authenticated users can upload to uploads"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can update own uploads'
  ) THEN
    CREATE POLICY "Authenticated users can update own uploads"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text)
    WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users can delete own uploads'
  ) THEN
    CREATE POLICY "Authenticated users can delete own uploads"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
  END IF;
END $$;