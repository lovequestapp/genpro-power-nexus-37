import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  TrendingUp, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Calendar,
  Globe,
  Shield,
  Zap,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { StripeService } from '@/services/stripeService';
import { StripeConnectPopup } from '@/components/stripe/StripeConnectPopup';
import { StripeConnector } from '@/components/stripe/StripeConnector';
import { StripeAnalytics } from '@/components/stripe/StripeAnalytics';

export default function StripePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stripeData, setStripeData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setLoading(true);
    try {
      const account = await StripeService.getAccountStatus();
      setConnected(account.charges_enabled);
      if (account.charges_enabled) {
        await loadStripeData();
      }
    } catch (error) {
      console.log('Not connected to Stripe yet');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadStripeData = async () => {
    try {
      const [balance, payments, customers, products] = await Promise.all([
        StripeService.getBalance(),
        StripeService.getPayments(10),
        StripeService.getCustomers(10),
        StripeService.getProducts()
      ]);

      setStripeData({
        balance,
        payments: payments.data || [],
        customers: customers.data || [],
        products: products.data || []
      });
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load Stripe data",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await loadStripeData();
      toast({
        title: "Data refreshed",
        description: "Stripe data has been updated"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (type: 'payments' | 'customers' | 'all') => {
    try {
      const blob = await StripeService.exportData(type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stripe-${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: `${type} data has been exported`
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleCreatePayout = async () => {
    if (!stripeData?.balance?.available?.[0]?.amount) {
      toast({
        title: "No funds available",
        description: "There are no available funds to payout",
        variant: "destructive"
      });
      return;
    }

    try {
      await StripeService.createPayout(stripeData.balance.available[0].amount);
      toast({
        title: "Payout scheduled",
        description: "Your payout has been scheduled successfully"
      });
      await loadStripeData();
    } catch (error) {
      toast({
        title: "Payout failed",
        description: "Failed to schedule payout",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  if (!connected) {
    return (
      <div className="p-6">
        <StripeConnector onConnectionChange={setConnected} />
        <StripeConnectPopup 
          open={showConnectPopup}
          onOpenChange={setShowConnectPopup}
          onConnectionSuccess={() => {
            setConnected(true);
            checkConnectionStatus();
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your payments, customers, and account settings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Connected
          </Badge>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Stripe Dashboard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {stripeData && (
            <>
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(stripeData.balance?.available?.[0]?.amount || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Ready for payout</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(stripeData.balance?.pending?.[0]?.amount || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">Processing</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stripeData.customers?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">Active customers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => handleExportData('all')}
                    >
                      <Download className="w-6 h-6 mb-2" />
                      Export Data
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={handleCreatePayout}
                      disabled={!stripeData.balance?.available?.[0]?.amount}
                    >
                      <Calendar className="w-6 h-6 mb-2" />
                      Schedule Payout
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com/settings/account', '_blank')}
                    >
                      <Shield className="w-6 h-6 mb-2" />
                      Account Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                    >
                      <ExternalLink className="w-6 h-6 mb-2" />
                      Full Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Other tabs */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {stripeData?.payments?.length > 0 ? (
                <div className="space-y-4">
                  {stripeData.payments.map((payment: any) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{payment.customer || 'Unknown Customer'}</p>
                          <p className="text-sm text-gray-500">
                            {payment.id} • {new Date(payment.created * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No payments found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
            </CardHeader>
            <CardContent>
              {stripeData?.customers?.length > 0 ? (
                <div className="space-y-4">
                  {stripeData.customers.map((customer: any) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{customer.name || customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Created: {new Date(customer.created * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No customers found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Products & Pricing</h2>
              <Button onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Product
              </Button>
            </div>

            {stripeData?.products?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stripeData.products.map((product: any) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Badge variant={product.active ? 'default' : 'secondary'}>
                          {product.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => window.open(`https://dashboard.stripe.com/products/${product.id}`, '_blank')}
                          >
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500 mb-4">No products found</p>
                  <Button onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <StripeAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
