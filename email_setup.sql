-- Email Integration Setup Script
-- Run this in your Supabase SQL Editor

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  html_body TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('customer', 'project', 'general', 'billing')),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_communications table
CREATE TABLE IF NOT EXISTS customer_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'phone', 'sms', 'meeting')),
  subject VARCHAR(500),
  content TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create emails table for tracking sent emails
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject VARCHAR(500) NOT NULL,
  to_addresses TEXT NOT NULL,
  cc_addresses TEXT,
  bcc_addresses TEXT,
  body TEXT NOT NULL,
  html_body TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  gmail_message_id VARCHAR(255),
  thread_id VARCHAR(255)
);

-- Create email_accounts table for managing multiple email accounts
CREATE TABLE IF NOT EXISTS email_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_project_id ON customer_communications(project_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_created_at ON customer_communications(created_at);
CREATE INDEX IF NOT EXISTS idx_emails_customer_id ON emails(customer_id);
CREATE INDEX IF NOT EXISTS idx_emails_project_id ON emails(project_id);
CREATE INDEX IF NOT EXISTS idx_emails_sent_at ON emails(sent_at);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_email_accounts_email ON email_accounts(email);
CREATE INDEX IF NOT EXISTS idx_email_accounts_is_active ON email_accounts(is_active);

-- Create RLS policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;

-- Email templates policies
CREATE POLICY "Users can view email templates" ON email_templates
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage email templates" ON email_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- Customer communications policies
CREATE POLICY "Users can view customer communications" ON customer_communications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create customer communications" ON customer_communications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update customer communications" ON customer_communications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Emails policies
CREATE POLICY "Users can view emails" ON emails
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can create emails" ON emails
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update emails" ON emails
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Email accounts policies
CREATE POLICY "Users can view email accounts" ON email_accounts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage email accounts" ON email_accounts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default email templates
INSERT INTO email_templates (name, subject, body, html_body, category, is_default) VALUES
(
  'Project Update',
  'Project Update - {{project_name}}',
  'Dear {{customer_name}},

We wanted to provide you with an update on your project {{project_name}}.

Current Status: {{project_status}}
Progress: {{project_progress}}%

{{project_notes}}

If you have any questions or concerns, please don''t hesitate to contact us.

Best regards,
{{company_name}} Team',
  '<p>Dear {{customer_name}},</p>
<p>We wanted to provide you with an update on your project <strong>{{project_name}}</strong>.</p>
<p><strong>Current Status:</strong> {{project_status}}<br>
<strong>Progress:</strong> {{project_progress}}%</p>
<p>{{project_notes}}</p>
<p>If you have any questions or concerns, please don''t hesitate to contact us.</p>
<p>Best regards,<br>
<strong>{{company_name}} Team</strong></p>',
  'project',
  true
),
(
  'Invoice Reminder',
  'Invoice Reminder - {{invoice_number}}',
  'Dear {{customer_name}},

This is a friendly reminder that invoice {{invoice_number}} for {{invoice_amount}} is due on {{due_date}}.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Amount Due: {{invoice_amount}}
- Due Date: {{due_date}}

You can view and pay your invoice by logging into your account or clicking the payment link below.

If you have already made payment, please disregard this message.

Thank you for your business.

Best regards,
{{company_name}} Team',
  '<p>Dear {{customer_name}},</p>
<p>This is a friendly reminder that invoice <strong>{{invoice_number}}</strong> for <strong>{{invoice_amount}}</strong> is due on <strong>{{due_date}}</strong>.</p>
<p><strong>Invoice Details:</strong></p>
<ul>
<li>Invoice Number: {{invoice_number}}</li>
<li>Amount Due: {{invoice_amount}}</li>
<li>Due Date: {{due_date}}</li>
</ul>
<p>You can view and pay your invoice by logging into your account or clicking the payment link below.</p>
<p>If you have already made payment, please disregard this message.</p>
<p>Thank you for your business.</p>
<p>Best regards,<br>
<strong>{{company_name}} Team</strong></p>',
  'billing',
  true
),
(
  'Welcome Email',
  'Welcome to {{company_name}}',
  'Dear {{customer_name}},

Welcome to {{company_name}}! We''re excited to have you as a customer.

Our team is committed to providing you with the best service and support for all your generator needs.

If you have any questions or need assistance, please don''t hesitate to reach out to us.

Best regards,
{{company_name}} Team',
  '<p>Dear {{customer_name}},</p>
<p>Welcome to <strong>{{company_name}}</strong>! We''re excited to have you as a customer.</p>
<p>Our team is committed to providing you with the best service and support for all your generator needs.</p>
<p>If you have any questions or need assistance, please don''t hesitate to reach out to us.</p>
<p>Best regards,<br>
<strong>{{company_name}} Team</strong></p>',
  'customer',
  true
),
(
  'General Inquiry Response',
  'Thank you for your inquiry',
  'Dear {{customer_name}},

Thank you for reaching out to {{company_name}}. We have received your inquiry and will get back to you as soon as possible.

In the meantime, if you have any urgent questions, please don''t hesitate to contact us.

Best regards,
{{company_name}} Team',
  '<p>Dear {{customer_name}},</p>
<p>Thank you for reaching out to <strong>{{company_name}}</strong>. We have received your inquiry and will get back to you as soon as possible.</p>
<p>In the meantime, if you have any urgent questions, please don''t hesitate to contact us.</p>
<p>Best regards,<br>
<strong>{{company_name}} Team</strong></p>',
  'general',
  true
);

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_accounts_updated_at BEFORE UPDATE ON email_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Email tables created successfully!' as status; 