-- Billing System Migration
-- Create comprehensive billing tables with proper relationships and constraints

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Billing Settings Table
CREATE TABLE IF NOT EXISTS billing_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_address TEXT NOT NULL,
    company_phone VARCHAR(50) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_website VARCHAR(255),
    tax_id VARCHAR(100),
    logo_url TEXT,
    default_currency VARCHAR(3) DEFAULT 'USD',
    default_tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    default_payment_terms INTEGER DEFAULT 30,
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    invoice_start_number INTEGER DEFAULT 1000,
    auto_numbering BOOLEAN DEFAULT true,
    default_notes TEXT,
    default_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Items Table (for reusable items/services)
CREATE TABLE IF NOT EXISTS billing_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('service', 'product', 'labor', 'material', 'other')),
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    is_active BOOLEAN DEFAULT true,
    category VARCHAR(100),
    sku VARCHAR(100),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Billing Info Table
CREATE TABLE IF NOT EXISTS customer_billing_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    billing_address TEXT NOT NULL,
    shipping_address TEXT,
    tax_exempt BOOLEAN DEFAULT false,
    tax_id VARCHAR(100),
    payment_terms INTEGER DEFAULT 30,
    credit_limit DECIMAL(12,2),
    preferred_payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id)
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_address TEXT NOT NULL,
    project_id UUID REFERENCES projects(id),
    project_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled', 'partially_paid')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_rate DECIMAL(5,4) DEFAULT 0.0000,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    balance_due DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    payment_terms INTEGER DEFAULT 30,
    payment_method VARCHAR(50),
    reference VARCHAR(255),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Invoice Line Items Table
CREATE TABLE IF NOT EXISTS invoice_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount_rate DECIMAL(5,4) DEFAULT 0.0000,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('service', 'product', 'labor', 'material', 'other')),
    item_id UUID REFERENCES billing_items(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'check', 'credit_card', 'bank_transfer', 'paypal', 'stripe', 'other')),
    reference VARCHAR(255),
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice Templates Table
CREATE TABLE IF NOT EXISTS invoice_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(20) NOT NULL DEFAULT 'default' CHECK (template_type IN ('default', 'custom')),
    header_html TEXT,
    footer_html TEXT,
    css_styles TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_line_items_invoice_id ON invoice_line_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_billing_items_category ON billing_items(category);
CREATE INDEX IF NOT EXISTS idx_billing_items_is_active ON billing_items(is_active);
CREATE INDEX IF NOT EXISTS idx_customer_billing_info_customer_id ON customer_billing_info(customer_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_billing_settings_updated_at BEFORE UPDATE ON billing_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billing_items_updated_at BEFORE UPDATE ON billing_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_billing_info_updated_at BEFORE UPDATE ON customer_billing_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_line_items_updated_at BEFORE UPDATE ON invoice_line_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoice_templates_updated_at BEFORE UPDATE ON invoice_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    settings billing_settings%ROWTYPE;
    next_number INTEGER;
BEGIN
    -- Get billing settings
    SELECT * INTO settings FROM billing_settings LIMIT 1;
    
    -- If no settings exist, create default
    IF NOT FOUND THEN
        INSERT INTO billing_settings (company_name, company_address, company_phone, company_email)
        VALUES ('Default Company', 'Default Address', 'Default Phone', 'default@example.com');
        SELECT * INTO settings FROM billing_settings LIMIT 1;
    END IF;
    
    -- Generate invoice number
    IF settings.auto_numbering THEN
        SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM LENGTH(settings.invoice_prefix) + 1) AS INTEGER)), settings.invoice_start_number - 1) + 1
        INTO next_number
        FROM invoices
        WHERE invoice_number LIKE settings.invoice_prefix || '%';
        
        NEW.invoice_number := settings.invoice_prefix || LPAD(next_number::TEXT, 6, '0');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate line item totals
    UPDATE invoice_line_items 
    SET 
        tax_amount = (quantity * unit_price * (1 - discount_rate)) * tax_rate,
        discount_amount = quantity * unit_price * discount_rate,
        total_amount = (quantity * unit_price * (1 - discount_rate)) * (1 + tax_rate)
    WHERE invoice_id = NEW.invoice_id;
    
    -- Update invoice totals
    UPDATE invoices 
    SET 
        subtotal = COALESCE((SELECT SUM(quantity * unit_price) FROM invoice_line_items WHERE invoice_id = NEW.invoice_id), 0),
        tax_amount = COALESCE((SELECT SUM(tax_amount) FROM invoice_line_items WHERE invoice_id = NEW.invoice_id), 0),
        discount_amount = COALESCE((SELECT SUM(discount_amount) FROM invoice_line_items WHERE invoice_id = NEW.invoice_id), 0),
        total_amount = COALESCE((SELECT SUM(total_amount) FROM invoice_line_items WHERE invoice_id = NEW.invoice_id), 0),
        balance_due = COALESCE((SELECT SUM(total_amount) FROM invoice_line_items WHERE invoice_id = NEW.invoice_id), 0) - amount_paid
    WHERE id = NEW.invoice_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice totals calculation
CREATE TRIGGER calculate_invoice_totals_trigger
    AFTER INSERT OR UPDATE ON invoice_line_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_invoice_totals();

-- Function to update invoice status based on payments
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
DECLARE
    invoice_record invoices%ROWTYPE;
    total_paid DECIMAL(12,2);
BEGIN
    -- Get invoice details
    SELECT * INTO invoice_record FROM invoices WHERE id = NEW.invoice_id;
    
    -- Calculate total paid
    SELECT COALESCE(SUM(amount), 0) INTO total_paid 
    FROM payments 
    WHERE invoice_id = NEW.invoice_id AND status = 'completed';
    
    -- Update invoice
    UPDATE invoices 
    SET 
        amount_paid = total_paid,
        balance_due = total_amount - total_paid,
        status = CASE 
            WHEN total_paid >= total_amount THEN 'paid'
            WHEN total_paid > 0 THEN 'partially_paid'
            WHEN due_date < CURRENT_DATE THEN 'overdue'
            ELSE status
        END,
        paid_date = CASE WHEN total_paid >= total_amount THEN CURRENT_DATE ELSE paid_date END
    WHERE id = NEW.invoice_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice status updates
CREATE TRIGGER update_invoice_status_trigger
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_status();

-- Enable Row Level Security
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_billing_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for development - adjust for production)
CREATE POLICY "Enable all operations for authenticated users" ON billing_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON billing_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON customer_billing_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON invoices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON invoice_line_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON payments FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all operations for authenticated users" ON invoice_templates FOR ALL USING (auth.role() = 'authenticated');

-- Insert default billing settings
INSERT INTO billing_settings (
    company_name, 
    company_address, 
    company_phone, 
    company_email,
    default_currency,
    default_tax_rate,
    default_payment_terms,
    invoice_prefix,
    invoice_start_number,
    auto_numbering
) VALUES (
    'GenPro Power Solutions',
    '123 Power Street, Energy City, EC 12345',
    '(555) 123-4567',
    'billing@genpropower.com',
    'USD',
    0.0850,
    30,
    'INV',
    1000,
    true
) ON CONFLICT DO NOTHING;

-- Insert some default billing items
INSERT INTO billing_items (name, description, item_type, unit_price, tax_rate, category, created_by) VALUES
('Generator Installation', 'Complete generator installation service', 'service', 2500.00, 0.0850, 'Installation', (SELECT id FROM auth.users LIMIT 1)),
('Generator Maintenance', 'Annual generator maintenance service', 'service', 500.00, 0.0850, 'Maintenance', (SELECT id FROM auth.users LIMIT 1)),
('Emergency Service Call', '24/7 emergency service call', 'service', 150.00, 0.0850, 'Emergency', (SELECT id FROM auth.users LIMIT 1)),
('Generator Parts', 'Replacement parts for generators', 'product', 100.00, 0.0850, 'Parts', (SELECT id FROM auth.users LIMIT 1)),
('Labor Hour', 'Technical labor per hour', 'labor', 75.00, 0.0850, 'Labor', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert default invoice template
INSERT INTO invoice_templates (name, description, template_type, is_active, created_by) VALUES
('Default Template', 'Standard invoice template', 'default', true, (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING; 