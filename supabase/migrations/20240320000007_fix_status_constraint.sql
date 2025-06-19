-- Fix the status check constraint on projects table
-- The current constraint doesn't match the expected status values

-- First, let's see what the current constraint allows
-- Then update it to match the expected values: 'planned', 'in_progress', 'completed', 'cancelled', 'archived'

-- Drop the existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the correct constraint
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled', 'archived'));

-- Also fix the generator_status constraint if it exists
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_generator_status_check;

-- Add the correct generator_status constraint
ALTER TABLE projects ADD CONSTRAINT projects_generator_status_check 
CHECK (generator_status IN ('none', 'pending', 'installed', 'maintenance')); 