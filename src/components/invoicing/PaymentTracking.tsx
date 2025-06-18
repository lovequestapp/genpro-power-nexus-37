
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Send,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded';
  method: string;
  date: string;
  dueDate: string;
  stripePaymentId?: string;
}

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    client: 'Acme Corporation',
    amount: 3580.50,
    status: 'paid',
    method: 'Credit Card',
    date: '2024-01-15',
    dueDate: '2024-01-31',
    stripePaymentId: 'pi_1234567890'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    client: 'Tech Solutions Inc',
    amount: 1850.00,
    status: 'processing',
    method: 'ACH Transfer',
    date: '2024-01-18',
    dueDate: '2024-01-30',
    stripePaymentId: 'pi_0987654321'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    client: 'Design Studio LLC',
    amount: 3200.00,
    status: 'pending',
    method: 'Bank Transfer',
    date: '',
    dueDate: '2024-01-25',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    client: 'Manufacturing Co',
    amount: 4750.00,
    status: 'failed',
    method: 'Credit Card',
    date: '2024-01-20',
    dueDate: '2024-02-01',
    stripePaymentId: 'pi_1111222233'
  }
];

export function PaymentTracking() {
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'refunded': return <CreditCard className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRetryPayment = (paymentId: string) => {
    console.log('Retrying payment:', paymentId);
    // API integration point for Stripe retry
  };

  const handleRefund = (paymentId: string) => {
    console.log('Processing refund:', paymentId);
    // API integration point for Stripe refund
  };

  const handleViewInStripe = (stripePaymentId: string) => {
    console.log('Opening Stripe dashboard for:', stripePaymentId);
    // Open Stripe dashboard link
    window.open(`https://dashboard.stripe.com/payments/${stripePaymentId}`, '_blank');
  };

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalFailed = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor and manage payment statuses</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">${totalFailed.toLocaleString()}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {payments.filter(p => p.status === 'processing').length}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by invoice number or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-medium text-gray-900">{payment.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{payment.client}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {payment.date ? `Paid: ${payment.date}` : `Due: ${payment.dueDate}`}
                    </p>
                  </div>
                  
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    {payment.stripePaymentId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInStripe(payment.stripePaymentId!)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {payment.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryPayment(payment.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                    {payment.status === 'paid' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefund(payment.id)}
                      >
                        Refund
                      </Button>
                    )}
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
