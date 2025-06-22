-- Forms System Database Setup
-- This script creates all necessary tables for the forms system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create form_definitions table
CREATE TABLE IF NOT EXISTS form_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    fields JSONB NOT NULL DEFAULT '[]',
    settings JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES form_definitions(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'pending',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_analytics table
CREATE TABLE IF NOT EXISTS form_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES form_definitions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_definitions_slug ON form_definitions(slug);
CREATE INDEX IF NOT EXISTS idx_form_definitions_active ON form_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_analytics_form_id ON form_analytics(form_id);
CREATE INDEX IF NOT EXISTS idx_form_analytics_event_type ON form_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_form_analytics_created_at ON form_analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_form_definitions_updated_at ON form_definitions;
CREATE TRIGGER update_form_definitions_updated_at
    BEFORE UPDATE ON form_definitions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_form_submissions_updated_at ON form_submissions;
CREATE TRIGGER update_form_submissions_updated_at
    BEFORE UPDATE ON form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for form_definitions
DROP POLICY IF EXISTS "Form definitions are viewable by everyone" ON form_definitions;
CREATE POLICY "Form definitions are viewable by everyone" ON form_definitions
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Form definitions are manageable by authenticated users" ON form_definitions;
CREATE POLICY "Form definitions are manageable by authenticated users" ON form_definitions
    FOR ALL USING (auth.role() = 'authenticated');

-- Create RLS policies for form_submissions
DROP POLICY IF EXISTS "Form submissions are viewable by authenticated users" ON form_submissions;
CREATE POLICY "Form submissions are viewable by authenticated users" ON form_submissions
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Form submissions can be created by anyone" ON form_submissions;
CREATE POLICY "Form submissions can be created by anyone" ON form_submissions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Form submissions are manageable by authenticated users" ON form_submissions;
CREATE POLICY "Form submissions are manageable by authenticated users" ON form_submissions
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Form submissions are deletable by authenticated users" ON form_submissions;
CREATE POLICY "Form submissions are deletable by authenticated users" ON form_submissions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create RLS policies for form_analytics
DROP POLICY IF EXISTS "Form analytics are viewable by authenticated users" ON form_analytics;
CREATE POLICY "Form analytics are viewable by authenticated users" ON form_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Form analytics can be created by anyone" ON form_analytics;
CREATE POLICY "Form analytics can be created by anyone" ON form_analytics
    FOR INSERT WITH CHECK (true);

-- Insert default form definitions for Contact and Get Quote forms
INSERT INTO form_definitions (name, slug, description, fields, settings) VALUES
(
    'Contact Form',
    'contact',
    'Default contact form for website inquiries',
    '[
        {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": true,
            "placeholder": "Enter your email address"
        },
        {
            "id": "phone",
            "type": "tel",
            "label": "Phone Number",
            "required": false,
            "placeholder": "Enter your phone number"
        },
        {
            "id": "subject",
            "type": "text",
            "label": "Subject",
            "required": true,
            "placeholder": "Enter subject"
        },
        {
            "id": "message",
            "type": "textarea",
            "label": "Message",
            "required": true,
            "placeholder": "Enter your message",
            "rows": 5
        }
    ]'::jsonb,
    '{
        "emailNotifications": true,
        "notificationEmail": "admin@genpro.com",
        "autoResponse": true,
        "autoResponseSubject": "Thank you for contacting us",
        "autoResponseMessage": "We have received your message and will get back to you soon."
    }'::jsonb
),
(
    'Get Quote Form',
    'get-quote',
    'Quote request form for potential customers',
    '[
        {
            "id": "name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": true,
            "placeholder": "Enter your email address"
        },
        {
            "id": "phone",
            "type": "tel",
            "label": "Phone Number",
            "required": true,
            "placeholder": "Enter your phone number"
        },
        {
            "id": "company",
            "type": "text",
            "label": "Company Name",
            "required": false,
            "placeholder": "Enter your company name"
        },
        {
            "id": "service_type",
            "type": "select",
            "label": "Service Type",
            "required": true,
            "options": [
                {"value": "electrical", "label": "Electrical Services"},
                {"value": "plumbing", "label": "Plumbing Services"},
                {"value": "hvac", "label": "HVAC Services"},
                {"value": "maintenance", "label": "Maintenance Services"},
                {"value": "other", "label": "Other Services"}
            ]
        },
        {
            "id": "project_description",
            "type": "textarea",
            "label": "Project Description",
            "required": true,
            "placeholder": "Please describe your project requirements",
            "rows": 4
        },
        {
            "id": "budget_range",
            "type": "select",
            "label": "Budget Range",
            "required": false,
            "options": [
                {"value": "under_5k", "label": "Under $5,000"},
                {"value": "5k_10k", "label": "$5,000 - $10,000"},
                {"value": "10k_25k", "label": "$10,000 - $25,000"},
                {"value": "25k_50k", "label": "$25,000 - $50,000"},
                {"value": "over_50k", "label": "Over $50,000"}
            ]
        },
        {
            "id": "timeline",
            "type": "select",
            "label": "Project Timeline",
            "required": false,
            "options": [
                {"value": "asap", "label": "ASAP"},
                {"value": "1_month", "label": "Within 1 month"},
                {"value": "3_months", "label": "Within 3 months"},
                {"value": "6_months", "label": "Within 6 months"},
                {"value": "flexible", "label": "Flexible"}
            ]
        }
    ]'::jsonb,
    '{
        "emailNotifications": true,
        "notificationEmail": "sales@genpro.com",
        "autoResponse": true,
        "autoResponseSubject": "Quote Request Received",
        "autoResponseMessage": "Thank you for your quote request. Our team will review your requirements and get back to you within 24-48 hours."
    }'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Create a function to get form submission statistics
CREATE OR REPLACE FUNCTION get_form_submission_stats()
RETURNS TABLE (
    total_submissions BIGINT,
    pending_submissions BIGINT,
    processed_submissions BIGINT,
    today_submissions BIGINT,
    this_week_submissions BIGINT,
    this_month_submissions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_submissions,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_submissions,
        COUNT(*) FILTER (WHERE status = 'processed') as processed_submissions,
        COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as today_submissions,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as this_week_submissions,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as this_month_submissions
    FROM form_submissions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get form analytics statistics
CREATE OR REPLACE FUNCTION get_form_analytics_stats()
RETURNS TABLE (
    total_views BIGINT,
    total_submissions BIGINT,
    conversion_rate NUMERIC,
    today_views BIGINT,
    today_submissions BIGINT,
    this_week_views BIGINT,
    this_week_submissions BIGINT,
    this_month_views BIGINT,
    this_month_submissions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH analytics AS (
        SELECT 
            COUNT(*) FILTER (WHERE event_type = 'view') as total_views,
            COUNT(*) FILTER (WHERE event_type = 'submission') as total_submissions,
            COUNT(*) FILTER (WHERE event_type = 'view' AND DATE(created_at) = CURRENT_DATE) as today_views,
            COUNT(*) FILTER (WHERE event_type = 'submission' AND DATE(created_at) = CURRENT_DATE) as today_submissions,
            COUNT(*) FILTER (WHERE event_type = 'view' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)) as this_week_views,
            COUNT(*) FILTER (WHERE event_type = 'submission' AND created_at >= DATE_TRUNC('week', CURRENT_DATE)) as this_week_submissions,
            COUNT(*) FILTER (WHERE event_type = 'view' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) as this_month_views,
            COUNT(*) FILTER (WHERE event_type = 'submission' AND created_at >= DATE_TRUNC('month', CURRENT_DATE)) as this_month_submissions
        FROM form_analytics
    )
    SELECT 
        total_views,
        total_submissions,
        CASE 
            WHEN total_views > 0 THEN ROUND((total_submissions::NUMERIC / total_views) * 100, 2)
            ELSE 0 
        END as conversion_rate,
        today_views,
        today_submissions,
        this_week_views,
        this_week_submissions,
        this_month_views,
        this_month_submissions
    FROM analytics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 