-- Temporary migration to disable RLS on inventory tables for testing
-- This should be reverted once testing is complete

-- Disable RLS on inventory tables temporarily
ALTER TABLE inventory_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE barcode_scans DISABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts DISABLE ROW LEVEL SECURITY;

-- Add a comment to remind us to re-enable RLS later
COMMENT ON TABLE inventory_categories IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE suppliers IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE inventory_items IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE stock_movements IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE purchase_orders IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE purchase_order_items IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE barcode_scans IS 'RLS temporarily disabled for testing - remember to re-enable!';
COMMENT ON TABLE inventory_alerts IS 'RLS temporarily disabled for testing - remember to re-enable!'; 