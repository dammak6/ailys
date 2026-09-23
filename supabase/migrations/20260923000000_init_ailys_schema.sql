-- =============================================================================
-- AÏLYS MAISON DE CONFECTION — PRODUCTION DATABASE SCHEMA
-- Dialect: PostgreSQL (14+)
-- File: supabase/migrations/20260923000000_init_ailys_schema.sql
-- =============================================================================

-- Enable standard UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. ACCESS CONTROL & RBAC (EXTENSIBLE, STRICTLY 2 ROLES INITIALIZED)
-- =============================================================================

-- Roles table: Extensible, currently initialized with ADMIN and SUPER_ADMIN
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('SUPER_ADMIN', 'ADMIN')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Granular permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Join table: Role <-> Permissions
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Admin users (Internal staff and super administrators)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON admin_users(role_id);

-- =============================================================================
-- 2. CUSTOMERS & ADDRESS BOOK (GUEST & REGISTERED IDENTITIES)
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    notes TEXT,
    total_orders_count INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    governorate VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);

-- =============================================================================
-- 3. TAXONOMY: CATEGORIES, SIZES, COLORS & SIZE GUIDES
-- =============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'famille', 'universel')),
    tagline VARCHAR(255),
    description TEXT,
    hero_image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

CREATE TABLE IF NOT EXISTS sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'universel')),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hex VARCHAR(10) NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS size_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    measurements_table JSONB NOT NULL DEFAULT '[]'::jsonb,
    how_to_measure TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 4. COLLECTIONS & CAPSULES
-- =============================================================================

CREATE TABLE IF NOT EXISTS collections (
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

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_published ON collections(is_published);

-- =============================================================================
-- 5. PRODUCTS, VARIANTS, PRODUCT SIZES & IMAGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
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

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(primary_collection_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published);

-- Join table: Collections <-> Products (Products can belong to multiple collections)
CREATE TABLE IF NOT EXISTS collection_products (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    display_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, product_id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Product Available Sizes mapping
CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID NOT NULL REFERENCES sizes(id) ON DELETE CASCADE,
    is_available BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (product_id, size_id)
);

CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);

-- SKU and Variant Matrix (Product x Size x Color with precise stock levels)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_id UUID REFERENCES sizes(id) ON DELETE SET NULL,
    color_id UUID REFERENCES colors(id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 10 CHECK (stock_quantity >= 0),
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- =============================================================================
-- 6. PROMOTIONS & VOUCHERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    applies_to VARCHAR(20) NOT NULL CHECK (applies_to IN ('all', 'collection', 'product')),
    target_id UUID,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    banner_label VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);

-- =============================================================================
-- 7. ORDERS, ORDER ITEMS & STATUS AUDIT TRAIL
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
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
    payment_method VARCHAR(20) NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD', 'CARD', 'VIREMENT')),
    status VARCHAR(30) NOT NULL DEFAULT 'nouveau' CHECK (
        status IN ('nouveau', 'confirme', 'en_preparation', 'en_livraison', 'livre', 'annule')
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
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

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Order Status History (Audit trail for fulfillment and state transitions)
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- =============================================================================
-- 8. RETURNS & EXCHANGES
-- =============================================================================

CREATE TABLE IF NOT EXISTS returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(50) NOT NULL UNIQUE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
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

CREATE INDEX IF NOT EXISTS idx_returns_request_code ON returns(request_code);
CREATE INDEX IF NOT EXISTS idx_returns_order_code ON returns(order_code);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);

CREATE TABLE IF NOT EXISTS return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    requested_exchange_size VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_return_items_return_id ON return_items(return_id);

-- =============================================================================
-- 9. HOMEPAGE CMS & CONTENT MANAGEMENT
-- =============================================================================

CREATE TABLE IF NOT EXISTS homepage_sections (
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

CREATE TABLE IF NOT EXISTS homepage_content (
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

-- =============================================================================
-- 10. MEDIA ASSETS
-- =============================================================================

CREATE TABLE IF NOT EXISTS media (
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

-- =============================================================================
-- 11. AUTOMATIC SEQUENCE TRIGGERS (AILYS ORDER & RETURN CODES)
-- =============================================================================

CREATE OR REPLACE FUNCTION set_order_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_code IS NULL OR NEW.order_code = '' THEN
        NEW.order_code := 'AILYS-' || to_char(now(), 'YYMM') || '-' || lpad(floor(random() * 10000)::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_order_code ON orders;
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

DROP TRIGGER IF EXISTS trg_set_return_code ON returns;
CREATE TRIGGER trg_set_return_code
BEFORE INSERT ON returns
FOR EACH ROW
EXECUTE FUNCTION set_return_code();

-- =============================================================================
-- 12. SEED INITIAL ROLES & PERMISSIONS (EXACTLY SUPER_ADMIN & ADMIN)
-- =============================================================================

-- Insert the 2 required roles
INSERT INTO roles (name, description)
VALUES 
    ('SUPER_ADMIN', 'Full unrestricted access to system, analytics, administration, settings, and all operations.'),
    ('ADMIN', 'Operational access restricted to Orders, Products, Returns & Exchanges. Strictly blocked from analytics, settings, and administration.')
ON CONFLICT (name) DO NOTHING;

-- Insert granular permissions
INSERT INTO permissions (code, category, description)
VALUES
    -- Operational permissions (allowed for both SUPER_ADMIN and ADMIN)
    ('products:read', 'products', 'View products and catalog items'),
    ('products:write', 'products', 'Create, update, and manage products'),
    ('orders:read', 'orders', 'View customer orders and fulfillment details'),
    ('orders:write', 'orders', 'Update order statuses and fulfillment notes'),
    ('returns:read', 'returns', 'View returns and exchanges'),
    ('returns:write', 'returns', 'Process, approve, or reject returns and exchanges'),
    ('media:manage', 'media', 'Upload and manage media gallery assets'),
    ('homepage:manage', 'homepage', 'Edit homepage visual sections'),
    -- Privileged permissions (strictly reserved for SUPER_ADMIN)
    ('analytics:read', 'analytics', 'Access revenue metrics, KPIs, and dashboard statistics'),
    ('admins:manage', 'admins', 'Manage administrative accounts, passwords, and roles'),
    ('settings:manage', 'settings', 'Manage global platform configuration and operational settings'),
    ('system:manage', 'system', 'System-level maintenance and database configuration')
ON CONFLICT (code) DO NOTHING;

-- Assign ALL permissions to SUPER_ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign ONLY operational permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
AND p.code IN (
    'products:read',
    'products:write',
    'orders:read',
    'orders:write',
    'returns:read',
    'returns:write',
    'media:manage',
    'homepage:manage'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;
