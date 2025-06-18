import { supabase } from '@/lib/supabase';
import { Invoice, InvoiceFormData, InvoiceTemplate, InvoiceTemplateFormData } from '@/types/invoice';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export class InvoiceService {
  // Invoice Templates
  static async getTemplates(): Promise<InvoiceTemplate[]> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createTemplate(template: InvoiceTemplateFormData): Promise<InvoiceTemplate> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .insert(template)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateTemplate(id: string, template: Partial<InvoiceTemplateFormData>): Promise<InvoiceTemplate> {
    const { data, error } = await supabase
      .from('invoice_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoice_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Invoices
  static async getInvoices(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        items:invoice_items(*),
        template:invoice_templates(*),
        client:clients(id, name, email, phone, address)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getInvoice(id: string): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        items:invoice_items(*),
        template:invoice_templates(*),
        client:clients(id, name, email, phone, address)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createInvoice(invoiceData: InvoiceFormData): Promise<Invoice> {
    // Calculate totals
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const tax_amount = subtotal * (invoiceData.tax_rate / 100);
    const total_amount = subtotal + tax_amount;

    // Start a transaction
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        client_id: invoiceData.client_id,
        template_id: invoiceData.template_id,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        subtotal,
        tax_rate: invoiceData.tax_rate,
        tax_amount,
        total_amount,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        status: 'draft'
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Insert invoice items
    const items = invoiceData.items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      amount: item.quantity * item.unit_price
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(items);

    if (itemsError) throw itemsError;

    return this.getInvoice(invoice.id);
  }

  static async updateInvoice(id: string, invoiceData: Partial<InvoiceFormData>): Promise<Invoice> {
    const invoice = await this.getInvoice(id);
    
    // Calculate new totals if items are being updated
    let subtotal = invoice.subtotal;
    let tax_amount = invoice.tax_amount;
    let total_amount = invoice.total_amount;

    if (invoiceData.items) {
      subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      tax_amount = subtotal * ((invoiceData.tax_rate ?? invoice.tax_rate) / 100);
      total_amount = subtotal + tax_amount;
    }

    // Update invoice
    const { error: invoiceError } = await supabase
      .from('invoices')
      .update({
        client_id: invoiceData.client_id,
        template_id: invoiceData.template_id,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        subtotal,
        tax_rate: invoiceData.tax_rate,
        tax_amount,
        total_amount,
        notes: invoiceData.notes,
        terms: invoiceData.terms
      })
      .eq('id', id);

    if (invoiceError) throw invoiceError;

    // Update items if provided
    if (invoiceData.items) {
      // Delete existing items
      const { error: deleteError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', id);

      if (deleteError) throw deleteError;

      // Insert new items
      const items = invoiceData.items.map(item => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        amount: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    return this.getInvoice(id);
  }

  static async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // PDF Generation
  static async generatePDF(invoice: Invoice): Promise<Blob> {
    // Create a temporary div to render the invoice
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = invoice.template?.html_template || '';
    document.body.appendChild(tempDiv);

    // Replace template variables
    const template = tempDiv.innerHTML
      .replace('{{invoice_number}}', invoice.invoice_number)
      .replace('{{issue_date}}', format(new Date(invoice.issue_date), 'MMM dd, yyyy'))
      .replace('{{due_date}}', format(new Date(invoice.due_date), 'MMM dd, yyyy'))
      .replace('{{client_name}}', invoice.client?.name || '')
      .replace('{{client_email}}', invoice.client?.email || '')
      .replace('{{client_phone}}', invoice.client?.phone || '')
      .replace('{{client_address}}', invoice.client?.address || '')
      .replace('{{subtotal}}', invoice.subtotal.toFixed(2))
      .replace('{{tax_rate}}', invoice.tax_rate.toFixed(2))
      .replace('{{tax_amount}}', invoice.tax_amount.toFixed(2))
      .replace('{{total_amount}}', invoice.total_amount.toFixed(2))
      .replace('{{notes}}', invoice.notes || '')
      .replace('{{terms}}', invoice.terms || '');

    // Add items
    const itemsHtml = invoice.items?.map(item => `
      <tr>
        <td>${item.description}</td>
        <td>${item.quantity}</td>
        <td>$${item.unit_price.toFixed(2)}</td>
        <td>$${item.amount.toFixed(2)}</td>
      </tr>
    `).join('') || '';

    template.replace('{{items}}', itemsHtml);

    // Apply CSS
    if (invoice.template?.css_template) {
      const style = document.createElement('style');
      style.textContent = invoice.template.css_template;
      tempDiv.appendChild(style);
    }

    // Generate PDF
    const canvas = await html2canvas(tempDiv);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Clean up
    document.body.removeChild(tempDiv);

    return pdf.output('blob');
  }

  // Email Sending
  static async sendInvoiceEmail(invoiceId: string, recipientEmail: string): Promise<void> {
    const invoice = await this.getInvoice(invoiceId);
    const pdfBlob = await this.generatePDF(invoice);

    // Create form data for the email API
    const formData = new FormData();
    formData.append('to', recipientEmail);
    formData.append('subject', `Invoice ${invoice.invoice_number} from ${invoice.client?.name}`);
    formData.append('text', `Please find attached invoice ${invoice.invoice_number} for your recent purchase.`);
    formData.append('attachment', pdfBlob, `invoice-${invoice.invoice_number}.pdf`);

    // Send email using your email service
    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    // Record the email in the database
    const { error } = await supabase
      .from('invoice_emails')
      .insert({
        invoice_id: invoiceId,
        recipient_email: recipientEmail,
        status: 'sent'
      });

    if (error) throw error;

    // Update invoice status
    await this.updateInvoiceStatus(invoiceId, 'sent');
  }
} 