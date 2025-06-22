import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { logoBase64 } from '@/assets/logoBase64';
import type { Invoice, InvoiceLineItem, BillingSettings } from '@/types/billing';

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface PDFOptions {
  filename?: string;
  format?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  includeLogo?: boolean;
  template?: 'modern' | 'classic' | 'minimal' | 'luxury';
  watermark?: boolean;
}

export class PDFService {
  private static defaultSettings: BillingSettings = {
    id: '1',
    company_name: 'HOU GEN PROS',
    company_address: '1234 Generator Lane, Houston, TX 77001',
    company_phone: '(713) 555-0123',
    company_email: 'billing@hougenpros.com',
    company_website: 'www.hougenpros.com',
    tax_id: '12-3456789',
    logo_url: '',
    default_currency: 'USD',
    default_tax_rate: 8.25,
    default_payment_terms: 30,
    invoice_prefix: 'INV',
    invoice_start_number: 1000,
    auto_numbering: true,
    default_notes: 'Thank you for your business!',
    default_terms: 'Payment is due within 30 days of invoice date.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  static async generateInvoicePDF(
    invoice: Invoice & { line_items: InvoiceLineItem[] },
    settings: BillingSettings | null = this.defaultSettings,
    options: PDFOptions = {}
  ): Promise<Blob> {
    // Use default settings if none provided
    const finalSettings = settings || this.defaultSettings;
    
    const {
      filename = `Invoice-${invoice.invoice_number}.pdf`,
      format = 'A4',
      orientation = 'portrait',
      includeLogo = true,
      template = 'modern',
      watermark = false
    } = options;

    const doc = new jsPDF({
      format,
      orientation,
      unit: 'mm'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Set up fonts and colors
    doc.setFont('helvetica');
    doc.setFontSize(10);

    try {
      if (template === 'luxury') {
        // Luxury template
        await this.drawLuxuryHeader(doc, invoice, finalSettings, { includeLogo, margin, contentWidth, pageHeight });
        this.drawLuxuryCustomerInfo(doc, invoice, { margin });
        this.drawLuxuryLineItemsTable(doc, invoice.line_items, { margin });
        this.drawLuxuryTotalsSection(doc, invoice, { margin });
        this.drawLuxuryFooter(doc, invoice, finalSettings, { margin, pageHeight, contentWidth });
      } else {
        // Standard templates
        await this.drawHeader(doc, invoice, finalSettings, { includeLogo, template, margin, contentWidth });
        this.drawCustomerInfo(doc, invoice, finalSettings, { margin, contentWidth });
        this.drawInvoiceInfo(doc, invoice, { margin, contentWidth });
        this.drawLineItemsTable(doc, invoice.line_items, { margin, contentWidth, pageWidth });
        this.drawTotalsSection(doc, invoice, { margin, contentWidth, pageWidth });
        this.drawFooter(doc, invoice, finalSettings, { margin, contentWidth, pageHeight });
      }
    } catch (error) {
      console.error('Error in template generation, falling back to simple template:', error);
      // Fallback to simple template
      this.drawSimpleTemplate(doc, invoice, finalSettings, { margin, contentWidth, pageHeight });
    }

    // Watermark
    if (watermark) {
      this.drawWatermark(doc, pageWidth, pageHeight);
    }

    // Add page numbers
    this.addPageNumbers(doc, pageWidth, pageHeight);

    return doc.output('blob');
  }

  private static async drawHeader(
    doc: jsPDF,
    invoice: Invoice,
    settings: BillingSettings,
    options: { includeLogo: boolean; template: string; margin: number; contentWidth: number }
  ) {
    const { includeLogo, template, margin, contentWidth } = options;
    const y = margin;

    if (includeLogo && logoBase64) {
      try {
        const byteCharacters = atob(logoBase64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        doc.addImage(byteArray, 'PNG', margin, y, 40, 15);
      } catch (e) {
        console.error("Error adding logo to PDF:", e);
      }
    }

    // Company Information
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.company_name, margin + (includeLogo ? 50 : 0), y + 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.company_address, margin + (includeLogo ? 50 : 0), y + 20);
    doc.text(`Phone: ${settings.company_phone}`, margin + (includeLogo ? 50 : 0), y + 27);
    doc.text(`Email: ${settings.company_email}`, margin + (includeLogo ? 50 : 0), y + 34);
    
    if (settings.company_website) {
      doc.text(`Web: ${settings.company_website}`, margin + (includeLogo ? 50 : 0), y + 41);
    }

    // Invoice Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text('INVOICE', contentWidth + margin - 60, y + 15);
    doc.setTextColor(0, 0, 0);

    // Template-specific styling
    if (template === 'modern') {
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 50, contentWidth + margin, y + 50);
    }
  }

  private static drawCustomerInfo(
    doc: jsPDF,
    invoice: Invoice,
    settings: BillingSettings,
    options: { margin: number; contentWidth: number }
  ) {
    const { margin, contentWidth } = options;
    const y = margin + 70;

    // Bill To Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', margin, y);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_name, margin, y + 10);
    doc.text(invoice.customer_email, margin, y + 17);
    doc.text(invoice.customer_address, margin, y + 24);
  }

  private static drawInvoiceInfo(
    doc: jsPDF,
    invoice: Invoice,
    options: { margin: number; contentWidth: number }
  ) {
    const { margin, contentWidth } = options;
    const y = margin + 70;
    const rightX = contentWidth + margin;

    // Invoice Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', rightX - 80, y);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const details = [
      { label: 'Invoice #:', value: invoice.invoice_number },
      { label: 'Issue Date:', value: new Date(invoice.issue_date).toLocaleDateString() },
      { label: 'Due Date:', value: new Date(invoice.due_date).toLocaleDateString() },
      { label: 'Status:', value: invoice.status.replace('_', ' ').toUpperCase() },
      { label: 'Terms:', value: `${invoice.payment_terms} days` }
    ];

    details.forEach((detail, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label, rightX - 80, y + 15 + (index * 8));
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value, rightX - 40, y + 15 + (index * 8));
    });
  }

  private static drawLineItemsTable(
    doc: jsPDF,
    lineItems: InvoiceLineItem[],
    options: { margin: number; contentWidth: number; pageWidth: number }
  ) {
    const { margin, contentWidth, pageWidth } = options;
    const y = margin + 140;

    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 12, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    
    const columns = [
      { x: margin + 5, width: 80, text: 'Description' },
      { x: margin + 85, width: 20, text: 'Qty' },
      { x: margin + 105, width: 30, text: 'Rate' },
      { x: margin + 135, width: 25, text: 'Tax' },
      { x: margin + 160, width: 25, text: 'Discount' },
      { x: margin + 185, width: 30, text: 'Total' }
    ];

    columns.forEach(col => {
      doc.text(col.text, col.x, y + 8);
    });

    // Table Content
    doc.setFont('helvetica', 'normal');
    let currentY = y + 12;

    lineItems.forEach((item, index) => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = margin + 20;
        
        // Redraw header on new page
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY - 12, contentWidth, 12, 'F');
        doc.setFont('helvetica', 'bold');
        columns.forEach(col => {
          doc.text(col.text, col.x, currentY - 4);
        });
        doc.setFont('helvetica', 'normal');
        currentY += 12;
      }

      // Row background (alternating)
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(margin, currentY - 8, contentWidth, 10, 'F');
      }

      // Item description (with word wrapping)
      const description = this.wrapText(doc, item.description, 75);
      doc.text(description, margin + 5, currentY);

      // Other columns
      doc.text(item.quantity.toString(), margin + 85, currentY);
      doc.text(`$${item.unit_price.toFixed(2)}`, margin + 105, currentY);
      doc.text(`$${item.tax_amount.toFixed(2)}`, margin + 135, currentY);
      doc.text(`$${item.discount_amount.toFixed(2)}`, margin + 160, currentY);
      doc.text(`$${item.total_amount.toFixed(2)}`, margin + 185, currentY);

      currentY += 10;
    });

    // Table border
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, currentY - y + 2);
  }

  private static drawTotalsSection(
    doc: jsPDF,
    invoice: Invoice,
    options: { margin: number; contentWidth: number; pageWidth: number }
  ) {
    const { margin, contentWidth, pageWidth } = options;
    const y = margin + 280;
    const rightX = contentWidth + margin;

    // Totals Box
    doc.setFillColor(248, 250, 252);
    doc.rect(rightX - 80, y, 80, 60, 'F');
    doc.setDrawColor(209, 213, 219);
    doc.rect(rightX - 80, y, 80, 60);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const totals = [
      { label: 'Subtotal:', value: `$${invoice.subtotal.toFixed(2)}` },
      { label: 'Tax:', value: `$${invoice.tax_amount.toFixed(2)}` },
      { label: 'Discount:', value: `-$${invoice.discount_amount.toFixed(2)}` },
      { label: 'Total:', value: `$${invoice.total_amount.toFixed(2)}` },
      { label: 'Paid:', value: `$${invoice.amount_paid.toFixed(2)}` },
      { label: 'Balance:', value: `$${invoice.balance_due.toFixed(2)}` }
    ];

    totals.forEach((total, index) => {
      const isTotal = total.label === 'Total:';
      const isBalance = total.label === 'Balance:';
      
      if (isTotal || isBalance) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      }

      doc.text(total.label, rightX - 75, y + 10 + (index * 8));
      doc.text(total.value, rightX - 25, y + 10 + (index * 8));
    });

    // Payment status indicator
    const statusColor = this.getStatusColor(invoice.status);
    doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
    doc.circle(rightX - 40, y + 50, 3, 'F');
    doc.setFontSize(8);
    doc.setTextColor(statusColor.r, statusColor.g, statusColor.b);
    doc.text(invoice.status.toUpperCase(), rightX - 35, y + 52);
  }

  private static drawFooter(
    doc: jsPDF,
    invoice: Invoice,
    settings: BillingSettings,
    options: { margin: number; contentWidth: number; pageHeight: number }
  ) {
    const { margin, contentWidth, pageHeight } = options;
    const y = pageHeight - 60;

    // Notes
    if (invoice.notes) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', margin, y);
      
      doc.setFont('helvetica', 'normal');
      const notes = this.wrapText(doc, invoice.notes, contentWidth - 10);
      doc.text(notes, margin, y + 10);
    }

    // Terms
    if (invoice.terms || settings.default_terms) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Terms:', margin, y + 30);
      
      doc.setFont('helvetica', 'normal');
      const terms = this.wrapText(doc, invoice.terms || settings.default_terms, contentWidth - 10);
      doc.text(terms, margin, y + 40);
    }

    // Footer line
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 10, contentWidth + margin, y - 10);
  }

  private static drawWatermark(doc: jsPDF, pageWidth: number, pageHeight: number) {
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', pageWidth / 2, pageHeight / 2, { angle: 45, align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  private static addPageNumbers(doc: jsPDF, pageWidth: number, pageHeight: number) {
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
  }

  private static wrapText(doc: jsPDF, text: string, maxWidth: number): string {
    const words = text.split(' ');
    let line = '';
    let result = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = doc.getTextWidth(testLine);
      
      if (testWidth > maxWidth && i > 0) {
        result += line + '\n';
        line = words[i] + ' ';
      } else {
        line = testLine;
      }
    }
    
    result += line;
    return result;
  }

  private static getStatusColor(status: string): { r: number; g: number; b: number } {
    switch (status) {
      case 'paid':
        return { r: 74, g: 189, b: 100 }; // #4abd64
      case 'overdue':
        return { r: 239, g: 68, b: 68 }; // #ef4444
      case 'sent':
        return { r: 59, g: 130, b: 246 }; // #3b82f6
      case 'draft':
        return { r: 107, g: 114, b: 128 }; // #6b7280
      case 'cancelled':
        return { r: 156, g: 163, b: 175 }; // #9ca3af
      case 'partially_paid':
        return { r: 245, g: 158, b: 11 }; // #f59e0b
      default:
        return { r: 156, g: 163, b: 175 }; // Gray
    }
  }

  // Luxury template specific methods
  private static async drawLuxuryHeader(
    doc: jsPDF,
    invoice: Invoice,
    settings: BillingSettings,
    options: { includeLogo: boolean; margin: number; contentWidth: number; pageHeight: number }
  ) {
    const { includeLogo, margin, contentWidth } = options;
    const headerRightX = margin + contentWidth;

    if (includeLogo && logoBase64) {
      try {
        const byteCharacters = atob(logoBase64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        doc.addImage(byteArray, 'PNG', margin, 15, 50, 25);
      } catch (e) {
        console.error("Error adding luxury logo to PDF:", e);
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(34, 47, 62);
    doc.text('INVOICE', headerRightX, 25, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(93, 109, 126);

    doc.text(settings.company_name, margin, 50);
    doc.text(settings.company_address, margin, 56);
    doc.text(settings.company_phone, margin, 62);

    doc.text(`#${invoice.invoice_number}`, headerRightX, 35, { align: 'right' });
    doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, headerRightX, 41, { align: 'right' });
    doc.text(`Due: ${new Date(invoice.due_date).toLocaleDateString()}`, headerRightX, 47, { align: 'right' });
  }

  private static drawLuxuryCustomerInfo(doc: jsPDF, invoice: Invoice, options: { margin: number }) {
    const { margin } = options;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(34, 47, 62);
    doc.text('BILL TO', margin, 80);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(93, 109, 126);
    doc.text(invoice.customer_name, margin, 86);
    doc.text(invoice.customer_address, margin, 92);
    doc.text(invoice.customer_email, margin, 98);
  }

  private static drawLuxuryLineItemsTable(
    doc: jsPDF,
    lineItems: InvoiceLineItem[],
    options: { margin: number }
  ) {
    const { margin } = options;
    const tableData = lineItems.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.unit_price.toFixed(2)}`,
      `$${(item.quantity * item.unit_price).toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 110,
      head: [['ITEM', 'QTY', 'PRICE', 'TOTAL']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [34, 47, 62],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      margin: { left: margin, right: margin },
      styles: {
        font: 'helvetica',
        fontSize: 10,
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' },
      },
    });
  }

  private static drawLuxuryTotalsSection(doc: jsPDF, invoice: Invoice, options: { margin: number }) {
    const { margin } = options;
    const rightX = doc.internal.pageSize.getWidth() - margin;
    const finalY = (doc as any).lastAutoTable.finalY || 180;
    let y = finalY + 10;

    const totals = [
      { label: 'Subtotal', value: `$${invoice.subtotal.toFixed(2)}` },
      { label: 'Discount', value: `-$${invoice.discount_amount.toFixed(2)}` },
      { label: 'Tax', value: `$${invoice.tax_amount.toFixed(2)}` },
      { label: 'Total', value: `$${invoice.total_amount.toFixed(2)}` },
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    totals.forEach(item => {
      if (item.label === 'Total') {
        doc.setFont('helvetica', 'bold');
      }
      doc.text(item.label, rightX - 50, y, { align: 'left' });
      doc.text(item.value, rightX, y, { align: 'right' });
      y += 6;
    });
  }

  private static drawLuxuryFooter(
    doc: jsPDF,
    invoice: Invoice,
    settings: BillingSettings,
    options: { margin: number; pageHeight: number; contentWidth: number }
  ) {
    const { margin, pageHeight } = options;
    const y = pageHeight - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(149, 165, 166);
    doc.text(
      'Thank you for your business!',
      doc.internal.pageSize.getWidth() / 2,
      y,
      { align: 'center' }
    );
  }

  private static drawSimpleTemplate(
    doc: jsPDF,
    invoice: Invoice & { line_items: InvoiceLineItem[] },
    settings: BillingSettings,
    options: { margin: number; contentWidth: number; pageHeight: number }
  ) {
    const { margin, contentWidth, pageHeight } = options;
    let y = margin;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(settings.company_name, margin, y + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(settings.company_address, margin, y + 20);
    doc.text(`Phone: ${settings.company_phone}`, margin, y + 27);
    doc.text(`Email: ${settings.company_email}`, margin, y + 34);

    // Invoice title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', contentWidth + margin - 60, y + 15);

    // Invoice details
    y += 50;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice #:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.invoice_number, margin + 30, y);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', margin, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(invoice.issue_date).toLocaleDateString(), margin + 30, y + 10);

    // Customer info
    y += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.customer_name, margin, y + 10);
    doc.text(invoice.customer_email, margin, y + 17);
    doc.text(invoice.customer_address, margin, y + 24);

    // Line items
    y += 40;
    doc.setFont('helvetica', 'bold');
    doc.text('Description', margin, y);
    doc.text('Qty', margin + 80, y);
    doc.text('Price', margin + 120, y);
    doc.text('Total', margin + 160, y);

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    for (const item of invoice.line_items) {
      doc.text(item.description, margin, y);
      doc.text(item.quantity.toString(), margin + 80, y);
      doc.text(`$${item.unit_price.toFixed(2)}`, margin + 120, y);
      doc.text(`$${(item.quantity * item.unit_price).toFixed(2)}`, margin + 160, y);
      y += 8;
    }

    // Totals
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', margin + 120, y);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, margin + 160, y);
    
    y += 8;
    doc.text('Tax:', margin + 120, y);
    doc.text(`$${invoice.tax_amount.toFixed(2)}`, margin + 160, y);
    
    y += 8;
    doc.text('Total:', margin + 120, y);
    doc.text(`$${invoice.total_amount.toFixed(2)}`, margin + 160, y);
  }
}
