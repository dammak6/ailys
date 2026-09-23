-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 01 - CORE SECURITY, RBAC & TAXONOMY
-- Project: ailys (kafyatqatggifedqtctm)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- -----------------------------------------------------------------------------
-- 1. SECURITY & RBAC
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('SUPER_ADMIN', 'ADMIN')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    must_change_password BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON public.admin_users(role_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON public.admin_users(auth_user_id);

-- -----------------------------------------------------------------------------
-- 2. AUDIT LOGS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    actor_role VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    before_state JSONB,
    after_state JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. RBAC HELPER FUNCTIONS (SECURITY DEFINER)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_admin_profile()
RETURNS TABLE (
    admin_id UUID,
    email VARCHAR(255),
    full_name VARCHAR(255),
    role_name VARCHAR(50),
    is_active BOOLEAN
) 
LANGUAGE sql 
SECURITY DEFINER 
SET search_path = public, auth, pg_temp
STABLE
AS $$
    SELECT 
        a.id AS admin_id,
        a.email,
        a.full_name,
        r.name AS role_name,
        a.is_active
    FROM public.admin_users a
    JOIN public.roles r ON a.role_id = r.id
    WHERE a.auth_user_id = auth.uid()
      AND a.is_active = true;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_users a
        JOIN public.roles r ON a.role_id = r.id
        WHERE a.auth_user_id = auth.uid()
          AND a.is_active = true
          AND r.name IN ('ADMIN', 'SUPER_ADMIN')
    );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.admin_users a
        JOIN public.roles r ON a.role_id = r.id
        WHERE a.auth_user_id = auth.uid()
          AND a.is_active = true
          AND r.name = 'SUPER_ADMIN'
    );
$$;

-- -----------------------------------------------------------------------------
-- 4. TAXONOMY: CATEGORIES, SIZES, COLORS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'famille', 'universel')),
    tagline VARCHAR(255),
    description TEXT,
    hero_image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);

CREATE TABLE IF NOT EXISTS public.sizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('femme', 'homme', 'enfant', 'universel')),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    hex VARCHAR(10) NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 5. SITE SETTINGS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- -----------------------------------------------------------------------------
-- 6. SEED INITIAL ROLES, PERMISSIONS & CORE TAXONOMY
-- -----------------------------------------------------------------------------

INSERT INTO public.roles (name, description)
VALUES 
    ('SUPER_ADMIN', 'Full system access: financial analytics, revenue, admin management, restricted settings, database operations.'),
    ('ADMIN', 'Operational access: orders, catalog, returns, restock, media, operational customer records.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.permissions (code, category, description)
VALUES
    ('products:read', 'catalog', 'View products and catalog items'),
    ('products:write', 'catalog', 'Create, update, and manage products and variants'),
    ('inventory:manage', 'inventory', 'Adjust inventory quantities and audit stock movements'),
    ('orders:read', 'orders', 'View customer orders and fulfillment details'),
    ('orders:edit', 'orders', 'Edit order delivery details and line items before shipment'),
    ('orders:status', 'orders', 'Advance order fulfillment status'),
    ('returns:manage', 'returns', 'Process customer returns and inspect items'),
    ('restock:manage', 'restock', 'Review customer restock requests and atelier queues'),
    ('promotions:manage', 'promotions', 'Create and toggle promotion discount codes'),
    ('homepage:manage', 'content', 'Update visual sections, copy, and crops'),
    ('media:manage', 'media', 'Upload packshots, campaign assets, and editorial photography'),
    ('analytics:view', 'security', 'Access revenue figures, financial dashboards, and margin metrics'),
    ('admins:manage', 'security', 'Create, update, and deactivate administrative accounts'),
    ('settings:manage', 'security', 'Configure platform shipping parameters and system settings')
ON CONFLICT (code) DO NOTHING;

-- Map ALL permissions to SUPER_ADMIN
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- Map ONLY operational permissions to ADMIN
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'ADMIN'
  AND p.code IN (
      'products:read', 'products:write', 'inventory:manage',
      'orders:read', 'orders:edit', 'orders:status',
      'returns:manage', 'restock:manage', 'promotions:manage',
      'homepage:manage', 'media:manage'
  )
ON CONFLICT DO NOTHING;

-- Insert primary categories
INSERT INTO public.categories (slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES
    ('femme', 'Femme', 'femme', 'L''allure sport-chic au féminin', 'Des tailleurs déstructurés en lin lavé aux robes fluides coupées pour la liberté de mouvement.', '/images/campaign/hero-editorial-woman.jpg', 1),
    ('homme', 'Homme', 'homme', 'Coupes épurées & matières nobles', 'L''équilibre précis entre confection tailleur et aisance sportive.', '/images/campaign/man-sport-chic.jpg', 2),
    ('enfant', 'Enfant', 'enfant', 'L''élégance familiale partagée', 'Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes.', '/images/campaign/girl-sport-chic.jpg', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert standard sizes
INSERT INTO public.sizes (code, name, gender, display_order)
VALUES
    ('F-36', '36 (XS)', 'femme', 1),
    ('F-38', '38 (S)', 'femme', 2),
    ('F-40', '40 (M)', 'femme', 3),
    ('F-42', '42 (L)', 'femme', 4),
    ('F-44', '44 (XL)', 'femme', 5),
    ('H-S', 'S', 'homme', 6),
    ('H-M', 'M', 'homme', 7),
    ('H-L', 'L', 'homme', 8),
    ('H-XL', 'XL', 'homme', 9),
    ('H-XXL', 'XXL', 'homme', 10),
    ('E-4A', '4 ans', 'enfant', 11),
    ('E-6A', '6 ans', 'enfant', 12),
    ('E-8A', '8 ans', 'enfant', 13),
    ('E-10A', '10 ans', 'enfant', 14)
ON CONFLICT (code) DO NOTHING;

-- Insert core colors
INSERT INTO public.colors (name, hex, display_order)
VALUES
    ('Blanc Os', '#F5F3EC', 1),
    ('Noir Ébène', '#0B0B0B', 2),
    ('Indigo Brut', '#1C2833', 3),
    ('Or AÏLYS', '#B79A5B', 4),
    ('Bleu Nuit', '#1A2536', 5),
    ('Vert Kaki', '#555A48', 6),
    ('Blanc Craie', '#ECE8DF', 7),
    ('Gris Anthracite', '#333333', 8),
    ('Grenat Atelier', '#4A1521', 9)
ON CONFLICT (name) DO NOTHING;

-- Insert standard site settings
INSERT INTO public.site_settings (key, value, is_public, description)
VALUES
    ('brand_info', '{"name": "AÏLYS", "tagline": "Maison de Confection Contemporaine Tunisienne", "atelierAddress": "Sfax, Tunisie"}'::jsonb, true, 'Brand identification'),
    ('contact_info', '{"phone": "+216 70 000 000", "whatsapp": "+216 98 000 000", "email": "concierge@ailys.tn"}'::jsonb, true, 'Customer concierge channels'),
    ('shipping_rules', '{"freeShippingThreshold": 200, "standardShippingFee": 7, "currency": "TND", "delayTunis": "24h - 48h", "delayRegions": "24h - 48h"}'::jsonb, true, 'Shipping fee calculation parameters'),
    ('announcement_bar', '{"active": true, "message": "Livraison 24h - 48h partout en Tunisie • Expédié depuis Sfax • Paiement à la livraison"}'::jsonb, true, 'Header alert banner')
ON CONFLICT (key) DO NOTHING;
