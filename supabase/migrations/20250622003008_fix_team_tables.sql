-- Ensure team_members table exists
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    role TEXT NOT NULL DEFAULT 'technician',
    status TEXT NOT NULL DEFAULT 'pending',
    avatar_url TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure time_entries table exists
CREATE TABLE IF NOT EXISTS time_entries (
    id BIGSERIAL PRIMARY KEY,
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure schedules table exists
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create or replace the timestamp function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if they don't exist
DROP TRIGGER IF EXISTS set_team_members_timestamp ON team_members;
CREATE TRIGGER set_team_members_timestamp
BEFORE UPDATE ON team_members
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_schedules_timestamp ON schedules;
CREATE TRIGGER set_schedules_timestamp
BEFORE UPDATE ON schedules
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin to manage team members" ON team_members;
DROP POLICY IF EXISTS "Allow team members to view their own data" ON team_members;
DROP POLICY IF EXISTS "Allow admin to manage time entries" ON time_entries;
DROP POLICY IF EXISTS "Allow team members to manage their own time entries" ON time_entries;
DROP POLICY IF EXISTS "Allow admin to manage schedules" ON schedules;
DROP POLICY IF EXISTS "Allow team members to view their own schedules" ON schedules;
DROP POLICY IF EXISTS "Allow team members to update their own schedules" ON schedules;

-- Create policies for team_members
CREATE POLICY "Allow admin to manage team members" ON team_members
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow team members to view their own data" ON team_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policies for time_entries
CREATE POLICY "Allow admin to manage time entries" ON time_entries
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow team members to manage their own time entries" ON time_entries
FOR ALL
TO authenticated
USING (
  (SELECT user_id FROM team_members WHERE id = team_member_id) = auth.uid()
);

-- Create policies for schedules
CREATE POLICY "Allow admin to manage schedules" ON schedules
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow team members to view their own schedules" ON schedules
FOR SELECT
TO authenticated
USING (
  (SELECT user_id FROM team_members WHERE id = team_member_id) = auth.uid()
);

CREATE POLICY "Allow team members to update their own schedules" ON schedules
FOR UPDATE
TO authenticated
USING (
  (SELECT user_id FROM team_members WHERE id = team_member_id) = auth.uid()
);

-- Grant necessary permissions
GRANT ALL ON team_members TO authenticated;
GRANT ALL ON time_entries TO authenticated;
GRANT ALL ON schedules TO authenticated;
GRANT USAGE ON SEQUENCE time_entries_id_seq TO authenticated;
