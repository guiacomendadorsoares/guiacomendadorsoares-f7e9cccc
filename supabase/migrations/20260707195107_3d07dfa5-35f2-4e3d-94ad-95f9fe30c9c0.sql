-- Fix mojibake (UTF-8 bytes previously decoded as Latin-1 then re-stored as UTF-8)
-- Only touches rows that clearly contain the mojibake marker sequences.
DO $$
DECLARE
  cols text[] := ARRAY['name','address','description','category_label','subcategory','main_category'];
  c text;
BEGIN
  FOREACH c IN ARRAY cols LOOP
    EXECUTE format(
      'UPDATE public.businesses
         SET %1$I = convert_from(convert_to(%1$I, ''LATIN1''), ''UTF8'')
       WHERE %1$I ~ ''[ÃÂ][\x80-\xBF]''',
      c
    );
  END LOOP;
END $$;