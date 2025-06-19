-- Fix existing projects table by adding missing columns
-- This migration safely adds columns that might be missing from the existing projects table

-- Add missing columns to projects table if they don't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS assigned_to UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS generator_id UUID,
ADD COLUMN IF NOT EXISTS has_generator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generator_status TEXT DEFAULT 'none' CHECK (generator_status IN ('none', 'pending', 'installed', 'maintenance')),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add missing indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects USING GIN(assigned_to);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Add trigger for updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
        CREATE TRIGGER update_projects_updated_at
            BEFORE UPDATE ON projects
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Projects are viewable by owner, assigned team members, and staff" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Project owners and staff can update projects" ON projects;
DROP POLICY IF EXISTS "Only admins can delete projects" ON projects;

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