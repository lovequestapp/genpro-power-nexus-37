-- Schedules Table
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

-- Trigger to automatically update updated_at on schedules table
CREATE TRIGGER set_schedules_timestamp
BEFORE UPDATE ON schedules
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Enable RLS
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Policies for schedules
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