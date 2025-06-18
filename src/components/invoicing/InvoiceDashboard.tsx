
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Download,
  Send,
  Eye
} from 'lucide-react';

interface InvoiceStats {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
}

interface RecentInvoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

const mockStats: InvoiceStats = {
  totalRevenue: 125430,
  totalInvoices: 87,
  paidInvoices: 65,
  pendingInvoices: 15,
  overdueInvoices: 4,
  draftInvoices: 3
};

const mockRecentInvoices: RecentInvoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    client: 'Acme Corporation',
    amount: 2500.00,
    status: 'paid',
    dueDate: '2024-01-15',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    client: 'Tech Solutions Inc',
    amount: 1850.00,
    status: 'sent',
    dueDate: '2024-01-20',
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    number: 'INV-2024-003',
    client: 'Design Studio LLC',
    amount: 3200.00,
    status: 'overdue',
    dueDate: '2024-01-10',
    createdAt: '2023-12-28'
  },
  {
    id: '4',
    number: 'INV-2024-004',
    client: 'Manufacturing Co',
    amount: 4750.00,
    status: 'draft',
    dueDate: '2024-01-25',
    createdAt: '2024-01-08'
  }
];

export function InvoiceDashboard({ onCreateInvoice, onViewInvoice }: {
  onCreateInvoice: () => void;
  onViewInvoice: (invoiceId: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'draft': return <FileText className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600 mt-1">Manage your invoices and track payments</p>
        </div>
        <Button onClick={onCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${mockStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalInvoices}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.paidInvoices}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.overdueInvoices}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Invoices</span>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(invoice.status)}
                  <div>
                    <p className="font-medium text-gray-900">{invoice.number}</p>
                    <p className="text-sm text-gray-600">{invoice.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${invoice.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Due: {invoice.dueDate}</p>
                  </div>
                  
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewInvoice(invoice.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    {invoice.status === 'draft' || invoice.status === 'sent' ? (
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
