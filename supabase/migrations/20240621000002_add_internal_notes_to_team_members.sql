-- Add internal_notes column to team_members table
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS internal_notes TEXT; 