-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 05 - STORAGE, RLS POLICIES & EXECUTIVE ANALYTICS
-- Project: ailys (kafyatqatggifedqtctm)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. STORAGE BUCKETS CONFIGURATION
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('products', 'products', true),
    ('campaign', 'campaign', true),
    ('media', 'media', true),
    ('invoices', 'invoices', false)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Storage RLS Policies
CREATE POLICY "Public Read Public Storage Buckets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('products', 'campaign', 'media'));

CREATE POLICY "Admins Read Private Invoices"
ON storage.objects FOR SELECT
USING (bucket_id = 'invoices' AND public.is_admin());

CREATE POLICY "Admins Manage All Storage Buckets"
ON storage.objects FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- -----------------------------------------------------------------------------

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_interactions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_tag_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guide_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_edit_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_status_history ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.restock_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_documents ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 3. STOREFRONT PUBLIC READ POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Public Read Sizes" ON public.sizes FOR SELECT USING (true);
CREATE POLICY "Public Read Colors" ON public.colors FOR SELECT USING (true);

CREATE POLICY "Public Read Products" ON public.products FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public Read Product Variants" ON public.product_variants FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Public Read Product Sizes" ON public.product_sizes FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Public Read Collections" ON public.collections FOR SELECT
USING (is_published = true OR public.is_admin());

CREATE POLICY "Public Read Collection Products" ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Tags" ON public.product_tags FOR SELECT USING (true);
CREATE POLICY "Public Read Product Tag Links" ON public.product_tag_links FOR SELECT USING (true);

CREATE POLICY "Public Read Size Guides" ON public.size_guides FOR SELECT USING (true);
CREATE POLICY "Public Read Size Guide Rows" ON public.size_guide_rows FOR SELECT USING (true);

CREATE POLICY "Public Read Recommendations" ON public.product_recommendations FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Public Read Homepage Sections" ON public.homepage_sections FOR SELECT
USING (is_enabled = true OR public.is_admin());

CREATE POLICY "Public Read Homepage Content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Public Read Media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Public Read Delivery Zones" ON public.delivery_zones FOR SELECT USING (is_active = true);

CREATE POLICY "Public Read Active Promotions" ON public.promotions FOR SELECT
USING (is_active = true OR public.is_admin());

CREATE POLICY "Public Read Public Site Settings" ON public.site_settings FOR SELECT
USING (is_public = true OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. PUBLIC INTERACTIONS: RESTOCK & WISHLIST
-- -----------------------------------------------------------------------------

CREATE POLICY "Public Insert Restock Requests" ON public.restock_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public Manage Guest Wishlists" ON public.wishlists FOR ALL
USING (guest_token IS NOT NULL OR public.is_admin())
WITH CHECK (guest_token IS NOT NULL OR public.is_admin());

CREATE POLICY "Public Manage Guest Wishlist Items" ON public.wishlist_items FOR ALL
USING (EXISTS (SELECT 1 FROM public.wishlists w WHERE w.id = wishlist_items.wishlist_id AND w.guest_token IS NOT NULL) OR public.is_admin())
WITH CHECK (EXISTS (SELECT 1 FROM public.wishlists w WHERE w.id = wishlist_items.wishlist_id AND w.guest_token IS NOT NULL) OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. ADMIN / SUPER ADMIN OPERATIONAL ACCESS POLICIES
-- -----------------------------------------------------------------------------

-- Operational management (Allowed for both ADMIN and SUPER_ADMIN)
CREATE POLICY "Admins Manage Categories" ON public.categories FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Sizes" ON public.sizes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Colors" ON public.colors FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Products" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Variants" ON public.product_variants FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Product Sizes" ON public.product_sizes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Product Images" ON public.product_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Collections" ON public.collections FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Collection Products" ON public.collection_products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Product Tags" ON public.product_tags FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Product Tag Links" ON public.product_tag_links FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Size Guides" ON public.size_guides FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Size Guide Rows" ON public.size_guide_rows FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Recommendations" ON public.product_recommendations FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins View Customers" ON public.customers FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins View Addresses" ON public.customer_addresses FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins Manage Interactions" ON public.customer_interactions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins Manage Orders" ON public.orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Order Items" ON public.order_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Order Status History" ON public.order_status_history FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Order Edit History" ON public.order_edit_history FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins Manage Returns" ON public.returns FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Return Items" ON public.return_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Return Status History" ON public.return_status_history FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins Manage Restock" ON public.restock_requests FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Promotions" ON public.promotions FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins View Promotion Usages" ON public.promotion_usages FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins Manage Media" ON public.media FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Homepage Sections" ON public.homepage_sections FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Homepage Content" ON public.homepage_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Order Documents" ON public.order_documents FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins Manage Inventory Movements" ON public.inventory_movements FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins View Notifications" ON public.notifications FOR SELECT USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. STRICT SUPER ADMIN ACCESS ONLY POLICIES
-- -----------------------------------------------------------------------------

CREATE POLICY "Super Admins Manage Roles" ON public.roles FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super Admins Manage Permissions" ON public.permissions FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super Admins Manage Role Permissions" ON public.role_permissions FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super Admins Manage Admin Users" ON public.admin_users FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super Admins View Audit Logs" ON public.audit_logs FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super Admins Manage Site Settings" ON public.site_settings FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "Super Admins Manage Delivery Zones" ON public.delivery_zones FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- -----------------------------------------------------------------------------
-- 7. SECURE PUBLIC ORDER TRACKING RPC (MINIMUM PRIVILEGE)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.track_order(p_order_code TEXT, p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_norm_phone TEXT;
    v_order RECORD;
    v_items JSONB;
BEGIN
    v_norm_phone := public.normalize_tunisian_phone(p_phone);
    IF v_norm_phone IS NULL OR p_order_code IS NULL THEN
        RETURN jsonb_build_object('found', false, 'error', 'Code ou téléphone manquant');
    END IF;

    -- Lookup order strictly matching order_code AND normalized customer_phone
    SELECT o.id, o.order_code, o.status, o.governorate, o.city, o.total, o.shipping_fee, o.created_at
    INTO v_order
    FROM public.orders o
    WHERE UPPER(TRIM(o.order_code)) = UPPER(TRIM(p_order_code))
      AND (
          public.normalize_tunisian_phone(o.customer_phone) = v_norm_phone
          OR public.normalize_tunisian_phone(o.alt_phone) = v_norm_phone
      );

    IF NOT FOUND THEN
        RETURN jsonb_build_object('found', false, 'error', 'Commande introuvable avec ces coordonnées');
    END IF;

    -- Retrieve safe line item information (no private supplier/cost info)
    SELECT jsonb_agg(
        jsonb_build_object(
            'productName', oi.product_name,
            'size', oi.size,
            'color', oi.color,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'totalPrice', oi.total_price,
            'imageUrl', oi.image_url
        )
    )
    INTO v_items
    FROM public.order_items oi
    WHERE oi.order_id = v_order.id;

    RETURN jsonb_build_object(
        'found', true,
        'orderCode', v_order.order_code,
        'status', v_order.status,
        'governorate', v_order.governorate,
        'city', v_order.city,
        'total', v_order.total,
        'shippingFee', v_order.shipping_fee,
        'createdAt', v_order.created_at,
        'items', COALESCE(v_items, '[]'::jsonb)
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- 8. SECURE PUBLIC RETURN SUBMISSION RPC
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_return_request(
    p_order_code TEXT,
    p_phone TEXT,
    p_type TEXT,
    p_reason TEXT,
    p_items JSONB,
    p_comments TEXT DEFAULT NULL,
    p_tags_intact BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_norm_phone TEXT;
    v_order RECORD;
    v_return_id UUID;
    v_request_code TEXT;
    v_item RECORD;
BEGIN
    v_norm_phone := public.normalize_tunisian_phone(p_phone);
    IF v_norm_phone IS NULL OR p_order_code IS NULL THEN
        RAISE EXCEPTION 'Code de commande et téléphone obligatoires';
    END IF;

    IF p_tags_intact IS NOT TRUE THEN
        RAISE EXCEPTION 'Les articles doivent avoir leurs étiquettes d''origine intactes';
    END IF;

    -- Lookup verified order
    SELECT o.id, o.order_code, o.customer_name, o.customer_email, o.customer_phone
    INTO v_order
    FROM public.orders o
    WHERE UPPER(TRIM(o.order_code)) = UPPER(TRIM(p_order_code))
      AND (
          public.normalize_tunisian_phone(o.customer_phone) = v_norm_phone
          OR public.normalize_tunisian_phone(o.alt_phone) = v_norm_phone
      );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Commande introuvable avec ces coordonnées';
    END IF;

    v_request_code := public.generate_return_code();

    INSERT INTO public.returns (
        request_code, order_id, order_code, customer_name, customer_phone, customer_email,
        type, reason, comments, tags_intact_confirmed, status
    ) VALUES (
        v_request_code, v_order.id, v_order.order_code, v_order.customer_name, v_order.customer_phone, v_order.customer_email,
        COALESCE(p_type, 'retour'), p_reason, p_comments, true, 'en_attente'
    ) RETURNING id INTO v_return_id;

    -- Insert return items
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
        product_name TEXT,
        quantity INT,
        requested_exchange_size TEXT,
        requested_exchange_color TEXT
    ) LOOP
        INSERT INTO public.return_items (
            return_id, product_name, quantity, requested_exchange_size, requested_exchange_color
        ) VALUES (
            v_return_id, v_item.product_name, COALESCE(v_item.quantity, 1),
            v_item.requested_exchange_size, v_item.requested_exchange_color
        );
    END LOOP;

    INSERT INTO public.return_status_history (return_id, previous_status, new_status, actor_role, note)
    VALUES (v_return_id, NULL, 'en_attente', 'CUSTOMER', 'Demande de ' || p_type || ' initiée en ligne');

    RETURN jsonb_build_object(
        'success', true,
        'returnId', v_return_id,
        'requestCode', v_request_code
    );
END;
$$;

-- -----------------------------------------------------------------------------
-- 9. EXECUTIVE ANALYTICS RPC (SUPER ADMIN ONLY)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_executive_analytics()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_total_revenue NUMERIC(12,3);
    v_total_orders INT;
    v_avg_order_value NUMERIC(12,3);
    v_orders_by_status JSONB;
    v_orders_by_gov JSONB;
    v_pending_returns INT;
    v_pending_restock INT;
    v_sold_out_count INT;
BEGIN
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Accès refusé. Privilèges SUPER_ADMIN requis.';
    END IF;

    SELECT COALESCE(SUM(total), 0.000), COUNT(*)
    INTO v_total_revenue, v_total_orders
    FROM public.orders
    WHERE status <> 'annule';

    IF v_total_orders > 0 THEN
        v_avg_order_value := v_total_revenue / v_total_orders;
    ELSE
        v_avg_order_value := 0.000;
    END IF;

    SELECT jsonb_object_agg(status, count)
    INTO v_orders_by_status
    FROM (
        SELECT status, count(*) AS count
        FROM public.orders
        GROUP BY status
    ) s;

    SELECT jsonb_object_agg(governorate, count)
    INTO v_orders_by_gov
    FROM (
        SELECT governorate, count(*) AS count
        FROM public.orders
        GROUP BY governorate
    ) g;

    SELECT count(*) INTO v_pending_returns
    FROM public.returns
    WHERE status = 'en_attente';

    SELECT count(*) INTO v_pending_restock
    FROM public.restock_requests
    WHERE status = 'en_attente';

    SELECT count(*) INTO v_sold_out_count
    FROM public.products p
    WHERE p.is_sold_out_manual_override = true
       OR NOT EXISTS (
           SELECT 1 FROM public.product_variants pv
           WHERE pv.product_id = p.id AND pv.stock_quantity > 0 AND pv.is_active = true
       );

    RETURN jsonb_build_object(
        'totalRevenue', v_total_revenue,
        'totalOrders', v_total_orders,
        'averageOrderValue', v_avg_order_value,
        'ordersByStatus', COALESCE(v_orders_by_status, '{}'::jsonb),
        'ordersByGovernorate', COALESCE(v_orders_by_gov, '{}'::jsonb),
        'pendingReturns', v_pending_returns,
        'pendingRestock', v_pending_restock,
        'soldOutProducts', v_sold_out_count
    );
END;
$$;
