-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 03 - CUSTOMERS, ORDERS & TRANSACTIONAL CHECKOUT
-- Project: ailys (kafyatqatggifedqtctm)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. PHONE NORMALIZATION FUNCTION (TUNISIAN +216 STANDARD)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.normalize_tunisian_phone(phone_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    cleaned TEXT;
BEGIN
    IF phone_input IS NULL OR TRIM(phone_input) = '' THEN
        RETURN NULL;
    END IF;

    -- Strip non-digit characters except leading plus
    cleaned := regexp_replace(phone_input, '[^0-9+]', '', 'g');

    -- Remove international prefix variations
    IF cleaned LIKE '+216%' THEN
        cleaned := substring(cleaned from 5);
    ELSIF cleaned LIKE '00216%' THEN
        cleaned := substring(cleaned from 6);
    ELSIF cleaned LIKE '216%' AND length(cleaned) = 11 THEN
        cleaned := substring(cleaned from 4);
    END IF;

    -- If 8 digits remain (standard Tunisian phone), return +216XXXXXXXX
    IF length(cleaned) = 8 THEN
        RETURN '+216' || cleaned;
    END IF;

    -- Fallback: return cleaned value with plus if present
    RETURN cleaned;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. CUSTOMERS & ADDRESSES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    normalized_phone VARCHAR(50) NOT NULL UNIQUE,
    notes TEXT,
    total_orders_count INT NOT NULL DEFAULT 0,
    total_spent NUMERIC(12,3) NOT NULL DEFAULT 0.000,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(normalized_phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    governorate VARCHAR(100) NOT NULL,
    delivery_notes TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cust_addr_cust ON public.customer_addresses(customer_id);

CREATE TABLE IF NOT EXISTS public.customer_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('phone', 'whatsapp', 'email', 'internal_note')),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cust_inter_cust ON public.customer_interactions(customer_id);

-- -----------------------------------------------------------------------------
-- 3. DELIVERY ZONES (24 TUNISIAN GOVERNORATES)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    governorate VARCHAR(100) NOT NULL UNIQUE,
    delivery_fee NUMERIC(12,3) NOT NULL DEFAULT 7.000 CHECK (delivery_fee >= 0),
    min_estimated_hours INT NOT NULL DEFAULT 24,
    max_estimated_hours INT NOT NULL DEFAULT 48,
    is_active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.delivery_zones (governorate, delivery_fee, min_estimated_hours, max_estimated_hours)
VALUES
    ('Tunis', 7.000, 24, 48),
    ('Ariana', 7.000, 24, 48),
    ('Ben Arous', 7.000, 24, 48),
    ('Manouba', 7.000, 24, 48),
    ('Nabeul', 7.000, 24, 48),
    ('Zaghouan', 7.000, 24, 48),
    ('Bizerte', 7.000, 24, 48),
    ('Béja', 7.000, 24, 48),
    ('Jendouba', 7.000, 24, 48),
    ('Le Kef', 7.000, 24, 48),
    ('Siliana', 7.000, 24, 48),
    ('Sousse', 7.000, 24, 48),
    ('Monastir', 7.000, 24, 48),
    ('Mahdia', 7.000, 24, 48),
    ('Sfax', 7.000, 24, 48),
    ('Kairouan', 7.000, 24, 48),
    ('Kasserine', 7.000, 24, 48),
    ('Sidi Bouzid', 7.000, 24, 48),
    ('Gabès', 7.000, 24, 48),
    ('Médenine', 7.000, 24, 48),
    ('Tataouine', 7.000, 24, 48),
    ('Gafsa', 7.000, 24, 48),
    ('Tozeur', 7.000, 24, 48),
    ('Kébili', 7.000, 24, 48)
ON CONFLICT (governorate) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. COLLISION-SAFE ORDER NUMBERING (AILYS-YYMM-XXXX)
-- -----------------------------------------------------------------------------

CREATE SEQUENCE IF NOT EXISTS public.order_number_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_order_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    date_prefix TEXT;
    seq_val INT;
    candidate_code TEXT;
    collision_check BOOLEAN;
BEGIN
    date_prefix := 'AILYS-' || to_char(now(), 'YYMM') || '-';
    LOOP
        seq_val := nextval('public.order_number_seq');
        candidate_code := date_prefix || lpad((seq_val % 10000)::text, 4, '0');
        
        SELECT EXISTS (SELECT 1 FROM public.orders WHERE order_code = candidate_code)
        INTO collision_check;
        
        IF NOT collision_check THEN
            RETURN candidate_code;
        END IF;
    END LOOP;
END;
$$;

-- -----------------------------------------------------------------------------
-- 5. ORDERS & LINE ITEMS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(50) NOT NULL UNIQUE DEFAULT public.generate_order_code(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50) NOT NULL,
    alt_phone VARCHAR(50),
    governorate VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    delivery_notes TEXT,
    courier_notes TEXT,
    subtotal NUMERIC(12,3) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(12,3) NOT NULL DEFAULT 7.000 CHECK (shipping_fee >= 0),
    discount_amount NUMERIC(12,3) NOT NULL DEFAULT 0.000 CHECK (discount_amount >= 0),
    total NUMERIC(12,3) NOT NULL CHECK (total >= 0),
    payment_method VARCHAR(30) NOT NULL DEFAULT 'cash_on_delivery' CHECK (
        payment_method IN ('cash_on_delivery', 'online_card', 'bank_transfer')
    ),
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'refunded', 'failed')
    ),
    status VARCHAR(30) NOT NULL DEFAULT 'nouveau' CHECK (
        status IN ('nouveau', 'confirme', 'en_preparation', 'en_livraison', 'livre', 'annule')
    ),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    sku VARCHAR(100),
    size VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    unit_price NUMERIC(12,3) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    discount NUMERIC(12,3) NOT NULL DEFAULT 0.000 CHECK (discount >= 0),
    total_price NUMERIC(12,3) NOT NULL CHECK (total_price >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- -----------------------------------------------------------------------------
-- 6. ORDER STATUS & EDIT AUDIT TRAILS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_stat_hist_order ON public.order_status_history(order_id);

CREATE TABLE IF NOT EXISTS public.order_edit_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    actor_role VARCHAR(50) NOT NULL,
    changed_fields TEXT[] NOT NULL,
    before_values JSONB NOT NULL,
    after_values JSONB NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_edit_hist_order ON public.order_edit_history(order_id);

-- -----------------------------------------------------------------------------
-- 7. SECURE TRANSACTIONAL CHECKOUT FUNCTION (RPC)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.execute_checkout(
    p_customer_name TEXT,
    p_phone TEXT,
    p_governorate TEXT,
    p_city TEXT,
    p_address TEXT,
    p_items JSONB,
    p_customer_email TEXT DEFAULT NULL,
    p_alt_phone TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_norm_phone TEXT;
    v_customer_id UUID;
    v_order_id UUID;
    v_order_code TEXT;
    v_calc_subtotal NUMERIC(12,3) := 0.000;
    v_shipping_fee NUMERIC(12,3) := 7.000;
    v_total NUMERIC(12,3);
    v_free_shipping_threshold NUMERIC(12,3) := 200.000;
    v_item RECORD;
    v_variant RECORD;
    v_unit_price NUMERIC(12,3);
    v_line_total NUMERIC(12,3);
BEGIN
    -- Validate phone
    v_norm_phone := public.normalize_tunisian_phone(p_phone);
    IF v_norm_phone IS NULL OR length(v_norm_phone) < 8 THEN
        RAISE EXCEPTION 'Numéro de téléphone invalide';
    END IF;

    -- Validate items array
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Le panier est vide';
    END IF;

    -- Retrieve shipping parameters from settings if available
    SELECT (value->>'freeShippingThreshold')::numeric, (value->>'standardShippingFee')::numeric
    INTO v_free_shipping_threshold, v_shipping_fee
    FROM public.site_settings
    WHERE key = 'shipping_rules';

    IF v_free_shipping_threshold IS NULL THEN
        v_free_shipping_threshold := 200.000;
    END IF;
    IF v_shipping_fee IS NULL THEN
        v_shipping_fee := 7.000;
    END IF;

    -- Upsert Customer based on normalized phone
    INSERT INTO public.customers (full_name, email, normalized_phone)
    VALUES (p_customer_name, p_customer_email, v_norm_phone)
    ON CONFLICT (normalized_phone) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = COALESCE(EXCLUDED.email, public.customers.email),
        updated_at = now()
    RETURNING id INTO v_customer_id;

    -- Insert Customer Address
    INSERT INTO public.customer_addresses (
        customer_id, full_name, email, phone, address_line_1, city, governorate, delivery_notes
    ) VALUES (
        v_customer_id, p_customer_name, p_customer_email, p_phone, p_address, p_city, p_governorate, p_notes
    );

    -- Pre-calculate subtotal and validate authoritative prices from DB
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
        product_id UUID,
        variant_id UUID,
        size TEXT,
        color TEXT,
        quantity INT
    ) LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Quantité invalide pour un article';
        END IF;

        -- Find variant if provided, or lookup product price
        IF v_item.variant_id IS NOT NULL THEN
            SELECT pv.*, p.name AS prod_name, COALESCE(pv.price_override, p.sale_price, p.price) AS active_price
            INTO v_variant
            FROM public.product_variants pv
            JOIN public.products p ON pv.product_id = p.id
            WHERE pv.id = v_item.variant_id
            FOR UPDATE; -- Lock row to prevent race conditions

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Variante de produit introuvable';
            END IF;

            IF v_variant.stock_quantity < v_item.quantity THEN
                RAISE EXCEPTION 'Stock insuffisant pour % (Taille: %)', v_variant.prod_name, v_item.size;
            END IF;

            v_unit_price := v_variant.active_price;
        ELSE
            -- Direct product price lookup
            SELECT COALESCE(sale_price, price) INTO v_unit_price
            FROM public.products
            WHERE id = v_item.product_id;

            IF v_unit_price IS NULL THEN
                RAISE EXCEPTION 'Produit introuvable';
            END IF;
        END IF;

        v_line_total := v_unit_price * v_item.quantity;
        v_calc_subtotal := v_calc_subtotal + v_line_total;
    END LOOP;

    -- Calculate shipping fee
    IF v_calc_subtotal >= v_free_shipping_threshold THEN
        v_shipping_fee := 0.000;
    END IF;
    v_total := v_calc_subtotal + v_shipping_fee;

    -- Generate Order Code
    v_order_code := public.generate_order_code();

    -- Create Order Record
    INSERT INTO public.orders (
        order_code, customer_id, customer_name, customer_email, customer_phone, alt_phone,
        governorate, city, address, delivery_notes, subtotal, shipping_fee, total,
        payment_method, payment_status, status
    ) VALUES (
        v_order_code, v_customer_id, p_customer_name, p_customer_email, p_phone, p_alt_phone,
        p_governorate, p_city, p_address, p_notes, v_calc_subtotal, v_shipping_fee, v_total,
        'cash_on_delivery', 'pending', 'nouveau'
    ) RETURNING id INTO v_order_id;

    -- Insert Order Items & decrement stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
        product_id UUID,
        variant_id UUID,
        product_name TEXT,
        size TEXT,
        color TEXT,
        quantity INT,
        image_url TEXT
    ) LOOP
        -- Get authoritative unit price
        IF v_item.variant_id IS NOT NULL THEN
            SELECT COALESCE(pv.price_override, p.sale_price, p.price), pv.sku
            INTO v_unit_price, v_item.product_name
            FROM public.product_variants pv
            JOIN public.products p ON pv.product_id = p.id
            WHERE pv.id = v_item.variant_id;

            -- Decrement stock atomically
            UPDATE public.product_variants
            SET stock_quantity = stock_quantity - v_item.quantity,
                updated_at = now()
            WHERE id = v_item.variant_id;

            -- Record inventory movement
            INSERT INTO public.inventory_movements (
                variant_id, quantity_delta, reason, related_order_id, notes
            ) VALUES (
                v_item.variant_id, -v_item.quantity, 'sale', v_order_id, 'Commande ' || v_order_code
            );
        ELSE
            SELECT COALESCE(sale_price, price) INTO v_unit_price
            FROM public.products
            WHERE id = v_item.product_id;
        END IF;

        v_line_total := v_unit_price * v_item.quantity;

        INSERT INTO public.order_items (
            order_id, product_id, variant_id, product_name, size, color,
            unit_price, quantity, total_price, image_url
        ) VALUES (
            v_order_id, v_item.product_id, v_item.variant_id, v_item.product_name, v_item.size, v_item.color,
            v_unit_price, v_item.quantity, v_line_total, v_item.image_url
        );
    END LOOP;

    -- Update Customer aggregated metrics
    UPDATE public.customers
    SET total_orders_count = total_orders_count + 1,
        total_spent = total_spent + v_total,
        updated_at = now()
    WHERE id = v_customer_id;

    -- Insert initial order status history
    INSERT INTO public.order_status_history (order_id, previous_status, new_status, actor_role, note)
    VALUES (v_order_id, NULL, 'nouveau', 'CUSTOMER_CHECKOUT', 'Commande passée en ligne (Cash on Delivery)');

    RETURN jsonb_build_object(
        'success', true,
        'orderId', v_order_id,
        'orderCode', v_order_code,
        'subtotal', v_calc_subtotal,
        'shippingFee', v_shipping_fee,
        'total', v_total
    );
END;
$$;
