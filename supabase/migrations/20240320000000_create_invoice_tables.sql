-- Create invoice templates table
CREATE TABLE invoice_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    html_template TEXT NOT NULL,
    css_template TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_number TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    template_id UUID REFERENCES invoice_templates(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    terms TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoice items table
CREATE TABLE invoice_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create invoice_emails table for tracking sent emails
CREATE TABLE invoice_emails (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year TEXT;
    sequence_num INTEGER;
BEGIN
    year := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get the next sequence number for the current year
    SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM 8)::INTEGER), 0) + 1
    INTO sequence_num
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || year || '-%';
    
    -- Format: INV-YY-XXXXX
    NEW.invoice_number := 'INV-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for invoice number generation
CREATE TRIGGER set_invoice_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL)
    EXECUTE FUNCTION generate_invoice_number();

-- Create indexes
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_template_id ON invoices(template_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_emails_invoice_id ON invoice_emails(invoice_id);

-- Add RLS policies
ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_emails ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON invoice_templates
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON invoices
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON invoices
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON invoices
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON invoice_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON invoice_items
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON invoice_items
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON invoice_emails
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON invoice_emails
    FOR INSERT TO authenticated WITH CHECK (true); 