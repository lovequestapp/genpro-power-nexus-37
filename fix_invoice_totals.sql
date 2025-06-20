-- Fix existing invoices with $0.00 totals by recalculating from line items
-- Run this in your Supabase SQL editor

-- First, let's see which invoices have $0.00 totals
SELECT 
  i.id,
  i.invoice_number,
  i.customer_name,
  i.total_amount,
  COUNT(ili.id) as line_item_count,
  COALESCE(SUM(ili.total_amount), 0) as calculated_total
FROM invoices i
LEFT JOIN invoice_line_items ili ON i.id = ili.invoice_id
GROUP BY i.id, i.invoice_number, i.customer_name, i.total_amount
HAVING i.total_amount = 0 OR i.total_amount IS NULL;

-- Update invoices with correct totals from line items
UPDATE invoices 
SET 
  subtotal = COALESCE((
    SELECT SUM(quantity * unit_price) 
    FROM invoice_line_items 
    WHERE invoice_id = invoices.id
  ), 0),
  tax_amount = COALESCE((
    SELECT SUM(tax_amount) 
    FROM invoice_line_items 
    WHERE invoice_id = invoices.id
  ), 0),
  discount_amount = COALESCE((
    SELECT SUM(discount_amount) 
    FROM invoice_line_items 
    WHERE invoice_id = invoices.id
  ), 0),
  total_amount = COALESCE((
    SELECT SUM(total_amount) 
    FROM invoice_line_items 
    WHERE invoice_id = invoices.id
  ), 0),
  balance_due = COALESCE((
    SELECT SUM(total_amount) 
    FROM invoice_line_items 
    WHERE invoice_id = invoices.id
  ), 0) - COALESCE(amount_paid, 0),
  updated_at = NOW()
WHERE id IN (
  SELECT DISTINCT i.id
  FROM invoices i
  LEFT JOIN invoice_line_items ili ON i.id = ili.invoice_id
  WHERE i.total_amount = 0 OR i.total_amount IS NULL
  AND EXISTS (SELECT 1 FROM invoice_line_items WHERE invoice_id = i.id)
);

-- Verify the fix
SELECT 
  id,
  invoice_number,
  customer_name,
  subtotal,
  tax_amount,
  discount_amount,
  total_amount,
  balance_due
FROM invoices 
ORDER BY created_at DESC 
LIMIT 10; 