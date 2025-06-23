import { supabase } from '@/lib/supabase';

export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  zipCode: string;
  serviceType: string;
  generatorType?: string;
  powerRequirements?: string;
  fuelType?: string;
  installationType?: string;
  projectDescription: string;
  budgetRange?: string;
  timeline?: string;
  emergencyService: boolean;
  maintenancePlan: boolean;
  financing: boolean;
  preferredContact?: string;
  additionalNotes?: string;
}

export interface QuoteResponse {
  id: string;
  status: 'pending' | 'reviewed' | 'sent' | 'accepted' | 'rejected';
  estimatedCost?: number;
  estimatedTimeline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class QuoteService {
  static async submitQuoteRequest(quoteData: QuoteRequest): Promise<QuoteResponse> {
    try {
      // First, try to save to the forms system if available
      try {
        const { data: formSubmission, error: formError } = await supabase
          .from('form_submissions')
          .insert([{
            form_slug: 'quote-request',
            data: quoteData,
            status: 'new'
          }])
          .select()
          .single();

        if (!formError && formSubmission) {
          console.log('Quote saved to forms system:', formSubmission);
        }
      } catch (error) {
        console.warn('Forms system not available, saving to quotes table:', error);
      }

      // Save to dedicated quotes table
      const { data, error } = await supabase
        .from('quotes')
        .insert([{
          ...quoteData,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        // If quotes table doesn't exist, create a fallback
        if (error.code === 'PGRST116') {
          console.warn('Quotes table does not exist, using fallback storage');
          return this.fallbackQuoteStorage(quoteData);
        }
        throw error;
      }

      // Send email notification
      await this.sendQuoteNotification(quoteData);

      return data;
    } catch (error) {
      console.error('Error submitting quote request:', error);
      throw new Error('Failed to submit quote request. Please try again or contact us directly.');
    }
  }

  private static async fallbackQuoteStorage(quoteData: QuoteRequest): Promise<QuoteResponse> {
    // Store in localStorage as fallback
    const quotes = JSON.parse(localStorage.getItem('pending_quotes') || '[]');
    const quote = {
      id: `local_${Date.now()}`,
      ...quoteData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    quotes.push(quote);
    localStorage.setItem('pending_quotes', JSON.stringify(quotes));
    
    // Send email notification
    await this.sendQuoteNotification(quoteData);
    
    return quote;
  }

  private static async sendQuoteNotification(quoteData: QuoteRequest): Promise<void> {
    try {
      // Send to your email service
      const emailData = {
        to: 'sales@hougenpros.com',
        subject: 'New Quote Request Received',
        template: 'quote-request',
        data: {
          ...quoteData,
          submittedAt: new Date().toLocaleString(),
          source: 'Website Quote Form'
        }
      };

      // You can integrate with your email service here
      console.log('Sending quote notification:', emailData);
      
      // Example: Send to your API endpoint
      // await fetch('/api/send-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(emailData)
      // });

    } catch (error) {
      console.error('Error sending quote notification:', error);
    }
  }

  static async getQuoteStatus(quoteId: string): Promise<QuoteResponse | null> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Check localStorage fallback
          const quotes = JSON.parse(localStorage.getItem('pending_quotes') || '[]');
          return quotes.find((q: any) => q.id === quoteId) || null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting quote status:', error);
      return null;
    }
  }

  static async updateQuoteStatus(quoteId: string, status: QuoteResponse['status'], notes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', quoteId);

      if (error) {
        if (error.code === 'PGRST116') {
          // Update localStorage fallback
          const quotes = JSON.parse(localStorage.getItem('pending_quotes') || '[]');
          const updatedQuotes = quotes.map((q: any) => 
            q.id === quoteId ? { ...q, status, notes, updatedAt: new Date().toISOString() } : q
          );
          localStorage.setItem('pending_quotes', JSON.stringify(updatedQuotes));
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw error;
    }
  }

  static async getPendingQuotes(): Promise<QuoteResponse[]> {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116') {
          // Return localStorage fallback
          const quotes = JSON.parse(localStorage.getItem('pending_quotes') || '[]');
          return quotes.filter((q: any) => q.status === 'pending');
        }
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting pending quotes:', error);
      return [];
    }
  }
}

export default QuoteService; 