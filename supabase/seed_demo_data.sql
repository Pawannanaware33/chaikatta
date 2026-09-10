-- ==============================================================================
-- CHAI KATTA (☕) - REALISTIC DEMO SALES DATA FOR DEVELOPMENT & TESTING
-- ==============================================================================
-- Covers:
--  - TODAY sales
--  - YESTERDAY sales
--  - THIS WEEK sales (past 3-5 days)
--  - THIS MONTH sales (past 15-25 days)
-- Uses strictly the 6 official products.
-- Both Cash and UPI payments included.
-- Clearly marked and easy to clear/reset.
-- ==============================================================================

DO $$
DECLARE
    p_tea UUID;
    p_lemon UUID;
    p_black_tea UUID;
    p_coffee UUID;
    p_black_coffee UUID;
    p_water UUID;
    
    o_id UUID;
    curr_seq INT;
BEGIN
    -- Get product IDs
    SELECT id INTO p_tea FROM products WHERE product_code = 'P001';
    SELECT id INTO p_lemon FROM products WHERE product_code = 'P002';
    SELECT id INTO p_black_tea FROM products WHERE product_code = 'P003';
    SELECT id INTO p_coffee FROM products WHERE product_code = 'P004';
    SELECT id INTO p_black_coffee FROM products WHERE product_code = 'P005';
    SELECT id INTO p_water FROM products WHERE product_code = 'P006';

    -- Check if products exist
    IF p_tea IS NULL THEN
        RAISE EXCEPTION 'Products must be seeded before running demo sales data.';
    END IF;

    -- Helper to get next sequence number
    SELECT COALESCE(last_value, 1) INTO curr_seq FROM order_number_seq;

    -- ==========================================
    -- 1. TODAY'S SALES (Various hours)
    -- ==========================================

    -- Order 1: Morning rush (2 Tea, 1 Coffee) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE, '08:15:00', 50.00, 'UPI', CURRENT_DATE + TIME '08:15:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 2, 15.00, 30.00),
    (o_id, p_coffee, 1, 20.00, 20.00);

    -- Order 2: Mid-morning (3 Tea, 1 Water Bottle) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE, '09:30:00', 55.00, 'Cash', CURRENT_DATE + TIME '09:30:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 3, 15.00, 45.00),
    (o_id, p_water, 1, 10.00, 10.00);

    -- Order 3: Noon refreshing (2 Lemon Tea) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE, '11:45:00', 40.00, 'UPI', CURRENT_DATE + TIME '11:45:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_lemon, 2, 20.00, 40.00);

    -- Order 4: Afternoon quick bite (1 Black Tea, 1 Black Coffee) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE, '14:20:00', 35.00, 'Cash', CURRENT_DATE + TIME '14:20:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_black_tea, 1, 15.00, 15.00),
    (o_id, p_black_coffee, 1, 20.00, 20.00);

    -- Order 5: Evening friends group (4 Tea, 2 Coffee, 2 Water Bottle) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE, '17:10:00', 120.00, 'UPI', CURRENT_DATE + TIME '17:10:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 4, 15.00, 60.00),
    (o_id, p_coffee, 2, 20.00, 40.00),
    (o_id, p_water, 2, 10.00, 20.00);

    -- ==========================================
    -- 2. YESTERDAY'S SALES
    -- ==========================================

    -- Order 6: Yesterday Morning (4 Tea) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 1, '08:45:00', 60.00, 'Cash', (CURRENT_DATE - 1) + TIME '08:45:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 4, 15.00, 60.00);

    -- Order 7: Yesterday Noon (2 Coffee, 1 Lemon Tea) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 1, '12:30:00', 60.00, 'UPI', (CURRENT_DATE - 1) + TIME '12:30:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_coffee, 2, 20.00, 40.00),
    (o_id, p_lemon, 1, 20.00, 20.00);

    -- Order 8: Yesterday Evening (3 Black Tea, 2 Water Bottle) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 1, '18:15:00', 65.00, 'Cash', (CURRENT_DATE - 1) + TIME '18:15:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_black_tea, 3, 15.00, 45.00),
    (o_id, p_water, 2, 10.00, 20.00);

    -- ==========================================
    -- 3. THIS WEEK SALES (3 to 6 days ago)
    -- ==========================================

    -- Order 9: 3 days ago (5 Tea, 2 Black Coffee) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 3, '10:00:00', 115.00, 'UPI', (CURRENT_DATE - 3) + TIME '10:00:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 5, 15.00, 75.00),
    (o_id, p_black_coffee, 2, 20.00, 40.00);

    -- Order 10: 4 days ago (3 Lemon Tea, 3 Water Bottle) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 4, '15:30:00', 90.00, 'Cash', (CURRENT_DATE - 4) + TIME '15:30:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_lemon, 3, 20.00, 60.00),
    (o_id, p_water, 3, 10.00, 30.00);

    -- Order 11: 5 days ago (4 Coffee) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 5, '17:45:00', 80.00, 'UPI', (CURRENT_DATE - 5) + TIME '17:45:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_coffee, 4, 20.00, 80.00);

    -- ==========================================
    -- 4. EARLIER THIS MONTH (10 to 18 days ago)
    -- ==========================================

    -- Order 12: 10 days ago (6 Tea, 2 Water) - Cash
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 10, '09:00:00', 110.00, 'Cash', (CURRENT_DATE - 10) + TIME '09:00:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_tea, 6, 15.00, 90.00),
    (o_id, p_water, 2, 10.00, 20.00);

    -- Order 13: 15 days ago (3 Black Tea, 2 Lemon Tea) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 15, '16:15:00', 85.00, 'UPI', (CURRENT_DATE - 15) + TIME '16:15:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_black_tea, 3, 15.00, 45.00),
    (o_id, p_lemon, 2, 20.00, 40.00);

    -- Order 14: 18 days ago (4 Coffee, 2 Black Coffee) - UPI
    INSERT INTO orders (order_number, order_date, order_time, total_amount, payment_method, created_at)
    VALUES (generate_order_number(), CURRENT_DATE - 18, '11:20:00', 120.00, 'UPI', (CURRENT_DATE - 18) + TIME '11:20:00')
    RETURNING id INTO o_id;
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
    (o_id, p_coffee, 4, 20.00, 80.00),
    (o_id, p_black_coffee, 2, 20.00, 40.00);

    RAISE NOTICE 'Realistic demo sales data created successfully for Chai Katta!';
END $$;
