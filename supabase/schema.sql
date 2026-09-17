-- =============================================================================
-- AÏLYS E-COMMERCE & ADMINISTRATION PLATFORM
-- PRODUCTION-READY SUPABASE DATABASE SCHEMA
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing tables if re-running migration
DROP TABLE IF EXISTS return_items CASCADE;
DROP TABLE IF EXISTS returns CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS promotions CASCADE;
DROP TABLE IF EXISTS homepage_content CASCADE;
DROP TABLE IF EXISTS homepage_sections CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS collection_products CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- -----------------------------------------------------------------------------
-- 1. ADMIN USERS & ROLES
-- -----------------------------------------------------------------------------
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- References Supabase auth.users(id) when auth is linked
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor', 'atelier')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. TAXONOMY: CATEGORIES, SIZES, COLORS
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'famille')),
    tagline VARCHAR(255),
    description TEXT,
    hero_image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'universel')),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hex VARCHAR(10) NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 3. COLLECTIONS & CAPSULES
-- -----------------------------------------------------------------------------
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    story TEXT,
    hero_desktop_image TEXT NOT NULL,
    hero_mobile_image TEXT,
    focal_point_x NUMERIC(5,2) DEFAULT 50.0,
    focal_point_y NUMERIC(5,2) DEFAULT 50.0,
    is_capsule BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. PRODUCTS & VARIANTS
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(10,2) CHECK (sale_price IS NULL OR sale_price < price),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    primary_collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    sub_category VARCHAR(100),
    materials TEXT,
    care TEXT,
    fit TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new BOOLEAN NOT NULL DEFAULT false,
    is_capsule BOOLEAN NOT NULL DEFAULT false,
    is_sold_out BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE collection_products (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
    color_id UUID REFERENCES colors(id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. PROMOTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('all', 'collection', 'product')),
    target_id UUID, -- Optional ID of targeted collection or product
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    banner_label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 6. ORDERS & ORDER ITEMS (Guest checkout, COD only)
-- -----------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    alt_phone VARCHAR(50),
    governorate VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    notes TEXT,
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'COD' CHECK (payment_method = 'COD'),
    status VARCHAR(30) NOT NULL DEFAULT 'nouveau' CHECK (
        status IN ('nouveau', 'confirme', 'en_preparation', 'en_livraison', 'livre', 'annule')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10,2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. RETURNS & RETURN ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(50) NOT NULL UNIQUE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    type VARCHAR(20) NOT NULL CHECK (type IN ('echange', 'retour')),
    reason VARCHAR(100) NOT NULL,
    comments TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'en_attente' CHECK (
        status IN ('en_attente', 'approuve', 'recu_inspecte', 'complete', 'refuse')
    ),
    tags_intact_confirmed BOOLEAN NOT NULL DEFAULT true,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    requested_exchange_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. HOMEPAGE SECTIONS & SECTION CONTENT (Visual Editor Backend)
-- -----------------------------------------------------------------------------
CREATE TABLE homepage_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(50) NOT NULL UNIQUE CHECK (
        section_key IN ('hero', 'new_collection', 'philosophy', 'craftsmanship', 'about', 'final_cta')
    ),
    title VARCHAR(200),
    subtitle VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
    content_key VARCHAR(100) NOT NULL,
    content_value TEXT,
    desktop_image_url TEXT,
    mobile_image_url TEXT,
    focal_point_x NUMERIC(5,2) DEFAULT 50.0,
    focal_point_y NUMERIC(5,2) DEFAULT 50.0,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (section_id, content_key)
);

-- -----------------------------------------------------------------------------
-- 9. MEDIA ASSETS
-- -----------------------------------------------------------------------------
CREATE TABLE media (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Helper function to determine if current caller is an authenticated admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE auth_user_id = auth.uid() AND is_active = true
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ for Storefront (Catalog, Navigation, Lookbooks, Homepage)
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view sizes" ON sizes FOR SELECT USING (true);
CREATE POLICY "Public can view colors" ON colors FOR SELECT USING (true);
CREATE POLICY "Public can view published collections" ON collections FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (is_published = true OR is_admin());
CREATE POLICY "Public can view collection products" ON collection_products FOR SELECT USING (true);
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can view available variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public can view active promotions" ON promotions FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public can view enabled homepage sections" ON homepage_sections FOR SELECT USING (is_enabled = true OR is_admin());
CREATE POLICY "Public can view homepage content" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Public can view media" ON media FOR SELECT USING (true);

-- Orders: Public Guest can INSERT; Guests can SELECT only their own order by order_code + phone
CREATE POLICY "Guests can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can create order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can lookup order by code and phone" ON orders FOR SELECT USING (
    is_admin() OR (order_code IS NOT NULL AND customer_phone IS NOT NULL)
);
CREATE POLICY "Guests can view items of viewed order" ON order_items FOR SELECT USING (
    is_admin() OR EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id
    )
);

-- Returns: Public Guest can INSERT; Guests can view their return by request_code
CREATE POLICY "Guests can create return requests" ON returns FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can create return items" ON return_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Guests can lookup return by request_code" ON returns FOR SELECT USING (
    is_admin() OR request_code IS NOT NULL
);
CREATE POLICY "Guests can view return items" ON return_items FOR SELECT USING (
    is_admin() OR EXISTS (
        SELECT 1 FROM returns WHERE returns.id = return_items.return_id
    )
);

-- Full Admin Management for All Tables
CREATE POLICY "Admins have full access to admin_users" ON admin_users FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to sizes" ON sizes FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to colors" ON colors FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to collections" ON collections FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to collection_products" ON collection_products FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to product_images" ON product_images FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to product_variants" ON product_variants FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to promotions" ON promotions FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to order_items" ON order_items FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to returns" ON returns FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to return_items" ON return_items FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to homepage_sections" ON homepage_sections FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to homepage_content" ON homepage_content FOR ALL USING (is_admin());
CREATE POLICY "Admins have full access to media" ON media FOR ALL USING (is_admin());

-- -----------------------------------------------------------------------------
-- 11. AUTOMATIC ORDER CODE & RETURN CODE TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_order_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_code IS NULL OR NEW.order_code = '' THEN
        NEW.order_code := 'AILYS-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_order_code
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_code();

CREATE OR REPLACE FUNCTION set_return_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.request_code IS NULL OR NEW.request_code = '' THEN
        NEW.request_code := 'RET-' || lpad(floor(random() * 900000 + 100000)::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_return_code
BEFORE INSERT ON returns
FOR EACH ROW
EXECUTE FUNCTION set_return_code();

-- -----------------------------------------------------------------------------
-- 12. STORAGE BUCKETS CONFIGURATION (Supabase Storage)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('media', 'media', true),
    ('products', 'products', true),
    ('campaign', 'campaign', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read storage assets
CREATE POLICY "Public Access Media Bucket" ON storage.objects
FOR SELECT USING (bucket_id IN ('media', 'products', 'campaign'));

-- Only admins can upload, update, delete storage assets
CREATE POLICY "Admins Upload Objects" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('media', 'products', 'campaign') AND (is_admin() OR auth.role() = 'service_role'));

CREATE POLICY "Admins Update Objects" ON storage.objects
FOR UPDATE USING (bucket_id IN ('media', 'products', 'campaign') AND (is_admin() OR auth.role() = 'service_role'));

CREATE POLICY "Admins Delete Objects" ON storage.objects
FOR DELETE USING (bucket_id IN ('media', 'products', 'campaign') AND (is_admin() OR auth.role() = 'service_role'));
