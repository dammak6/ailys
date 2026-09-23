-- =============================================================================
-- Migration: Add Product Size Guide Override
-- Description: Adds an optional size_guide JSONB column to public.products.
--              If NULL, the application uses the default AÏLYS size guide.
--              If populated, it provides custom measurements and tailoring notes.
-- =============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide jsonb DEFAULT NULL;

COMMENT ON COLUMN public.products.size_guide IS 'Product-specific size guide override containing custom measurement charts and fit notes. If NULL, default AÏLYS size guide is used.';
