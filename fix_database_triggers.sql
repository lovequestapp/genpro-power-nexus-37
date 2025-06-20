-- Fix database triggers causing stack depth limit exceeded error
-- Run this in your Supabase SQL editor

-- First, let's see what triggers exist on the invoice_line_items table
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'invoice_line_items';

-- Check for any functions that might be causing recursion
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition LIKE '%invoice_line_items%'
AND routine_schema = 'public';

-- Disable any problematic triggers temporarily
-- (Replace 'trigger_name' with actual trigger names found above)
-- DROP TRIGGER IF EXISTS trigger_name ON invoice_line_items;

-- Let's also check if there are any foreign key constraints with CASCADE that might cause issues
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND (tc.table_name = 'invoice_line_items' OR ccu.table_name = 'invoice_line_items');

-- Check for any RLS (Row Level Security) policies that might cause issues
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'invoice_line_items';

-- If there are problematic triggers, we can create a simple version without them
-- Here's a safe way to insert line items without triggers:

-- First, let's try to insert a simple line item to test
INSERT INTO invoice_line_items (
    invoice_id,
    description,
    quantity,
    unit_price,
    tax_rate,
    tax_amount,
    discount_rate,
    discount_amount,
    total_amount,
    item_type,
    notes,
    created_at,
    updated_at
) VALUES (
    '09538c1d-7f25-400c-81cc-bb65f5a51a47', -- Use the invoice ID from your error
    'Test Item',
    1,
    100.00,
    0.085,
    8.50,
    0,
    0,
    108.50,
    'service',
    'Test note',
    NOW(),
    NOW()
);

-- If that works, we can create a function to safely insert line items
CREATE OR REPLACE FUNCTION safe_insert_line_item(
    p_invoice_id UUID,
    p_description TEXT,
    p_quantity NUMERIC,
    p_unit_price NUMERIC,
    p_tax_rate NUMERIC DEFAULT 0,
    p_discount_rate NUMERIC DEFAULT 0,
    p_item_type TEXT DEFAULT 'service',
    p_notes TEXT DEFAULT ''
) RETURNS UUID AS $$
DECLARE
    v_line_item_id UUID;
    v_subtotal NUMERIC;
    v_tax_amount NUMERIC;
    v_discount_amount NUMERIC;
    v_total_amount NUMERIC;
BEGIN
    -- Calculate amounts
    v_subtotal := p_quantity * p_unit_price;
    v_discount_amount := v_subtotal * p_discount_rate;
    v_tax_amount := (v_subtotal - v_discount_amount) * p_tax_rate;
    v_total_amount := v_subtotal - v_discount_amount + v_tax_amount;
    
    -- Insert line item
    INSERT INTO invoice_line_items (
        invoice_id,
        description,
        quantity,
        unit_price,
        tax_rate,
        tax_amount,
        discount_rate,
        discount_amount,
        total_amount,
        item_type,
        notes,
        created_at,
        updated_at
    ) VALUES (
        p_invoice_id,
        p_description,
        p_quantity,
        p_unit_price,
        p_tax_rate,
        v_tax_amount,
        p_discount_rate,
        v_discount_amount,
        v_total_amount,
        p_item_type,
        p_notes,
        NOW(),
        NOW()
    ) RETURNING id INTO v_line_item_id;
    
    RETURN v_line_item_id;
END;
$$ LANGUAGE plpgsql; 