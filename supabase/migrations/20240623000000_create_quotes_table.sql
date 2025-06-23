-- Create quotes table for storing quote requests
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    generator_type VARCHAR(100),
    power_requirements VARCHAR(100),
    fuel_type VARCHAR(50),
    installation_type VARCHAR(100),
    project_description TEXT NOT NULL,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    emergency_service BOOLEAN DEFAULT FALSE,
    maintenance_plan BOOLEAN DEFAULT FALSE,
    financing BOOLEAN DEFAULT FALSE,
    preferred_contact VARCHAR(50),
    additional_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'sent', 'accepted', 'rejected')),
    estimated_cost DECIMAL(10,2),
    estimated_timeline VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON quotes(email);
CREATE INDEX IF NOT EXISTS idx_quotes_service_type ON quotes(service_type);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quotes_updated_at 
    BEFORE UPDATE ON quotes 
    FOR EACH ROW EXECUTE FUNCTION update_quotes_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quotes
CREATE POLICY "Quotes are viewable by admins" ON quotes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Quotes are insertable by everyone" ON quotes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Quotes are updatable by admins" ON quotes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Quotes are deletable by admins" ON quotes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    ); 