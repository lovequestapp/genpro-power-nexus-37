import { supabase } from '@/lib/supabase';

// Gmail API configuration
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify';

export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  htmlBody?: string;
  snippet: string;
  date: string;
  isRead: boolean;
  hasAttachments: boolean;
  labels: string[];
  customerId?: string;
}

export interface EmailDraft {
  id?: string;
  subject: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  htmlBody?: string;
  customerId?: string;
  projectId?: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  lastSync: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody: string;
  category: 'customer' | 'project' | 'general' | 'billing';
  isDefault: boolean;
  created_at: string;
}

class EmailService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isAuthenticated = false;

  // Gmail OAuth Authentication
  async authenticateGmail(): Promise<boolean> {
    try {
      const clientId = process.env.REACT_APP_GMAIL_CLIENT_ID || import.meta.env.VITE_GMAIL_CLIENT_ID;
      
      if (!clientId || clientId === 'your-gmail-client-id-here') {
        throw new Error('Gmail OAuth credentials not configured. Please set up REACT_APP_GMAIL_CLIENT_ID in your .env.local file.');
      }
      
      const redirectUri = `${window.location.origin}/admin/email/callback`;
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(GMAIL_SCOPE)}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Open OAuth popup
      const popup = window.open(authUrl, 'gmail-auth', 'width=500,height=600');
      
      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            resolve(false);
          }
        }, 1000);

        // Listen for OAuth callback
        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GMAIL_AUTH_SUCCESS') {
            this.accessToken = event.data.accessToken;
            this.refreshToken = event.data.refreshToken;
            this.isAuthenticated = true;
            this.saveTokens();
            popup?.close();
            clearInterval(checkClosed);
            resolve(true);
          } else if (event.data.type === 'GMAIL_AUTH_ERROR') {
            console.error('Gmail auth error:', event.data.error);
            popup?.close();
            clearInterval(checkClosed);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Gmail authentication error:', error);
      throw error;
    }
  }

  // Handle OAuth callback
  async handleAuthCallback(code: string): Promise<boolean> {
    try {
      const clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_GMAIL_CLIENT_SECRET;
      const redirectUri = `${window.location.origin}/admin/email/callback`;

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId!,
          client_secret: clientSecret!,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.isAuthenticated = true;
        this.saveTokens();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Auth callback error:', error);
      return false;
    }
  }

  // Save tokens to localStorage
  private saveTokens(): void {
    if (this.accessToken) {
      localStorage.setItem('gmail_access_token', this.accessToken);
    }
    if (this.refreshToken) {
      localStorage.setItem('gmail_refresh_token', this.refreshToken);
    }
  }

  // Load tokens from localStorage
  private loadTokens(): void {
    this.accessToken = localStorage.getItem('gmail_access_token');
    this.refreshToken = localStorage.getItem('gmail_refresh_token');
    this.isAuthenticated = !!this.accessToken;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.refreshToken) return false;

      const clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_GMAIL_CLIENT_SECRET;

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: this.refreshToken,
          client_id: clientId!,
          client_secret: clientSecret!,
          grant_type: 'refresh_token',
        }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.saveTokens();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // Make authenticated Gmail API request
  private async makeGmailRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    this.loadTokens();
    
    if (!this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${GMAIL_API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.makeGmailRequest(endpoint, options);
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`Gmail API error: ${response.status}`);
    }

    return response.json();
  }

  // Get email messages
  async getEmails(query: string = '', maxResults: number = 20): Promise<EmailMessage[]> {
    try {
      const q = query ? `&q=${encodeURIComponent(query)}` : '';
      const response = await this.makeGmailRequest(`/messages?maxResults=${maxResults}${q}`);
      
      const messages = await Promise.all(
        response.messages.map(async (msg: any) => {
          const details = await this.makeGmailRequest(`/messages/${msg.id}`);
          return this.parseGmailMessage(details);
        })
      );

      return messages;
    } catch (error) {
      console.error('Error fetching emails:', error);
      return [];
    }
  }

  // Get email by ID
  async getEmail(id: string): Promise<EmailMessage | null> {
    try {
      const response = await this.makeGmailRequest(`/messages/${id}`);
      return this.parseGmailMessage(response);
    } catch (error) {
      console.error('Error fetching email:', error);
      return null;
    }
  }

  // Send email
  async sendEmail(draft: EmailDraft): Promise<boolean> {
    try {
      const message = this.createGmailMessage(draft);
      
      await this.makeGmailRequest('/messages/send', {
        method: 'POST',
        body: JSON.stringify({ raw: message }),
      });

      // Save to database for tracking
      await this.saveEmailToDatabase(draft, 'sent');
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Create draft
  async createDraft(draft: EmailDraft): Promise<string | null> {
    try {
      const message = this.createGmailMessage(draft);
      
      const response = await this.makeGmailRequest('/drafts', {
        method: 'POST',
        body: JSON.stringify({ message: { raw: message } }),
      });

      return response.id;
    } catch (error) {
      console.error('Error creating draft:', error);
      return null;
    }
  }

  // Send email to customer
  async sendEmailToCustomer(customerId: string, subject: string, body: string, projectId?: string): Promise<boolean> {
    try {
      // Get customer email
      const { data: customer } = await supabase
        .from('customers')
        .select('email, name')
        .eq('id', customerId)
        .single();

      if (!customer) {
        throw new Error('Customer not found');
      }

      const draft: EmailDraft = {
        subject,
        to: [customer.email],
        body,
        customerId,
        projectId,
      };

      const success = await this.sendEmail(draft);
      
      if (success) {
        // Log communication
        await this.logCustomerCommunication(customerId, 'email', subject, projectId);
      }

      return success;
    } catch (error) {
      console.error('Error sending email to customer:', error);
      return false;
    }
  }

  // Get email templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  }

  // Save email template
  async saveEmailTemplate(template: Omit<EmailTemplate, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_templates')
        .insert([template]);

      return !error;
    } catch (error) {
      console.error('Error saving email template:', error);
      return false;
    }
  }

  // Get customer communication history
  async getCustomerCommunications(customerId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customer communications:', error);
      return [];
    }
  }

  // Log customer communication
  private async logCustomerCommunication(
    customerId: string, 
    type: string, 
    subject: string, 
    projectId?: string
  ): Promise<void> {
    try {
      await supabase
        .from('customer_communications')
        .insert([{
          customer_id: customerId,
          type,
          subject,
          project_id: projectId,
          created_at: new Date().toISOString(),
        }]);
    } catch (error) {
      console.error('Error logging communication:', error);
    }
  }

  // Save email to database
  private async saveEmailToDatabase(draft: EmailDraft, status: string): Promise<void> {
    try {
      await supabase
        .from('emails')
        .insert([{
          subject: draft.subject,
          to: draft.to.join(', '),
          body: draft.body,
          customer_id: draft.customerId,
          project_id: draft.projectId,
          status,
          sent_at: new Date().toISOString(),
        }]);
    } catch (error) {
      console.error('Error saving email to database:', error);
    }
  }

  // Parse Gmail message
  private parseGmailMessage(gmailMessage: any): EmailMessage {
    const headers = gmailMessage.payload.headers;
    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';

    const body = this.extractBody(gmailMessage.payload);
    
    return {
      id: gmailMessage.id,
      threadId: gmailMessage.threadId,
      subject: getHeader('Subject'),
      from: getHeader('From'),
      to: getHeader('To').split(',').map((email: string) => email.trim()),
      cc: getHeader('Cc') ? getHeader('Cc').split(',').map((email: string) => email.trim()) : undefined,
      body: body.text || '',
      htmlBody: body.html,
      snippet: gmailMessage.snippet,
      date: getHeader('Date'),
      isRead: !gmailMessage.labelIds.includes('UNREAD'),
      hasAttachments: gmailMessage.payload.parts?.some((part: any) => part.filename) || false,
      labels: gmailMessage.labelIds || [],
    };
  }

  // Extract email body
  private extractBody(payload: any): { text?: string; html?: string } {
    if (payload.body.data) {
      const decoded = atob(payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
      return { text: decoded };
    }

    if (payload.parts) {
      const textPart = payload.parts.find((part: any) => part.mimeType === 'text/plain');
      const htmlPart = payload.parts.find((part: any) => part.mimeType === 'text/html');

      return {
        text: textPart?.body?.data ? atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/')) : undefined,
        html: htmlPart?.body?.data ? atob(htmlPart.body.data.replace(/-/g, '+').replace(/_/g, '/')) : undefined,
      };
    }

    return {};
  }

  // Create Gmail message format
  private createGmailMessage(draft: EmailDraft): string {
    const lines = [
      `From: ${this.getCurrentUserEmail()}`,
      `To: ${draft.to.join(', ')}`,
      ...(draft.cc ? [`Cc: ${draft.cc.join(', ')}`] : []),
      ...(draft.bcc ? [`Bcc: ${draft.bcc.join(', ')}`] : []),
      `Subject: ${draft.subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      draft.htmlBody || draft.body,
    ];

    return btoa(lines.join('\r\n')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  // Get current user email
  private getCurrentUserEmail(): string {
    // This would be retrieved from the authenticated user
    return 'your-email@gmail.com';
  }

  // Check authentication status
  checkAuthentication(): boolean {
    this.loadTokens();
    return this.isAuthenticated;
  }

  // Sign out
  signOut(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.isAuthenticated = false;
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_refresh_token');
  }

  // Get authentication status
  getAuthStatus(): { isAuthenticated: boolean; email?: string } {
    this.loadTokens();
    return {
      isAuthenticated: this.isAuthenticated,
      email: this.isAuthenticated ? this.getCurrentUserEmail() : undefined,
    };
  }
}

export const emailService = new EmailService(); 