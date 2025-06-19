-- Phase 3: Advanced Project Management Features
-- This migration adds milestone management, audit trails, and status workflow

-- Create milestones table for project progress tracking
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')) DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES profiles(id),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100) DEFAULT 0,
    dependencies UUID[] DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create project audit trail table
CREATE TABLE IF NOT EXISTS project_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    field_name TEXT,
    old_value TEXT,
    new_value TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create project status workflow rules table
CREATE TABLE IF NOT EXISTS project_status_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    allowed_roles TEXT[] NOT NULL,
    requires_approval BOOLEAN DEFAULT false,
    notification_template TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(from_status, to_status)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_assigned_to ON milestones(assigned_to);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_order_index ON milestones(order_index);

CREATE INDEX IF NOT EXISTS idx_project_audit_log_project_id ON project_audit_log(project_id);
CREATE INDEX IF NOT EXISTS idx_project_audit_log_created_at ON project_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_project_audit_log_user_id ON project_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_project_audit_log_action ON project_audit_log(action);

CREATE INDEX IF NOT EXISTS idx_project_status_rules_from_status ON project_status_rules(from_status);
CREATE INDEX IF NOT EXISTS idx_project_status_rules_to_status ON project_status_rules(to_status);

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_milestones_updated_at
    BEFORE UPDATE ON milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_rules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for milestones
CREATE POLICY "Milestones are viewable by project team members"
    ON milestones FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Staff can create and update milestones"
    ON milestones FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Create policies for project audit log
CREATE POLICY "Project audit log is viewable by project team members"
    ON project_audit_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = project_id AND (
                owner_id = auth.uid() OR
                assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Staff can insert audit log entries"
    ON project_audit_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Create policies for project status rules
CREATE POLICY "Status rules are viewable by staff"
    ON project_status_rules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

CREATE POLICY "Only admins can manage status rules"
    ON project_status_rules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Insert default status workflow rules
INSERT INTO project_status_rules (from_status, to_status, allowed_roles, requires_approval, notification_template) VALUES
('planned', 'in_progress', ARRAY['admin', 'staff'], false, 'Project {{project_name}} has started'),
('in_progress', 'completed', ARRAY['admin', 'staff'], false, 'Project {{project_name}} has been completed'),
('in_progress', 'cancelled', ARRAY['admin'], true, 'Project {{project_name}} has been cancelled'),
('completed', 'archived', ARRAY['admin'], false, 'Project {{project_name}} has been archived'),
('cancelled', 'archived', ARRAY['admin'], false, 'Project {{project_name}} has been archived')
ON CONFLICT (from_status, to_status) DO NOTHING;

-- Create function to calculate project progress from milestones
CREATE OR REPLACE FUNCTION calculate_project_progress(project_uuid UUID)
RETURNS TABLE (
    total_milestones INTEGER,
    completed_milestones INTEGER,
    in_progress_milestones INTEGER,
    delayed_milestones INTEGER,
    overall_progress INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_milestones,
        COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_milestones,
        COUNT(*) FILTER (WHERE status = 'in_progress')::INTEGER as in_progress_milestones,
        COUNT(*) FILTER (WHERE status = 'delayed')::INTEGER as delayed_milestones,
        CASE 
            WHEN COUNT(*) = 0 THEN 0
            ELSE ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)::DECIMAL) * 100)::INTEGER
        END as overall_progress
    FROM milestones 
    WHERE project_id = project_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create function to log project changes
CREATE OR REPLACE FUNCTION log_project_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO project_audit_log (project_id, user_id, action, field_name, old_value, new_value)
        VALUES (NEW.id, auth.uid(), 'status_changed', 'status', OLD.status, NEW.status);
    END IF;
    
    -- Log other important field changes
    IF OLD.name IS DISTINCT FROM NEW.name THEN
        INSERT INTO project_audit_log (project_id, user_id, action, field_name, old_value, new_value)
        VALUES (NEW.id, auth.uid(), 'field_updated', 'name', OLD.name, NEW.name);
    END IF;
    
    IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to THEN
        INSERT INTO project_audit_log (project_id, user_id, action, field_name, old_value, new_value)
        VALUES (NEW.id, auth.uid(), 'team_updated', 'assigned_to', 
                array_to_string(OLD.assigned_to, ','), 
                array_to_string(NEW.assigned_to, ','));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically log project changes
CREATE TRIGGER log_project_changes
    AFTER UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION log_project_change();

-- Create function to validate status transitions
CREATE OR REPLACE FUNCTION validate_status_transition()
RETURNS TRIGGER AS $$
DECLARE
    rule_exists BOOLEAN;
    user_role TEXT;
BEGIN
    -- Get user role
    SELECT role INTO user_role 
    FROM profiles 
    WHERE id = auth.uid();
    
    -- Check if transition is allowed
    SELECT EXISTS(
        SELECT 1 FROM project_status_rules 
        WHERE from_status = OLD.status 
        AND to_status = NEW.status 
        AND user_role = ANY(allowed_roles)
    ) INTO rule_exists;
    
    IF NOT rule_exists THEN
        RAISE EXCEPTION 'Status transition from % to % is not allowed for role %', 
            OLD.status, NEW.status, user_role;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate status transitions
CREATE TRIGGER validate_project_status_transition
    BEFORE UPDATE ON projects
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION validate_status_transition(); 