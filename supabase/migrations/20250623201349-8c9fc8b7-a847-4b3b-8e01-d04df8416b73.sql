
-- Add the missing updated_by column to checklist_items table
ALTER TABLE checklist_items ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id);
