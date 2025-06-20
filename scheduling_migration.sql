-- Scheduling System Database Migration
-- This creates all tables needed for the comprehensive scheduling system

-- Schedule Events Table
CREATE TABLE IF NOT EXISTS schedule_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    location VARCHAR(500),
    event_type VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (event_type IN ('project', 'meeting', 'appointment', 'reminder', 'task', 'other')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    color VARCHAR(7),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    technician_ids UUID[],
    recurring_pattern JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    external_calendar_id VARCHAR(255),
    sync_status VARCHAR(20) DEFAULT 'local' CHECK (sync_status IN ('local', 'synced', 'pending_sync', 'sync_failed'))
);

-- Reminders Table
CREATE TABLE IF NOT EXISTS event_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES schedule_events(id) ON DELETE CASCADE,
    reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_type VARCHAR(20) NOT NULL DEFAULT 'desktop' CHECK (reminder_type IN ('email', 'push', 'sms', 'desktop')),
    sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Attachments Table
CREATE TABLE IF NOT EXISTS event_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES schedule_events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(100),
    size BIGINT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar Integrations Table
CREATE TABLE IF NOT EXISTS calendar_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('google', 'outlook', 'apple', 'ical', 'other')),
    enabled BOOLEAN DEFAULT TRUE,
    sync_direction VARCHAR(20) NOT NULL DEFAULT 'bidirectional' CHECK (sync_direction IN ('import', 'export', 'bidirectional')),
    last_sync TIMESTAMP WITH TIME ZONE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule Conflicts Table
CREATE TABLE IF NOT EXISTS schedule_conflicts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES schedule_events(id) ON DELETE CASCADE,
    conflicting_events UUID[] NOT NULL,
    conflict_type VARCHAR(50) NOT NULL CHECK (conflict_type IN ('time_overlap', 'resource_conflict', 'location_conflict')),
    severity VARCHAR(20) NOT NULL DEFAULT 'warning' CHECK (severity IN ('warning', 'error')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_start_time ON schedule_events(start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_events_end_time ON schedule_events(end_time);
CREATE INDEX IF NOT EXISTS idx_schedule_events_project_id ON schedule_events(project_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_customer_id ON schedule_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_event_type ON schedule_events(event_type);
CREATE INDEX IF NOT EXISTS idx_schedule_events_status ON schedule_events(status);
CREATE INDEX IF NOT EXISTS idx_schedule_events_priority ON schedule_events(priority);
CREATE INDEX IF NOT EXISTS idx_schedule_events_technician_ids ON schedule_events USING GIN(technician_ids);
CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_reminder_time ON event_reminders(reminder_time);
CREATE INDEX IF NOT EXISTS idx_event_attachments_event_id ON event_attachments(event_id);
CREATE INDEX IF NOT EXISTS idx_schedule_conflicts_event_id ON schedule_conflicts(event_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_schedule_events_updated_at BEFORE UPDATE ON schedule_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_integrations_updated_at BEFORE UPDATE ON calendar_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample calendar integration
INSERT INTO calendar_integrations (name, type, enabled, sync_direction, settings) VALUES
('Local Calendar', 'ical', true, 'bidirectional', '{"path": "/tmp/local_calendar.ics", "auto_sync": true}'),
('Google Calendar', 'google', false, 'bidirectional', '{"api_key": "", "calendar_id": ""}'),
('Outlook Calendar', 'outlook', false, 'bidirectional', '{"client_id": "", "tenant_id": ""}');

-- Insert sample schedule events
INSERT INTO schedule_events (title, description, start_time, end_time, all_day, location, event_type, priority, color, project_id) VALUES
('Project Planning Meeting', 'Weekly project planning and review session', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '1 hour', false, 'Conference Room A', 'meeting', 'high', '#3B82F6', NULL),
('Site Inspection', 'Inspect generator installation site', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', false, 'Client Site - Downtown', 'appointment', 'medium', '#10B981', NULL),
('Equipment Maintenance', 'Routine maintenance on backup generators', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '4 hours', false, 'Warehouse', 'task', 'medium', '#F59E0B', NULL),
('Client Consultation', 'Discuss new generator requirements', NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '1.5 hours', false, 'Office', 'appointment', 'high', '#EF4444', NULL),
('Team Training', 'Safety training for new technicians', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', false, 'Training Room', 'meeting', 'medium', '#8B5CF6', NULL);

-- Insert sample reminders
INSERT INTO event_reminders (event_id, reminder_time, reminder_type) 
SELECT id, start_time - INTERVAL '30 minutes', 'desktop' 
FROM schedule_events 
WHERE event_type IN ('meeting', 'appointment');

-- Create a function to check for schedule conflicts
CREATE OR REPLACE FUNCTION check_schedule_conflicts()
RETURNS TRIGGER AS $$
DECLARE
    conflicting_event RECORD;
    conflict_count INTEGER := 0;
BEGIN
    -- Check for time overlaps with the same technicians
    FOR conflicting_event IN 
        SELECT id, title 
        FROM schedule_events 
        WHERE id != NEW.id 
        AND status != 'cancelled'
        AND (
            (start_time < NEW.end_time AND end_time > NEW.start_time)
            OR (NEW.start_time < end_time AND NEW.end_time > start_time)
        )
        AND (
            NEW.technician_ids IS NULL 
            OR technician_ids IS NULL 
            OR NEW.technician_ids && technician_ids
        )
    LOOP
        conflict_count := conflict_count + 1;
        
        -- Insert conflict record
        INSERT INTO schedule_conflicts (event_id, conflicting_events, conflict_type, severity, message)
        VALUES (
            NEW.id,
            ARRAY[conflicting_event.id],
            'time_overlap',
            CASE WHEN conflict_count = 1 THEN 'warning' ELSE 'error' END,
            'Time conflict with event: ' || conflicting_event.title
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for conflict detection
CREATE TRIGGER check_conflicts_trigger 
    AFTER INSERT OR UPDATE ON schedule_events 
    FOR EACH ROW EXECUTE FUNCTION check_schedule_conflicts();

-- Create a function to generate recurring events
CREATE OR REPLACE FUNCTION generate_recurring_events()
RETURNS TRIGGER AS $$
DECLARE
    pattern JSONB;
    current_event_date DATE;
    end_date DATE;
    interval_days INTEGER;
    day_of_week INTEGER;
    day_of_month INTEGER;
    month_of_year INTEGER;
    occurrences INTEGER;
    max_occurrences INTEGER;
BEGIN
    -- Only process if there's a recurring pattern
    IF NEW.recurring_pattern IS NULL THEN
        RETURN NEW;
    END IF;
    
    pattern := NEW.recurring_pattern;
    current_event_date := DATE(NEW.start_time);
    
    -- Get pattern details
    interval_days := COALESCE((pattern->>'interval')::INTEGER, 1);
    end_date := COALESCE((pattern->>'end_date')::DATE, current_event_date + INTERVAL '1 year');
    max_occurrences := COALESCE((pattern->>'occurrences')::INTEGER, 52);
    occurrences := 0;
    
    -- Generate recurring events based on pattern type
    CASE pattern->>'type'
        WHEN 'daily' THEN
            WHILE current_event_date <= end_date AND occurrences < max_occurrences LOOP
                current_event_date := current_event_date + (interval_days || ' days')::INTERVAL;
                occurrences := occurrences + 1;
                
                -- Insert recurring event
                INSERT INTO schedule_events (
                    title, description, start_time, end_time, all_day, location,
                    event_type, priority, color, project_id, customer_id, technician_ids,
                    notes, created_by, external_calendar_id, sync_status
                ) VALUES (
                    NEW.title, NEW.description, 
                    current_event_date + (NEW.start_time::TIME), 
                    current_event_date + (NEW.end_time::TIME),
                    NEW.all_day, NEW.location, NEW.event_type, NEW.priority, NEW.color,
                    NEW.project_id, NEW.customer_id, NEW.technician_ids, NEW.notes,
                    NEW.created_by, NEW.external_calendar_id, 'local'
                );
            END LOOP;
            
        WHEN 'weekly' THEN
            day_of_week := COALESCE((pattern->'days_of_week'->0)::INTEGER, EXTRACT(DOW FROM current_event_date));
            WHILE current_event_date <= end_date AND occurrences < max_occurrences LOOP
                current_event_date := current_event_date + (interval_days * 7 || ' days')::INTERVAL;
                occurrences := occurrences + 1;
                
                INSERT INTO schedule_events (
                    title, description, start_time, end_time, all_day, location,
                    event_type, priority, color, project_id, customer_id, technician_ids,
                    notes, created_by, external_calendar_id, sync_status
                ) VALUES (
                    NEW.title, NEW.description, 
                    current_event_date + (NEW.start_time::TIME), 
                    current_event_date + (NEW.end_time::TIME),
                    NEW.all_day, NEW.location, NEW.event_type, NEW.priority, NEW.color,
                    NEW.project_id, NEW.customer_id, NEW.technician_ids, NEW.notes,
                    NEW.created_by, NEW.external_calendar_id, 'local'
                );
            END LOOP;
            
        WHEN 'monthly' THEN
            day_of_month := COALESCE((pattern->>'day_of_month')::INTEGER, EXTRACT(DAY FROM current_event_date));
            WHILE current_event_date <= end_date AND occurrences < max_occurrences LOOP
                current_event_date := current_event_date + (interval_days || ' months')::INTERVAL;
                occurrences := occurrences + 1;
                
                INSERT INTO schedule_events (
                    title, description, start_time, end_time, all_day, location,
                    event_type, priority, color, project_id, customer_id, technician_ids,
                    notes, created_by, external_calendar_id, sync_status
                ) VALUES (
                    NEW.title, NEW.description, 
                    current_event_date + (NEW.start_time::TIME), 
                    current_event_date + (NEW.end_time::TIME),
                    NEW.all_day, NEW.location, NEW.event_type, NEW.priority, NEW.color,
                    NEW.project_id, NEW.customer_id, NEW.technician_ids, NEW.notes,
                    NEW.created_by, NEW.external_calendar_id, 'local'
                );
            END LOOP;
    END CASE;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for recurring events
CREATE TRIGGER generate_recurring_events_trigger 
    AFTER INSERT ON schedule_events 
    FOR EACH ROW EXECUTE FUNCTION generate_recurring_events(); 