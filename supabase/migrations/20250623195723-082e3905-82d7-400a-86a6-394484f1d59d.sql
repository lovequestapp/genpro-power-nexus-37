
-- Create table for project checklists
CREATE TABLE public.project_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    checklist_type TEXT NOT NULL DEFAULT 'generator_placement',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id),
    updated_by UUID REFERENCES profiles(id)
);

-- Create table for checklist items
CREATE TABLE public.checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id UUID NOT NULL REFERENCES project_checklists(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    requirement TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    notes TEXT,
    verified_by UUID REFERENCES profiles(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_project_checklists_project_id ON project_checklists(project_id);
CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_checklist_items_order ON checklist_items(order_index);

-- Enable RLS
ALTER TABLE project_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for project_checklists
CREATE POLICY "Users can view checklists for accessible projects" ON project_checklists
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Users can create checklists for accessible projects" ON project_checklists
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Users can update checklists for accessible projects" ON project_checklists
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects p 
            WHERE p.id = project_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

-- RLS policies for checklist_items
CREATE POLICY "Users can view checklist items for accessible projects" ON checklist_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_checklists pc
            JOIN projects p ON p.id = pc.project_id
            WHERE pc.id = checklist_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Users can create checklist items for accessible projects" ON checklist_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM project_checklists pc
            JOIN projects p ON p.id = pc.project_id
            WHERE pc.id = checklist_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

CREATE POLICY "Users can update checklist items for accessible projects" ON checklist_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM project_checklists pc
            JOIN projects p ON p.id = pc.project_id
            WHERE pc.id = checklist_id 
            AND (
                p.owner_id = auth.uid() OR
                p.assigned_to @> ARRAY[auth.uid()] OR
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE id = auth.uid() AND role IN ('admin', 'staff')
                )
            )
        )
    );

-- Create trigger to update updated_at timestamps
CREATE TRIGGER update_project_checklists_updated_at
    BEFORE UPDATE ON project_checklists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at
    BEFORE UPDATE ON checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default generator placement checklist items
INSERT INTO project_checklists (project_id, checklist_type, created_by) 
SELECT id, 'generator_placement', owner_id 
FROM projects 
WHERE NOT EXISTS (
    SELECT 1 FROM project_checklists 
    WHERE project_id = projects.id AND checklist_type = 'generator_placement'
);

-- Insert the checklist items based on the uploaded document
WITH checklist_data AS (
    SELECT 
        pc.id as checklist_id,
        unnest(ARRAY[
            'Distance from House',
            'Front & Side Clearance', 
            'Window/Door Clearance',
            'Top Clearance',
            'Gas Meter Clearance',
            'AC or Pool Equipment Clearance',
            'Property Line Setback',
            'Noise Ordinance',
            'Concrete/Composite Pad',
            'Accessible for Maintenance',
            'Not in Easement Area',
            'Drainage',
            'Not in Front Yard (if restricted)',
            'Fence/Shrub Screening'
        ]) as rule_name,
        unnest(ARRAY[
            'Minimum 18 inches',
            '3 feet (all open/maintenance sides)',
            '5 feet from operable windows or doors',
            'No overhangs, decks, or coverings',
            'At least 3 feet away',
            'At least 3 feet away',
            'Min 3-5 feet, confirm with city code',
            'Typically <70 dBA at property line',
            'Level and per manufacturer specs',
            'Clear access required on service panel side',
            'Verify using recorded plat or survey',
            'Do not block or sit in water flow paths',
            'Many cities prohibit this — check local ordinance',
            'Required by some HOAs or city codes for visual impact'
        ]) as requirement,
        unnest(ARRAY[1,2,3,4,5,6,7,8,9,10,11,12,13,14]) as order_index
    FROM project_checklists pc
    WHERE pc.checklist_type = 'generator_placement'
)
INSERT INTO checklist_items (checklist_id, rule_name, requirement, order_index)
SELECT checklist_id, rule_name, requirement, order_index
FROM checklist_data
ON CONFLICT DO NOTHING;
