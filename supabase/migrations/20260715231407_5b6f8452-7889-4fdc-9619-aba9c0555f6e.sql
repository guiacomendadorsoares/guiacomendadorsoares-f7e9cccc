
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION unaccent SET SCHEMA extensions;

-- Recreate helper to reference the moved extension
CREATE OR REPLACE FUNCTION public.businesses_tsv(
  _name text, _main text, _sub text, _cat_label text, _desc text
) RETURNS tsvector
LANGUAGE sql IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT
    setweight(to_tsvector('simple', extensions.unaccent(coalesce(_name, ''))),      'A') ||
    setweight(to_tsvector('simple', extensions.unaccent(coalesce(_main, ''))),      'B') ||
    setweight(to_tsvector('simple', extensions.unaccent(coalesce(_sub, ''))),       'B') ||
    setweight(to_tsvector('simple', extensions.unaccent(coalesce(_cat_label, ''))), 'C') ||
    setweight(to_tsvector('simple', extensions.unaccent(coalesce(_desc, ''))),      'D')
$$;
