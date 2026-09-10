-- ==============================================================================
-- CHAI KATTA (☕) - CLEAR SALES TRANSACTIONS & RESET SEQUENCE
-- ==============================================================================
-- Safely deletes all sales orders and line items while keeping the 6 menu products.
-- Resets the order number sequence back to 1 (starting at CK-000001).
-- ==============================================================================

TRUNCATE TABLE order_items, orders CASCADE;

ALTER SEQUENCE IF EXISTS order_number_seq RESTART WITH 1;
