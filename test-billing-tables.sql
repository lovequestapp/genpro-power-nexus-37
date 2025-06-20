-- Test and create billing tables if they don't exist
-- This script will check for existing tables and create them if missing

-- Check if invoices table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'invoices') THEN
        CREATE TABLE invoices (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            invoice_number TEXT UNIQUE,
            customer_id TEXT,
            customer_name TEXT,
            customer_email TEXT,
            customer_address TEXT,
            project_id TEXT,
            project_name TEXT,
            status TEXT DEFAULT 'draft',
            issue_date DATE,
            due_date DATE,
            paid_date DATE,
            subtotal DECIMAL(10,2) DEFAULT 0,
            tax_rate DECIMAL(5,4) DEFAULT 0,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            discount_rate DECIMAL(5,4) DEFAULT 0,
            discount_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) DEFAULT 0,
            amount_paid DECIMAL(10,2) DEFAULT 0,
            balance_due DECIMAL(10,2) DEFAULT 0,
            currency TEXT DEFAULT 'USD',
            notes TEXT,
            terms TEXT,
            payment_terms INTEGER DEFAULT 30,
            payment_method TEXT,
            reference TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created invoices table';
    ELSE
        RAISE NOTICE 'Invoices table already exists';
    END IF;
END $$;

-- Check if invoice_line_items table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'invoice_line_items') THEN
        CREATE TABLE invoice_line_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
            description TEXT NOT NULL,
            quantity INTEGER DEFAULT 1,
            unit_price DECIMAL(10,2) DEFAULT 0,
            tax_rate DECIMAL(5,4) DEFAULT 0,
            tax_amount DECIMAL(10,2) DEFAULT 0,
            discount_rate DECIMAL(5,4) DEFAULT 0,
            discount_amount DECIMAL(10,2) DEFAULT 0,
            total_amount DECIMAL(10,2) DEFAULT 0,
            item_type TEXT DEFAULT 'service',
            item_id TEXT,
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created invoice_line_items table';
    ELSE
        RAISE NOTICE 'Invoice_line_items table already exists';
    END IF;
END $$;

-- Check if billing_items table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'billing_items') THEN
        CREATE TABLE billing_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            item_type TEXT DEFAULT 'service',
            unit_price DECIMAL(10,2) DEFAULT 0,
            tax_rate DECIMAL(5,4) DEFAULT 0,
            is_active BOOLEAN DEFAULT true,
            category TEXT,
            sku TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created billing_items table';
    ELSE
        RAISE NOTICE 'Billing_items table already exists';
    END IF;
END $$;

-- Check if payments table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        CREATE TABLE payments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
            amount DECIMAL(10,2) NOT NULL,
            payment_date DATE,
            payment_method TEXT DEFAULT 'cash',
            reference TEXT,
            notes TEXT,
            status TEXT DEFAULT 'completed',
            transaction_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created payments table';
    ELSE
        RAISE NOTICE 'Payments table already exists';
    END IF;
END $$;

-- Check if customers table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'customers') THEN
        CREATE TABLE customers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            address TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created customers table';
    ELSE
        RAISE NOTICE 'Customers table already exists';
    END IF;
END $$;

-- Check if projects table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        CREATE TABLE projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'in_progress',
            owner_id TEXT,
            owner_name TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            address TEXT
        );
        RAISE NOTICE 'Created projects table';
    ELSE
        RAISE NOTICE 'Projects table already exists';
    END IF;
END $$;

-- Insert sample data if tables are empty
INSERT INTO billing_items (id, name, description, item_type, unit_price, tax_rate, is_active, category, sku, created_at, updated_at) 
SELECT * FROM (VALUES
    ('bi-001', 'Generator Installation', 'Complete generator installation service including setup and testing', 'service', 1500.00, 0.085, true, 'Installation', 'GEN-INST-001', NOW(), NOW()),
    ('bi-002', 'Generator Maintenance', 'Regular maintenance service for generators', 'service', 250.00, 0.085, true, 'Maintenance', 'GEN-MAINT-001', NOW(), NOW()),
    ('bi-003', 'Emergency Repair', 'Emergency repair service for generator systems', 'service', 500.00, 0.085, true, 'Repair', 'GEN-REP-001', NOW(), NOW()),
    ('bi-004', 'Generator Parts - Fuel Filter', 'High-quality fuel filter for generators', 'product', 45.00, 0.085, true, 'Parts', 'GEN-PART-FF-001', NOW(), NOW()),
    ('bi-005', 'Generator Parts - Air Filter', 'Premium air filter for generator systems', 'product', 35.00, 0.085, true, 'Parts', 'GEN-PART-AF-001', NOW(), NOW())
) AS v(id, name, description, item_type, unit_price, tax_rate, is_active, category, sku, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM billing_items WHERE id = v.id);

INSERT INTO customers (id, name, email, phone, address, status, created_at, updated_at)
SELECT * FROM (VALUES
    ('cust-001', 'ABC Manufacturing', 'contact@abcmanufacturing.com', '(555) 123-4567', '123 Industrial Blvd, City, State 12345', 'active', NOW(), NOW()),
    ('cust-002', 'XYZ Hospital', 'billing@xyzhospital.com', '(555) 234-5678', '456 Medical Center Dr, City, State 12345', 'active', NOW(), NOW()),
    ('cust-003', 'Downtown Mall', 'maintenance@downtownmall.com', '(555) 345-6789', '789 Shopping Center Ave, City, State 12345', 'active', NOW(), NOW())
) AS v(id, name, email, phone, address, status, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE id = v.id);

INSERT INTO projects (id, name, description, status, owner_id, owner_name, created_at, address)
SELECT * FROM (VALUES
    ('proj-001', 'ABC Generator Upgrade', 'Upgrade existing generator system for increased capacity', 'in_progress', 'cust-001', 'ABC Manufacturing', NOW(), '123 Industrial Blvd, City, State 12345'),
    ('proj-002', 'XYZ Emergency Backup', 'Install emergency backup generator system', 'completed', 'cust-002', 'XYZ Hospital', NOW(), '456 Medical Center Dr, City, State 12345'),
    ('proj-003', 'Mall Power System', 'Maintenance and upgrade of mall power systems', 'in_progress', 'cust-003', 'Downtown Mall', NOW(), '789 Shopping Center Ave, City, State 12345')
) AS v(id, name, description, status, owner_id, owner_name, created_at, address)
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE id = v.id);

-- Show table status
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_name = t.table_name) as exists,
    (SELECT COUNT(*) FROM (
        SELECT 1 FROM (
            SELECT table_name FROM information_schema.tables 
            WHERE table_name = t.table_name
        ) AS sub
    ) AS count_query) as row_count
FROM (VALUES 
    ('invoices'),
    ('invoice_line_items'), 
    ('billing_items'),
    ('payments'),
    ('customers'),
    ('projects')
) AS t(table_name); 