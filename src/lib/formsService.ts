import { supabase } from './supabase';
import type {
  FormDefinition,
  FormSubmission,
  FormAnalytics,
  FormSubmissionFilters,
  FormAnalyticsFilters,
  FormSubmissionStats,
  FormAnalyticsStats,
  CreateFormSubmissionData,
  UpdateFormSubmissionData,
  FormBuilderData,
} from '@/types/forms';

// --- FORM DEFINITIONS ---
export async function getFormDefinitions(): Promise<FormDefinition[]> {
  try {
    const { data, error } = await supabase
      .from('form_definitions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching form definitions:', error);
    throw error;
  }
}

export async function getFormDefinition(slug: string): Promise<FormDefinition | null> {
  try {
    const { data, error } = await supabase
      .from('form_definitions')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching form definition:', error);
    return null;
  }
}

export async function createFormDefinition(formData: FormBuilderData): Promise<FormDefinition> {
  try {
    const { data, error } = await supabase
      .from('form_definitions')
      .insert([formData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating form definition:', error);
    throw error;
  }
}

export async function updateFormDefinition(id: string, formData: Partial<FormBuilderData>): Promise<FormDefinition> {
  try {
    const { data, error } = await supabase
      .from('form_definitions')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating form definition:', error);
    throw error;
  }
}

export async function deleteFormDefinition(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('form_definitions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting form definition:', error);
    throw error;
  }
}

// --- FORM SUBMISSIONS ---
export async function getFormSubmissions(filters: FormSubmissionFilters = {}): Promise<FormSubmission[]> {
  try {
    let query = supabase
      .from('form_submissions')
      .select(`
        *,
        form:form_definitions(*)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.form_id) {
      query = query.eq('form_id', filters.form_id);
    }

    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters.search) {
      query = query.or(`data->>'name'.ilike.%${filters.search}%,data->>'email'.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    throw error;
  }
}

export async function getFormSubmission(id: string): Promise<FormSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        form:form_definitions(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching form submission:', error);
    return null;
  }
}

export async function createFormSubmission(submissionData: CreateFormSubmissionData): Promise<FormSubmission> {
  try {
    // Get form definition
    const form = await getFormDefinition(submissionData.form_slug);
    if (!form) {
      throw new Error('Form not found');
    }

    // Get client metadata
    const metadata = {
      ...submissionData.metadata,
      submitted_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    };

    // Create submission
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([{
        form_id: form.id,
        data: submissionData.data,
        metadata,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        referrer: document.referrer,
      }])
      .select(`
        *,
        form:form_definitions(*)
      `)
      .single();

    if (error) throw error;

    // Send email notifications if configured
    if (form.settings.emailNotifications && form.settings.notificationEmail) {
      await sendFormNotificationEmail(form, data);
    }

    // Send auto-response if configured
    if (form.settings.autoResponse && submissionData.data.email) {
      await sendAutoResponseEmail(form, submissionData.data);
    }

    return data;
  } catch (error) {
    console.error('Error creating form submission:', error);
    throw error;
  }
}

export async function updateFormSubmission(id: string, updateData: UpdateFormSubmissionData): Promise<FormSubmission> {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        form:form_definitions(*)
      `)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating form submission:', error);
    throw error;
  }
}

export async function deleteFormSubmission(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('form_submissions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting form submission:', error);
    throw error;
  }
}

// --- FORM ANALYTICS ---
export async function getFormAnalytics(filters: FormAnalyticsFilters = {}): Promise<FormAnalytics[]> {
  try {
    let query = supabase
      .from('form_analytics')
      .select('*')
      .order('date', { ascending: false });

    if (filters.form_id) {
      query = query.eq('form_id', filters.form_id);
    }

    if (filters.date_from) {
      query = query.gte('date', filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte('date', filters.date_to);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching form analytics:', error);
    throw error;
  }
}

export async function getFormSubmissionStats(): Promise<FormSubmissionStats> {
  try {
    const { data: submissions, error } = await supabase
      .from('form_submissions')
      .select('status, created_at');

    if (error) throw error;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const totalSubmissions = submissions.length;
    const newSubmissions = submissions.filter(s => s.status === 'new').length;
    const readSubmissions = submissions.filter(s => s.status === 'read').length;
    const completedSubmissions = submissions.filter(s => s.status === 'completed').length;

    const thisMonthSubmissions = submissions.filter(s => 
      new Date(s.created_at) >= thisMonth
    ).length;

    const lastMonthSubmissions = submissions.filter(s => 
      new Date(s.created_at) >= lastMonth && new Date(s.created_at) < thisMonth
    ).length;

    const changePercentage = lastMonthSubmissions > 0 
      ? ((thisMonthSubmissions - lastMonthSubmissions) / lastMonthSubmissions) * 100
      : 0;

    const byStatus = {
      new: submissions.filter(s => s.status === 'new').length,
      read: submissions.filter(s => s.status === 'read').length,
      in_progress: submissions.filter(s => s.status === 'in_progress').length,
      completed: submissions.filter(s => s.status === 'completed').length,
      archived: submissions.filter(s => s.status === 'archived').length,
    };

    return {
      total_submissions: totalSubmissions,
      new_submissions: newSubmissions,
      read_submissions: readSubmissions,
      completed_submissions: completedSubmissions,
      this_month: {
        submissions: thisMonthSubmissions,
        change_percentage: changePercentage,
      },
      by_status: byStatus,
    };
  } catch (error) {
    console.error('Error fetching form submission stats:', error);
    throw error;
  }
}

export async function getFormAnalyticsStats(): Promise<FormAnalyticsStats> {
  try {
    const { data: analytics, error } = await supabase
      .from('form_analytics')
      .select(`
        *,
        form:form_definitions(name)
      `);

    if (error) throw error;

    const totalViews = analytics.reduce((sum, a) => sum + (a.views || 0), 0);
    const totalSubmissions = analytics.reduce((sum, a) => sum + (a.submissions || 0), 0);
    const averageConversionRate = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / analytics.length
      : 0;

    // Get top performing forms
    const formPerformance = analytics.reduce((acc, a) => {
      const formId = a.form_id;
      if (!acc[formId]) {
        acc[formId] = {
          form_id: formId,
          form_name: (a.form as any)?.name || 'Unknown',
          submissions: 0,
          conversion_rate: 0,
        };
      }
      acc[formId].submissions += (a.submissions || 0);
      acc[formId].conversion_rate = Math.max(acc[formId].conversion_rate, (a.conversion_rate || 0));
      return acc;
    }, {} as Record<string, {
      form_id: string;
      form_name: string;
      submissions: number;
      conversion_rate: number;
    }>);

    const topPerformingForms = Object.values(formPerformance)
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 5);

    // Get recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAnalytics = analytics.filter(a => new Date(a.date) >= thirtyDaysAgo);
    const recentTrends = recentAnalytics.map(a => ({
      date: a.date,
      views: a.views || 0,
      submissions: a.submissions || 0,
      conversion_rate: a.conversion_rate || 0,
    }));

    return {
      total_views: totalViews,
      total_submissions: totalSubmissions,
      average_conversion_rate: averageConversionRate,
      top_performing_forms: topPerformingForms,
      recent_trends: recentTrends,
    };
  } catch (error) {
    console.error('Error fetching form analytics stats:', error);
    throw error;
  }
}

// --- UTILITY FUNCTIONS ---
async function getClientIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Could not get client IP:', error);
    return null;
  }
}

async function sendFormNotificationEmail(form: FormDefinition, submission: FormSubmission): Promise<void> {
  try {
    // This would integrate with your email service
    // For now, we'll just log it
    console.log('Sending notification email for form submission:', {
      form: form.name,
      submission: submission.id,
      to: form.settings.notificationEmail,
    });
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

async function sendAutoResponseEmail(form: FormDefinition, data: Record<string, any>): Promise<void> {
  try {
    // This would integrate with your email service
    // For now, we'll just log it
    console.log('Sending auto-response email:', {
      form: form.name,
      to: data.email,
      subject: form.settings.autoResponseSubject,
    });
  } catch (error) {
    console.error('Error sending auto-response email:', error);
  }
}

// --- FORM VIEW TRACKING ---
export async function trackFormView(formSlug: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_form_view', {
      form_slug: formSlug,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking form view:', error);
  }
} 