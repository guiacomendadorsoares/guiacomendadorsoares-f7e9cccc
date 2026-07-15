
-- Composite indexes to speed up the most common list queries.
-- All use IF NOT EXISTS to be safe on re-runs.

-- businesses: approved + main_category + subcategory ordered by featured/name
CREATE INDEX IF NOT EXISTS idx_businesses_status_main_sub
  ON public.businesses (status, main_category, subcategory);
CREATE INDEX IF NOT EXISTS idx_businesses_status_featured_name
  ON public.businesses (status, featured DESC, name);

-- properties: approved + active + listing_type + kind
CREATE INDEX IF NOT EXISTS idx_properties_status_active_type
  ON public.properties (status, active, listing_type, kind);

-- jobs: approved + active ordered by posted_at DESC
CREATE INDEX IF NOT EXISTS idx_jobs_status_active_posted
  ON public.jobs (status, active, posted_at DESC);

-- events: approved + active ordered by starts_at
CREATE INDEX IF NOT EXISTS idx_events_status_active_starts
  ON public.events (status, active, starts_at);

-- news: approved + published ordered by published_at DESC
CREATE INDEX IF NOT EXISTS idx_news_status_published_at
  ON public.news (status, published, published_at DESC);

-- curiosities: filter by status
CREATE INDEX IF NOT EXISTS idx_curiosities_status
  ON public.curiosities (status);
