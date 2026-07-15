
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION public.businesses_tsv(
  _name text, _main text, _sub text, _cat_label text, _desc text
) RETURNS tsvector
LANGUAGE sql IMMUTABLE
SET search_path = public
AS $$
  SELECT
    setweight(to_tsvector('simple', unaccent(coalesce(_name, ''))),      'A') ||
    setweight(to_tsvector('simple', unaccent(coalesce(_main, ''))),      'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(_sub, ''))),       'B') ||
    setweight(to_tsvector('simple', unaccent(coalesce(_cat_label, ''))), 'C') ||
    setweight(to_tsvector('simple', unaccent(coalesce(_desc, ''))),      'D')
$$;

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    public.businesses_tsv(name, main_category, subcategory, category_label, description)
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_businesses_search_tsv
  ON public.businesses USING GIN (search_tsv);
