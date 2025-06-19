-- Fix RLS policies for projects table
-- This migration updates the RLS policies to allow proper project creation

-- Drop existing policies
DROP POLICY IF EXISTS "Projects are viewable by owner, assigned team members, and staff" ON projects;
DROP POLICY IF EXISTS "Users can create projects" ON projects;
DROP POLICY IF EXISTS "Project owners and staff can update projects" ON projects;
DROP POLICY IF EXISTS "Only admins can delete projects" ON projects;

-- Create more permissive RLS policies for projects
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

CREATE POLICY "Authenticated users can create projects"
    ON projects FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND
        auth.role() = 'authenticated'
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

-- Also fix the RLS policies for milestones, audit log, and status rules
-- Drop existing policies
DROP POLICY IF EXISTS "Milestones are viewable by project team members" ON milestones;
DROP POLICY IF EXISTS "Staff can create and update milestones" ON milestones;
DROP POLICY IF EXISTS "Project audit log is viewable by project team members" ON project_audit_log;
DROP POLICY IF EXISTS "Staff can insert audit log entries" ON project_audit_log;
DROP POLICY IF EXISTS "Status rules are viewable by staff" ON project_status_rules;
DROP POLICY IF EXISTS "Only admins can manage status rules" ON project_status_rules;

-- Create more permissive RLS policies for milestones
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

CREATE POLICY "Authenticated users can create and update milestones"
    ON milestones FOR ALL
    USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Create more permissive RLS policies for project audit log
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

CREATE POLICY "Authenticated users can insert audit log entries"
    ON project_audit_log FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('admin', 'staff')
        )
    );

-- Create more permissive RLS policies for project status rules
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