
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Edit, 
  Copy,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react';

interface InvoiceViewData {
  id: string;
  number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  client: {
    name: string;
    email: string;
    address: string;
  };
  company: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  dates: {
    issued: string;
    due: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  notes: string;
  terms: string;
}

const mockInvoice: InvoiceViewData = {
  id: '1',
  number: 'INV-2024-001',
  status: 'sent',
  client: {
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    address: '123 Business St\nSuite 100\nNew York, NY 10001'
  },
  company: {
    name: 'Houston Generator Pros',
    address: '456 Generator Ave\nHouston, TX 77001',
    email: 'billing@houstongeneratorpros.com',
    phone: '+1 (713) 555-0123'
  },
  dates: {
    issued: '2024-01-01',
    due: '2024-01-31'
  },
  items: [
    {
      description: 'Generac 22KW Installation',
      quantity: 1,
      rate: 2500.00,
      amount: 2500.00
    },
    {
      description: 'Electrical Permit and Inspection',
      quantity: 1,
      rate: 350.00,
      amount: 350.00
    },
    {
      description: 'Gas Line Connection',
      quantity: 1,
      rate: 450.00,
      amount: 450.00
    }
  ],
  totals: {
    subtotal: 3300.00,
    discount: 0,
    tax: 280.50,
    total: 3580.50
  },
  notes: 'Thank you for choosing Houston Generator Pros for your backup power needs.',
  terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional fees.'
};

export function InvoiceViewer({ invoiceId, onBack, onEdit }: {
  invoiceId: string;
  onBack: () => void;
  onEdit: () => void;
}) {
  const invoice = mockInvoice; // In real app, fetch by invoiceId

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = () => {
    console.log('Downloading PDF for invoice:', invoiceId);
    // API integration point
  };

  const handleSend = () => {
    console.log('Sending invoice:', invoiceId);
    // API integration point
  };

  const handleDuplicate = () => {
    console.log('Duplicating invoice:', invoiceId);
    // API integration point
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice {invoice.number}</h1>
            <p className="text-gray-600">View and manage invoice details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          {invoice.status !== 'paid' && (
            <Button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Preview */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h2>
              <p className="text-xl text-gray-600">{invoice.number}</p>
            </div>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">{invoice.company.name}</h3>
              <p className="text-gray-600 whitespace-pre-line">{invoice.company.address}</p>
              <p className="text-gray-600">{invoice.company.email}</p>
              <p className="text-gray-600">{invoice.company.phone}</p>
            </div>
          </div>

          {/* Client and Date Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h4>
              <div className="text-gray-600">
                <p className="font-medium">{invoice.client.name}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
                <p>{invoice.client.email}</p>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Issue Date:</span>
                  <span className="text-gray-600">{formatDate(invoice.dates.issued)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Due Date:</span>
                  <span className="text-gray-600">{formatDate(invoice.dates.due)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Status:</span>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-900 font-medium">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900">${invoice.totals.subtotal.toFixed(2)}</span>
                </div>
                {invoice.totals.discount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-red-600">-${invoice.totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-900">${invoice.totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-200">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">${invoice.totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="space-y-6">
              {invoice.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes:</h4>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions:</h4>
                  <p className="text-gray-600">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
