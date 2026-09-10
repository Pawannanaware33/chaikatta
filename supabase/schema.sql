-- ==============================================================================
-- CHAI KATTA (☕) - COMPLETE DATABASE SCHEMA FOR SUPABASE / POSTGRESQL
-- ==============================================================================
-- Description: Core POS and Sales Analytics schema for Chai Katta tea shop.
-- Normalized relational schema designed for high-speed POS entry and direct
-- Power BI consumption.
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on active status for fast product listing
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);

-- ------------------------------------------------------------------------------
-- 2. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    order_time TIME NOT NULL DEFAULT CURRENT_TIME,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'UPI')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance and reporting / Power BI slicing
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- ------------------------------------------------------------------------------
-- 3. ORDER_ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for foreign keys and joins
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ------------------------------------------------------------------------------
-- 4. SEQUENCE FOR UNIQUE HUMAN-READABLE ORDER NUMBERS (CK-000001)
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1 INCREMENT BY 1;

-- Function to generate next order number
CREATE OR REPLACE FUNCTION generate_order_number() 
RETURNS TEXT AS $$
BEGIN
    RETURN 'CK-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 5. ATOMIC ORDER CREATION RPC (TRANSACTIONAL INTEGRITY)
-- ------------------------------------------------------------------------------
-- Ensures an order and its items are committed together atomically.
-- If any item fails or total is invalid, the entire transaction rolls back.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_order_atomic(
    p_payment_method TEXT,
    p_items JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_total_amount NUMERIC(10, 2) := 0;
    v_item JSONB;
    v_item_product_id UUID;
    v_item_quantity INTEGER;
    v_item_unit_price NUMERIC(10, 2);
    v_item_line_total NUMERIC(10, 2);
    v_order_row RECORD;
BEGIN
    -- Validate payment method
    IF p_payment_method NOT IN ('Cash', 'UPI') THEN
        RAISE EXCEPTION 'Invalid payment method: %. Must be Cash or UPI.', p_payment_method;
    END IF;

    -- Validate items array
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item.';
    END IF;

    -- Calculate total and validate items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_quantity := (v_item->>'quantity')::INTEGER;
        v_item_unit_price := (v_item->>'unit_price')::NUMERIC(10, 2);
        
        IF v_item_quantity <= 0 THEN
            RAISE EXCEPTION 'Item quantity must be greater than zero.';
        END IF;

        IF v_item_unit_price < 0 THEN
            RAISE EXCEPTION 'Item unit price cannot be negative.';
        END IF;

        v_total_amount := v_total_amount + (v_item_quantity * v_item_unit_price);
    END LOOP;

    -- Generate order number
    v_order_number := generate_order_number();

    -- Insert Order
    INSERT INTO orders (
        order_number,
        order_date,
        order_time,
        total_amount,
        payment_method,
        created_at
    ) VALUES (
        v_order_number,
        CURRENT_DATE,
        CURRENT_TIME,
        v_total_amount,
        p_payment_method,
        NOW()
    )
    RETURNING id INTO v_order_id;

    -- Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_product_id := (v_item->>'product_id')::UUID;
        v_item_quantity := (v_item->>'quantity')::INTEGER;
        v_item_unit_price := (v_item->>'unit_price')::NUMERIC(10, 2);
        v_item_line_total := v_item_quantity * v_item_unit_price;

        INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            unit_price,
            line_total,
            created_at
        ) VALUES (
            v_order_id,
            v_item_product_id,
            v_item_quantity,
            v_item_unit_price,
            v_item_line_total,
            NOW()
        );
    END LOOP;

    -- Return the created order details with items
    SELECT 
        jsonb_build_object(
            'id', o.id,
            'order_number', o.order_number,
            'order_date', o.order_date,
            'order_time', o.order_time,
            'total_amount', o.total_amount,
            'payment_method', o.payment_method,
            'created_at', o.created_at,
            'items', (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', oi.id,
                        'product_id', oi.product_id,
                        'name', p.name,
                        'product_code', p.product_code,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price,
                        'line_total', oi.line_total
                    )
                )
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = o.id
            )
        ) INTO v_order_row
    FROM orders o
    WHERE o.id = v_order_id;

    RETURN v_order_row.jsonb_build_object;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read active products
DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products
    FOR SELECT USING (true);

-- Orders: Allow read & insert for POS and Dashboard operations
DROP POLICY IF EXISTS "Public read orders" ON orders;
CREATE POLICY "Public read orders" ON orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Order Items: Allow read & insert
DROP POLICY IF EXISTS "Public read order_items" ON order_items;
CREATE POLICY "Public read order_items" ON order_items
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
CREATE POLICY "Public insert order_items" ON order_items
    FOR INSERT WITH CHECK (true);

-- Grant execute permission on the atomic function
GRANT EXECUTE ON FUNCTION create_order_atomic(TEXT, JSONB) TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 7. INITIAL PRODUCTS SEED DATA
-- ------------------------------------------------------------------------------
-- Six official products for Chai Katta (no Other product)
-- ------------------------------------------------------------------------------
INSERT INTO products (product_code, name, price, active)
VALUES
    ('P001', 'Tea', 15.00, true),
    ('P002', 'Lemon Tea', 20.00, true),
    ('P003', 'Black Tea', 15.00, true),
    ('P004', 'Coffee', 20.00, true),
    ('P005', 'Black Coffee', 20.00, true),
    ('P006', 'Water Bottle', 10.00, true)
ON CONFLICT (product_code) 
DO UPDATE SET 
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    active = EXCLUDED.active,
    updated_at = NOW();

-- ==============================================================================
-- POWER BI COMPATIBLE VIEWS (OPTIONAL BUT PRE-CONFIGURED FOR DIRECT BI CONSUMPTION)
-- ==============================================================================
CREATE OR REPLACE VIEW view_bi_sales_flat AS
SELECT 
    o.id AS order_id,
    o.order_number,
    o.order_date,
    o.order_time,
    o.payment_method,
    o.total_amount AS order_total,
    oi.id AS order_item_id,
    oi.product_id,
    p.product_code,
    p.name AS product_name,
    oi.quantity,
    oi.unit_price,
    oi.line_total,
    o.created_at AS order_created_at
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id;
