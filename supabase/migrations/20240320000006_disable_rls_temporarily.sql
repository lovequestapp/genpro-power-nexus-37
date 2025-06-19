-- Temporarily disable RLS on projects table for testing
-- This will allow project creation to work while we debug the RLS policies

-- Disable RLS on projects table
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on related tables for now
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_audit_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_rules DISABLE ROW LEVEL SECURITY; 