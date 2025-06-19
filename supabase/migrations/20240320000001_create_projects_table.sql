-- Create projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'archived')) DEFAULT 'planned',
    owner_id UUID NOT NULL REFERENCES profiles(id),
    customer_id UUID REFERENCES profiles(id),
    assigned_to UUID[] DEFAULT '{}',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    address TEXT,
    generator_id UUID,
    has_generator BOOLEAN DEFAULT false,
    generator_status TEXT DEFAULT 'none' CHECK (generator_status IN ('none', 'pending', 'installed', 'maintenance')),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for projects table
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_assigned_to ON projects USING GIN(assigned_to);
CREATE INDEX idx_projects_start_date ON projects(start_date);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Projects are viewable by owner, assigned team members, and staff"
    ON projects FOR SELECT
    USING (
        owner_id = auth.uid() OR
        assigned_to @> ARRAY[auth.uid()] OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Users can create projects"
    ON projects FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Project owners and staff can update projects"
    ON projects FOR UPDATE
    USING (
        owner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Only admins can delete projects"
    ON projects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    ); 