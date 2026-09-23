-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 02 - CATALOG, MEDIA, COLLECTIONS & INVENTORY
-- Project: ailys (kafyatqatggifedqtctm)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PRODUCTS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    subtitle VARCHAR(255),
    description TEXT,
    materials TEXT,
    care TEXT,
    fit TEXT,
    price NUMERIC(12,3) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12,3) CHECK (sale_price IS NULL OR sale_price < price),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sub_category VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_new BOOLEAN NOT NULL DEFAULT false,
    is_capsule BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_sold_out_manual_override BOOLEAN NOT NULL DEFAULT false,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON public.products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);

-- -----------------------------------------------------------------------------
-- 2. PRODUCT VARIANTS & SIZES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_id UUID NOT NULL REFERENCES public.sizes(id) ON DELETE RESTRICT,
    color_id UUID NOT NULL REFERENCES public.colors(id) ON DELETE RESTRICT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 2 CHECK (low_stock_threshold >= 0),
    price_override NUMERIC(12,3) CHECK (price_override IS NULL OR price_override >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (product_id, size_id, color_id)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_size ON public.product_variants(size_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_color ON public.product_variants(color_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

CREATE TABLE IF NOT EXISTS public.product_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_id UUID NOT NULL REFERENCES public.sizes(id) ON DELETE CASCADE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (product_id, size_id)
);

CREATE INDEX IF NOT EXISTS idx_product_sizes_prod ON public.product_sizes(product_id);

CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    focal_point_x NUMERIC(5,2) DEFAULT 50.0,
    focal_point_y NUMERIC(5,2) DEFAULT 50.0,
    crop_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_prod ON public.product_images(product_id);

-- -----------------------------------------------------------------------------
-- 3. COLLECTIONS & CAPSULES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    subtitle VARCHAR(255),
    description TEXT,
    story TEXT,
    hero_desktop_image TEXT NOT NULL,
    hero_mobile_image TEXT,
    is_capsule BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_is_published ON public.collections(is_published);

CREATE TABLE IF NOT EXISTS public.collection_products (
    collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

-- -----------------------------------------------------------------------------
-- 4. PRODUCT TAGS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_tag_links (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.product_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- -----------------------------------------------------------------------------
-- 5. SIZE GUIDES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.size_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    how_to_measure TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.size_guide_rows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    size_guide_id UUID NOT NULL REFERENCES public.size_guides(id) ON DELETE CASCADE,
    size_code VARCHAR(20) NOT NULL,
    chest_min_cm NUMERIC(5,1),
    chest_max_cm NUMERIC(5,1),
    waist_min_cm NUMERIC(5,1),
    waist_max_cm NUMERIC(5,1),
    hips_min_cm NUMERIC(5,1),
    hips_max_cm NUMERIC(5,1),
    display_order INT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 6. PRODUCT RECOMMENDATIONS ("COMPLÉTEZ VOTRE SILHOUETTE")
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    recommended_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CHECK (product_id <> recommended_product_id),
    UNIQUE (product_id, recommended_product_id)
);

CREATE INDEX IF NOT EXISTS idx_product_recommendations_src ON public.product_recommendations(product_id);

-- -----------------------------------------------------------------------------
-- 7. INVENTORY MOVEMENTS (AUDITABLE STOCK MOVEMENTS)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity_delta INT NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (
        reason IN ('sale', 'restock', 'manual_adjustment', 'return', 'exchange', 'correction', 'damaged')
    ),
    related_order_id UUID,
    related_return_id UUID,
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_inv_movements_variant ON public.inventory_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_inv_movements_reason ON public.inventory_movements(reason);
CREATE INDEX IF NOT EXISTS idx_inv_movements_created ON public.inventory_movements(created_at DESC);

-- -----------------------------------------------------------------------------
-- 8. MEDIA ASSETS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    width INT,
    height INT,
    public_url TEXT NOT NULL,
    bucket_name VARCHAR(100) NOT NULL DEFAULT 'media',
    alt_text VARCHAR(255),
    transform_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_bucket ON public.media(bucket_name);

-- -----------------------------------------------------------------------------
-- 9. HOMEPAGE CMS & CONTENT MANAGEMENT
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) NOT NULL UNIQUE CHECK (
        section_key IN ('hero', 'new_collection', 'philosophy', 'craftsmanship', 'about', 'final_cta')
    ),
    title VARCHAR(200),
    subtitle VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    desktop_image_url TEXT,
    mobile_image_url TEXT,
    focal_point_x NUMERIC(5,2) DEFAULT 50.0,
    focal_point_y NUMERIC(5,2) DEFAULT 50.0,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (section_id, content_key)
);
