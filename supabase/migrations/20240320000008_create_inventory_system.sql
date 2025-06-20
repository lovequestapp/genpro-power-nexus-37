-- Inventory Management System
-- This migration creates a comprehensive inventory management system

-- Create inventory categories table
CREATE TABLE inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'package',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create suppliers table
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    website TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0,
    terms TEXT,
    payment_terms TEXT DEFAULT 'Net 30',
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_supplier_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create inventory items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE,
    barcode TEXT UNIQUE,
    category_id UUID REFERENCES inventory_categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    manufacturer TEXT,
    model TEXT,
    part_number TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    min_quantity INTEGER DEFAULT 0 NOT NULL,
    max_quantity INTEGER,
    unit_cost DECIMAL(10,2) DEFAULT 0.00,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    location TEXT,
    shelf_location TEXT,
    status TEXT NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock', 'discontinued', 'on_order')),
    condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished', 'damaged')),
    warranty_period INTEGER, -- in months
    weight DECIMAL(8,2), -- in kg
    dimensions TEXT, -- format: "LxWxH cm"
    image_url TEXT,
    documents TEXT[], -- array of document URLs
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'::jsonb,
    last_restocked TIMESTAMP WITH TIME ZONE,
    last_audit TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id)
);

-- Create stock movements table for tracking inventory changes
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer', 'damage', 'return')),
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reference_type TEXT CHECK (reference_type IN ('purchase_order', 'sales_order', 'project', 'audit', 'manual', 'return')),
    reference_id TEXT,
    notes TEXT,
    location_from TEXT,
    location_to TEXT,
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Create purchase orders table
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number TEXT UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
    order_date DATE NOT NULL,
    expected_delivery DATE,
    delivery_date DATE,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id)
);

-- Create purchase order items table
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES inventory_items(id),
    item_name TEXT NOT NULL,
    item_description TEXT,
    quantity INTEGER NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    received_quantity INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create barcode scans table for tracking barcode usage
CREATE TABLE barcode_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    barcode TEXT NOT NULL,
    item_id UUID REFERENCES inventory_items(id),
    scan_type TEXT NOT NULL CHECK (scan_type IN ('in', 'out', 'audit', 'location_change')),
    quantity INTEGER,
    location TEXT,
    notes TEXT,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    scanned_by UUID NOT NULL REFERENCES profiles(id),
    device_info JSONB DEFAULT '{}'::jsonb
);

-- Create inventory alerts table
CREATE TABLE inventory_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'expiring_warranty', 'overstock', 'price_change')),
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES profiles(id)
);

-- Create indexes for better performance
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX idx_inventory_items_category_id ON inventory_items(category_id);
CREATE INDEX idx_inventory_items_supplier_id ON inventory_items(supplier_id);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);
CREATE INDEX idx_inventory_items_location ON inventory_items(location);
CREATE INDEX idx_stock_movements_item_id ON stock_movements(item_id);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX idx_stock_movements_movement_type ON stock_movements(movement_type);
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX idx_purchase_order_items_po_id ON purchase_order_items(purchase_order_id);
CREATE INDEX idx_barcode_scans_barcode ON barcode_scans(barcode);
CREATE INDEX idx_barcode_scans_item_id ON barcode_scans(item_id);
CREATE INDEX idx_inventory_alerts_item_id ON inventory_alerts(item_id);
CREATE INDEX idx_inventory_alerts_is_active ON inventory_alerts(is_active);

-- Create triggers for updated_at
CREATE TRIGGER update_inventory_categories_updated_at
    BEFORE UPDATE ON inventory_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate SKU
CREATE OR REPLACE FUNCTION generate_sku(category_name TEXT, item_name TEXT)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    suffix TEXT;
    sku TEXT;
    counter INTEGER := 1;
BEGIN
    -- Generate prefix from category (first 3 letters)
    prefix := UPPER(SUBSTRING(category_name FROM 1 FOR 3));
    
    -- Generate suffix from item_name (first 3 letters)
    suffix := UPPER(SUBSTRING(REPLACE(item_name, ' ', '') FROM 1 FOR 3));
    
    -- Create base SKU
    sku := prefix || '-' || suffix || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Check if SKU exists and increment counter
    WHILE EXISTS (SELECT 1 FROM inventory_items WHERE sku = sku) LOOP
        counter := counter + 1;
        sku := prefix || '-' || suffix || '-' || LPAD(counter::TEXT, 4, '0');
    END LOOP;
    
    RETURN sku;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate PO number
CREATE OR REPLACE FUNCTION generate_po_number()
RETURNS TRIGGER AS $$
DECLARE
    year TEXT;
    sequence_num INTEGER;
BEGIN
    year := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get the next sequence number for the current year
    SELECT COALESCE(MAX(SUBSTRING(po_number FROM 8)::INTEGER), 0) + 1
    INTO sequence_num
    FROM purchase_orders
    WHERE po_number LIKE 'PO-' || year || '-%';
    
    -- Format: PO-YY-XXXXX
    NEW.po_number := 'PO-' || year || '-' || LPAD(sequence_num::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for PO number generation
CREATE TRIGGER set_po_number
    BEFORE INSERT ON purchase_orders
    FOR EACH ROW
    WHEN (NEW.po_number IS NULL)
    EXECUTE FUNCTION generate_po_number();

-- Create function to update item status based on quantity
CREATE OR REPLACE FUNCTION update_item_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status based on quantity
    IF NEW.quantity <= 0 THEN
        NEW.status := 'out_of_stock';
    ELSIF NEW.quantity <= NEW.min_quantity THEN
        NEW.status := 'low_stock';
    ELSE
        NEW.status := 'in_stock';
    END IF;
    
    -- Update last_restocked if quantity increased
    IF NEW.quantity > OLD.quantity THEN
        NEW.last_restocked := TIMEZONE('utc'::text, NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update item status
CREATE TRIGGER update_inventory_item_status
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_item_status();

-- Create function to log stock movements
CREATE OR REPLACE FUNCTION log_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert stock movement record
    INSERT INTO stock_movements (
        item_id,
        movement_type,
        quantity,
        previous_quantity,
        new_quantity,
        reference_type,
        notes,
        unit_cost,
        total_value,
        created_by
    ) VALUES (
        NEW.id,
        CASE 
            WHEN NEW.quantity > OLD.quantity THEN 'in'
            WHEN NEW.quantity < OLD.quantity THEN 'out'
            ELSE 'adjustment'
        END,
        ABS(NEW.quantity - OLD.quantity),
        OLD.quantity,
        NEW.quantity,
        'manual',
        'Quantity updated',
        NEW.unit_cost,
        NEW.unit_cost * ABS(NEW.quantity - OLD.quantity),
        NEW.updated_by
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to log stock movements
CREATE TRIGGER log_inventory_movement
    AFTER UPDATE ON inventory_items
    FOR EACH ROW
    WHEN (OLD.quantity IS DISTINCT FROM NEW.quantity)
    EXECUTE FUNCTION log_stock_movement();

-- Create function to create low stock alerts
CREATE OR REPLACE FUNCTION create_low_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
    -- Create alert if quantity is at or below minimum
    IF NEW.quantity <= NEW.min_quantity AND NEW.quantity > 0 THEN
        INSERT INTO inventory_alerts (
            item_id,
            alert_type,
            message
        ) VALUES (
            NEW.id,
            'low_stock',
            'Item ' || NEW.name || ' is running low on stock. Current quantity: ' || NEW.quantity || ', Minimum: ' || NEW.min_quantity
        );
    END IF;
    
    -- Create out of stock alert if quantity is 0
    IF NEW.quantity = 0 AND OLD.quantity > 0 THEN
        INSERT INTO inventory_alerts (
            item_id,
            alert_type,
            message
        ) VALUES (
            NEW.id,
            'out_of_stock',
            'Item ' || NEW.name || ' is out of stock'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for low stock alerts
CREATE TRIGGER create_inventory_alerts
    AFTER UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION create_low_stock_alert();

-- Enable Row Level Security
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE barcode_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for inventory_categories
CREATE POLICY "Enable read access for authenticated users" ON inventory_categories
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON inventory_categories
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable update for admin users" ON inventory_categories
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for suppliers
CREATE POLICY "Enable read access for authenticated users" ON suppliers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON suppliers
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable update for admin users" ON suppliers
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for inventory_items
CREATE POLICY "Enable read access for authenticated users" ON inventory_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON inventory_items
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable update for admin users" ON inventory_items
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for stock_movements
CREATE POLICY "Enable read access for authenticated users" ON stock_movements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON stock_movements
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for purchase_orders
CREATE POLICY "Enable read access for authenticated users" ON purchase_orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON purchase_orders
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Enable update for admin users" ON purchase_orders
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for purchase_order_items
CREATE POLICY "Enable read access for authenticated users" ON purchase_order_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for admin users" ON purchase_order_items
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for barcode_scans
CREATE POLICY "Enable read access for authenticated users" ON barcode_scans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON barcode_scans
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = scanned_by);

-- Create RLS policies for inventory_alerts
CREATE POLICY "Enable read access for authenticated users" ON inventory_alerts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable update for admin users" ON inventory_alerts
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert default categories
INSERT INTO inventory_categories (name, description, color, icon) VALUES
('Generators', 'Power generators and backup systems', '#3B82F6', 'zap'),
('Parts', 'Generator parts and components', '#10B981', 'wrench'),
('Tools', 'Maintenance and installation tools', '#F59E0B', 'tool'),
('Supplies', 'General supplies and consumables', '#8B5CF6', 'package'),
('Electronics', 'Electronic components and devices', '#EF4444', 'cpu'),
('Safety Equipment', 'Safety gear and protective equipment', '#06B6D4', 'shield');

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_name, email, phone, address, rating, terms) VALUES
('Generac Power Systems', 'John Smith', 'john.smith@generac.com', '(800) 333-1322', 'S45W29290 Hwy 59, Waukesha, WI 53189', 4.5, 'Net 30'),
('Cummins Power Generation', 'Sarah Johnson', 'sarah.johnson@cummins.com', '(800) 888-6626', '1400 73rd Ave NE, Minneapolis, MN 55432', 4.8, 'Net 45'),
('Kohler Power Systems', 'Mike Davis', 'mike.davis@kohler.com', '(800) 544-2444', '444 Highland Drive, Kohler, WI 53044', 4.3, 'Net 30'),
('Grainger Industrial Supply', 'Lisa Wilson', 'lisa.wilson@grainger.com', '(800) 472-4643', '100 Grainger Parkway, Lake Forest, IL 60045', 4.6, 'Net 30'),
('Fastenal Company', 'David Brown', 'david.brown@fastenal.com', '(800) 328-7866', '2001 Theurer Blvd, Winona, MN 55987', 4.4, 'Net 30'); 