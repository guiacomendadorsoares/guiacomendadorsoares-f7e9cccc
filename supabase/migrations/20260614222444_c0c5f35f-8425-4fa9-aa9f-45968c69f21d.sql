ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS main_category text,
  ADD COLUMN IF NOT EXISTS subcategory text;

CREATE INDEX IF NOT EXISTS businesses_main_category_idx ON public.businesses (main_category);
CREATE INDEX IF NOT EXISTS businesses_main_sub_idx ON public.businesses (main_category, subcategory);