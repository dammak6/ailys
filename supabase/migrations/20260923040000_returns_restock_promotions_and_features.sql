-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 04 - RETURNS, RESTOCK, PROMOTIONS & DOCUMENTS
-- Project: ailys (kafyatqatggifedqtctm)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. RETURNS & EXCHANGES
-- -----------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.return_number_seq START WITH 100001;

CREATE OR REPLACE FUNCTION public.generate_return_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    seq_val INT;
    candidate_code TEXT;
    collision_check BOOLEAN;
BEGIN
    LOOP
        seq_val := nextval('public.return_number_seq');
        candidate_code := 'RET-' || lpad((seq_val % 1000000)::text, 6, '0');
        
        SELECT EXISTS (SELECT 1 FROM public.returns WHERE request_code = candidate_code)
        INTO collision_check;
        
        IF NOT collision_check THEN
            RETURN candidate_code;
        END IF;
    END LOOP;
END;
$$;

CREATE TABLE IF NOT EXISTS public.returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_code VARCHAR(50) NOT NULL UNIQUE DEFAULT public.generate_return_code(),
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    order_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    type VARCHAR(20) NOT NULL CHECK (type IN ('retour', 'echange')),
    reason VARCHAR(100) NOT NULL,
    comments TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'en_attente' CHECK (
        status IN ('en_attente', 'approuve', 'recu', 'complete', 'refuse')
    ),
    tags_intact_confirmed BOOLEAN NOT NULL DEFAULT true,
    inspection_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_returns_req_code ON public.returns(request_code);
CREATE INDEX IF NOT EXISTS idx_returns_order_code ON public.returns(order_code);
CREATE INDEX IF NOT EXISTS idx_returns_phone ON public.returns(customer_phone);
CREATE INDEX IF NOT EXISTS idx_returns_status ON public.returns(status);

CREATE TABLE IF NOT EXISTS public.return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES public.order_items(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    requested_exchange_size VARCHAR(50),
    requested_exchange_color VARCHAR(50),
    condition_status VARCHAR(50) DEFAULT 'uninspected',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_return_items_ret ON public.return_items(return_id);

CREATE TABLE IF NOT EXISTS public.return_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID NOT NULL REFERENCES public.returns(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ret_stat_hist_ret ON public.return_status_history(return_id);

-- -----------------------------------------------------------------------------
-- 2. RESTOCK REQUESTS (ATELIER DEMAND AGGREGATION)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.restock_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    size_id UUID REFERENCES public.sizes(id) ON DELETE SET NULL,
    color_id UUID REFERENCES public.colors(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    size_name VARCHAR(50),
    color_name VARCHAR(50),
    contact_info VARCHAR(255) NOT NULL,
    contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('phone', 'email')),
    preferred_channel VARCHAR(20) NOT NULL DEFAULT 'phone' CHECK (preferred_channel IN ('phone', 'email', 'whatsapp')),
    status VARCHAR(30) NOT NULL DEFAULT 'en_attente' CHECK (
        status IN ('en_attente', 'notifie', 'traite', 'annule')
    ),
    notified_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_restock_prod ON public.restock_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_restock_variant ON public.restock_requests(variant_id);
CREATE INDEX IF NOT EXISTS idx_restock_status ON public.restock_requests(status);
CREATE INDEX IF NOT EXISTS idx_restock_contact ON public.restock_requests(contact_info);

-- -----------------------------------------------------------------------------
-- 3. PROMOTIONS & VOUCHERS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(12,3) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(12,3) DEFAULT 0.000 CHECK (min_order_amount >= 0),
    max_discount_amount NUMERIC(12,3),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    usage_limit INT,
    per_customer_limit INT DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_promotions_code ON public.promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON public.promotions(is_active);

CREATE TABLE IF NOT EXISTS public.promotion_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    discount_applied NUMERIC(12,3) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_promo_usages_promo ON public.promotion_usages(promotion_id);
CREATE INDEX IF NOT EXISTS idx_promo_usages_order ON public.promotion_usages(order_id);

-- -----------------------------------------------------------------------------
-- 4. WISHLISTS & WISHLIST ITEMS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    guest_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size_id UUID REFERENCES public.sizes(id) ON DELETE SET NULL,
    color_id UUID REFERENCES public.colors(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (wishlist_id, product_id, size_id, color_id)
);

-- -----------------------------------------------------------------------------
-- 5. NOTIFICATIONS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient VARCHAR(255) NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('phone', 'email', 'whatsapp')),
    template_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);

-- -----------------------------------------------------------------------------
-- 6. ORDER DOCUMENTS & INVOICES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    document_type VARCHAR(30) NOT NULL CHECK (
        document_type IN ('invoice', 'delivery_slip', 'cod_receipt')
    ),
    document_number VARCHAR(100) NOT NULL UNIQUE,
    storage_path TEXT,
    is_finalized BOOLEAN NOT NULL DEFAULT false,
    generated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    finalized_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_order_docs_order ON public.order_documents(order_id);
CREATE INDEX IF NOT EXISTS idx_order_docs_num ON public.order_documents(document_number);
