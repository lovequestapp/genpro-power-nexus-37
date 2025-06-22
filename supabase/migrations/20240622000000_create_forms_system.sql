-- Create forms system tables
-- This migration creates a comprehensive form submission system

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
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES form_definitions(id) ON DELETE CASCADE,
    data JSONB NOT NULL DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'new',
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_analytics table for tracking form performance
CREATE TABLE IF NOT EXISTS form_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID NOT NULL REFERENCES form_definitions(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    submissions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(form_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_definitions_slug ON form_definitions(slug);
CREATE INDEX IF NOT EXISTS idx_form_definitions_is_active ON form_definitions(is_active);
CREATE INDEX IF NOT EXISTS idx_form_analytics_form_id_date ON form_analytics(form_id, date);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_form_definitions_updated_at 
    BEFORE UPDATE ON form_definitions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at 
    BEFORE UPDATE ON form_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_analytics_updated_at 
    BEFORE UPDATE ON form_analytics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default form definitions
INSERT INTO form_definitions (name, slug, description, fields, settings) VALUES
(
    'Contact Form',
    'contact',
    'General contact form for customer inquiries',
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
            "type": "select",
            "label": "Subject",
            "required": true,
            "options": [
                {"value": "general", "label": "General Inquiry"},
                {"value": "support", "label": "Technical Support"},
                {"value": "sales", "label": "Sales Question"},
                {"value": "billing", "label": "Billing Question"}
            ]
        },
        {
            "id": "message",
            "type": "textarea",
            "label": "Message",
            "required": true,
            "placeholder": "Please describe your inquiry...",
            "rows": 5
        }
    ]'::jsonb,
    '{
        "emailNotifications": true,
        "notificationEmail": "admin@hougenpros.com",
        "autoResponse": true,
        "autoResponseSubject": "Thank you for contacting us",
        "autoResponseMessage": "We have received your message and will get back to you soon.",
        "redirectUrl": "/thank-you",
        "successMessage": "Thank you! Your message has been sent successfully."
    }'::jsonb
),
(
    'Quote Request Form',
    'quote-request',
    'Form for customers to request quotes for services',
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
                {"value": "generator_installation", "label": "Generator Installation"},
                {"value": "maintenance", "label": "Maintenance Service"},
                {"value": "repair", "label": "Repair Service"},
                {"value": "emergency_service", "label": "Emergency Service"},
                {"value": "consultation", "label": "Consultation"}
            ]
        },
        {
            "id": "project_description",
            "type": "textarea",
            "label": "Project Description",
            "required": true,
            "placeholder": "Please describe your project requirements...",
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
                {"value": "immediate", "label": "Immediate"},
                {"value": "1_month", "label": "Within 1 month"},
                {"value": "3_months", "label": "Within 3 months"},
                {"value": "6_months", "label": "Within 6 months"},
                {"value": "flexible", "label": "Flexible"}
            ]
        }
    ]'::jsonb,
    '{
        "emailNotifications": true,
        "notificationEmail": "sales@hougenpros.com",
        "autoResponse": true,
        "autoResponseSubject": "Quote Request Received",
        "autoResponseMessage": "Thank you for your quote request. Our sales team will review your requirements and get back to you within 24 hours.",
        "redirectUrl": "/quote-request-received",
        "successMessage": "Thank you! Your quote request has been submitted successfully."
    }'::jsonb
),
(
    'Emergency Service Request',
    'emergency-service',
    'Form for emergency service requests',
    '[
        {
            "id": "name",
            "type": "text",
            "label": "Contact Name",
            "required": true,
            "placeholder": "Enter your full name"
        },
        {
            "id": "phone",
            "type": "tel",
            "label": "Phone Number",
            "required": true,
            "placeholder": "Enter your phone number"
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": false,
            "placeholder": "Enter your email address"
        },
        {
            "id": "emergency_type",
            "type": "select",
            "label": "Emergency Type",
            "required": true,
            "options": [
                {"value": "generator_failure", "label": "Generator Failure"},
                {"value": "power_outage", "label": "Power Outage"},
                {"value": "safety_issue", "label": "Safety Issue"},
                {"value": "equipment_damage", "label": "Equipment Damage"},
                {"value": "other", "label": "Other Emergency"}
            ]
        },
        {
            "id": "location",
            "type": "text",
            "label": "Service Location",
            "required": true,
            "placeholder": "Enter the service address"
        },
        {
            "id": "description",
            "type": "textarea",
            "label": "Emergency Description",
            "required": true,
            "placeholder": "Please describe the emergency situation...",
            "rows": 4
        },
        {
            "id": "urgency",
            "type": "select",
            "label": "Urgency Level",
            "required": true,
            "options": [
                {"value": "critical", "label": "Critical - Immediate Response Needed"},
                {"value": "high", "label": "High - Within 2 hours"},
                {"value": "medium", "label": "Medium - Within 4 hours"},
                {"value": "low", "label": "Low - Within 24 hours"}
            ]
        }
    ]'::jsonb,
    '{
        "emailNotifications": true,
        "notificationEmail": "emergency@hougenpros.com",
        "smsNotifications": true,
        "autoResponse": true,
        "autoResponseSubject": "Emergency Service Request Received",
        "autoResponseMessage": "We have received your emergency service request. Our emergency response team will contact you immediately.",
        "redirectUrl": "/emergency-request-received",
        "successMessage": "Emergency request submitted! Our team will contact you immediately."
    }'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for form_definitions
CREATE POLICY "Form definitions are viewable by everyone" ON form_definitions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Form definitions are manageable by admins" ON form_definitions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create RLS policies for form_submissions
CREATE POLICY "Form submissions are viewable by admins" ON form_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Form submissions can be created by anyone" ON form_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Form submissions are manageable by admins" ON form_submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create RLS policies for form_analytics
CREATE POLICY "Form analytics are viewable by admins" ON form_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Form analytics are manageable by admins" ON form_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create a function to increment form views
CREATE OR REPLACE FUNCTION increment_form_view(form_slug TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO form_analytics (form_id, date, views)
    SELECT fd.id, CURRENT_DATE, 1
    FROM form_definitions fd
    WHERE fd.slug = form_slug AND fd.is_active = true
    ON CONFLICT (form_id, date)
    DO UPDATE SET views = form_analytics.views + 1;
END;
$$ LANGUAGE plpgsql;

-- Create a function to increment form submissions
CREATE OR REPLACE FUNCTION increment_form_submission(form_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO form_analytics (form_id, date, submissions)
    VALUES (form_id, CURRENT_DATE, 1)
    ON CONFLICT (form_id, date)
    DO UPDATE SET submissions = form_analytics.submissions + 1;
    
    -- Update conversion rate
    UPDATE form_analytics 
    SET conversion_rate = CASE 
        WHEN views > 0 THEN (submissions::DECIMAL / views::DECIMAL) * 100
        ELSE 0 
    END
    WHERE form_analytics.form_id = form_id AND form_analytics.date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically increment submissions
CREATE OR REPLACE FUNCTION trigger_increment_submission()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM increment_form_submission(NEW.form_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_form_submission_trigger
    AFTER INSERT ON form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_increment_submission(); 