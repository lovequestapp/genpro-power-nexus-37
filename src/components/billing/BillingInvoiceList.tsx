import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Eye, Edit, Trash2, Download, FileText, Calendar, DollarSign, User, Grid, List, Clock } from 'lucide-react';
import { getInvoices, deleteInvoice, getInvoice } from '@/lib/billingService';
import { PDFService } from '@/lib/pdfService';
import { getBillingSettings } from '@/lib/billingService';
import type { Invoice } from '@/types/billing';
import { useToast } from '@/hooks/use-toast';

interface BillingInvoiceListProps {
  onCreateInvoice: () => void;
  onViewInvoice: (id: string) => void;
  onEditInvoice: (id: string) => void;
}

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Latest', value: 'latest' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function BillingInvoiceList({ onCreateInvoice, onViewInvoice, onEditInvoice }: BillingInvoiceListProps) {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [viewFormat, setViewFormat] = useState<'card' | 'list'>('card');
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      let statusFilter: string[] | undefined;
      let dateFilter: { date_from?: string; date_to?: string } = {};

      if (status === 'latest') {
        // Show invoices from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter.date_from = thirtyDaysAgo.toISOString();
      } else if (status !== 'all') {
        statusFilter = [status];
      }

      const data = await getInvoices({ 
        status: statusFilter, 
        search,
        ...dateFilter
      });
      setInvoices(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load invoices');
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line
  }, [status, search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this invoice?')) return;
    setLoading(true);
    try {
      await deleteInvoice(id);
      fetchInvoices();
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    } catch (e: any) {
      setError(e.message || 'Failed to delete invoice');
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      setDownloading(invoice.id);
      
      // Get full invoice data with line items
      const fullInvoice = await getInvoice(invoice.id);
      const settings = await getBillingSettings();
      
      // Generate PDF
      const blob = await PDFService.generateInvoicePDF(fullInvoice, settings, {
        filename: `Invoice-${invoice.invoice_number}-${new Date().toISOString().split('T')[0]}.pdf`,
        template: 'luxury',
        includeLogo: true
      });
      
      // Download file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice.invoice_number}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PDF downloaded successfully",
      });
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    } finally {
      setDownloading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return '✅';
      case 'overdue': return '⚠️';
      case 'sent': return '📤';
      case 'draft': return '📝';
      case 'cancelled': return '❌';
      case 'partially_paid': return '💰';
      default: return '📄';
    }
  };

  const calculatePaymentProgress = (invoice: Invoice) => {
    if (!invoice.total_amount || invoice.total_amount <= 0) return 0;
    return Math.min((invoice.amount_paid / invoice.total_amount) * 100, 100);
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices.map(invoice => (
        <div key={invoice.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {invoice.invoice_number}
                </h3>
                <p className="text-sm text-gray-500">{invoice.customer_name}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">{getStatusIcon(invoice.status)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>Total: ${invoice.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Balance: ${invoice.balance_due.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress Bar - Always show if there's a total amount */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Payment Progress</span>
                <span>{Math.round(calculatePaymentProgress(invoice))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculatePaymentProgress(invoice)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Paid: ${invoice.amount_paid.toLocaleString()}</span>
                <span>Total: ${invoice.total_amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewInvoice(invoice.id)}
                  title="View Invoice"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditInvoice(invoice.id)}
                  title="Edit Invoice"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownloadPDF(invoice)}
                  disabled={downloading === invoice.id}
                  title="Download PDF"
                >
                  {downloading === invoice.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(invoice.id)}
                title="Delete Invoice"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left font-semibold text-gray-700">Invoice #</th>
            <th className="p-3 text-left font-semibold text-gray-700">Customer</th>
            <th className="p-3 text-left font-semibold text-gray-700">Status</th>
            <th className="p-3 text-left font-semibold text-gray-700">Issue Date</th>
            <th className="p-3 text-left font-semibold text-gray-700">Due Date</th>
            <th className="p-3 text-left font-semibold text-gray-700">Total</th>
            <th className="p-3 text-left font-semibold text-gray-700">Paid</th>
            <th className="p-3 text-left font-semibold text-gray-700">Balance</th>
            <th className="p-3 text-left font-semibold text-gray-700">Progress</th>
            <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-3 font-mono font-medium">{inv.invoice_number}</td>
              <td className="p-3">
                <div>
                  <div className="font-medium text-gray-900">{inv.customer_name}</div>
                  <div className="text-sm text-gray-500">{inv.customer_email}</div>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getStatusIcon(inv.status)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.status)}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </div>
              </td>
              <td className="p-3 text-sm">{new Date(inv.issue_date).toLocaleDateString()}</td>
              <td className="p-3 text-sm">{new Date(inv.due_date).toLocaleDateString()}</td>
              <td className="p-3 font-medium">${inv.total_amount.toLocaleString()}</td>
              <td className="p-3 text-sm">${inv.amount_paid.toLocaleString()}</td>
              <td className="p-3 font-medium">${inv.balance_due.toLocaleString()}</td>
              <td className="p-3">
                <div className="w-20">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{Math.round(calculatePaymentProgress(inv))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculatePaymentProgress(inv)}%` }}
                    ></div>
                  </div>
                </div>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onViewInvoice(inv.id)} title="View">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEditInvoice(inv.id)} title="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDownloadPDF(inv)} 
                    disabled={downloading === inv.id}
                    title="Download PDF"
                  >
                    {downloading === inv.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(inv.id)} title="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <TabsList className="flex space-x-2">
            {statusTabs.map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={status === tab.value ? 'bg-blue-100 text-blue-700' : ''}
                onClick={() => setStatus(tab.value)}
              >
                {tab.value === 'latest' && <Clock className="w-3 h-3 mr-1" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {/* View Format Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewFormat === 'card' ? 'default' : 'ghost'}
              onClick={() => setViewFormat('card')}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewFormat === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewFormat('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin" />
          <span className="ml-2">Loading invoices...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 bg-red-50 p-4 rounded-md">
          <div className="flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            {error}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600 mb-4">
                {search ? 'Try adjusting your search terms' : 
                 status === 'latest' ? 'No invoices in the last 30 days' :
                 `No ${status === 'all' ? '' : status} invoices found`}
              </p>
              {!search && status === 'all' && (
                <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Create First Invoice
                </Button>
              )}
            </div>
          ) : (
            viewFormat === 'card' ? renderCardView() : renderListView()
          )}
        </div>
      )}
    </div>
  );
}
