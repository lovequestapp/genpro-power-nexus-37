import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Download,
  Calendar,
  Shield,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';
import { StripeService } from '@/services/stripeService';
import { StripeConnectPopup } from '@/components/stripe/StripeConnectPopup';
import SEO from '../../components/SEO';

export default function StripePage() {
  const [loading, setLoading] = useState(false);
  const [showConnectPopup, setShowConnectPopup] = useState(false);
  const [connected, setConnected] = useState(false);
  const [stripeData, setStripeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const account = await StripeService.getAccountStatus();
      setConnected(account.charges_enabled);
      if (account.charges_enabled) {
        await loadStripeData();
      }
    } catch (error) {
      console.log('Not connected to Stripe yet');
      setConnected(false);
      setError(null); // Don't show error for not being connected
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

  const handleConnect = async () => {
    setShowConnectPopup(true);
  };

  const handleConnectionSuccess = () => {
    setConnected(true);
    checkConnectionStatus();
    toast({
      title: "Successfully connected!",
      description: "Your Stripe account is now connected"
    });
  };

  const formatCurrency = (amount: number, currency = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  // Show connection interface if not connected
  if (!connected) {
    return (
      <>
        <SEO title="Admin Stripe | HOU GEN PROS" description="Admin dashboard stripe page." canonical="/admin/stripe" pageType="website" keywords="admin, stripe, dashboard" schema={null} />
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect to Stripe</h1>
              <p className="text-gray-600">Connect your Stripe account to start accepting payments and managing your business</p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Connection Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Connect Your Stripe Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Connect your Stripe account to start accepting payments and managing your business directly from this dashboard.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Secure</p>
                      <p className="text-sm text-blue-700">Bank-level security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Fast Setup</p>
                      <p className="text-sm text-green-700">5-minute onboarding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <Globe className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-900">Global</p>
                      <p className="text-sm text-purple-700">Worldwide payments</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Secure OAuth connection
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    No sensitive data stored locally
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Full control over permissions
                  </div>
                </div>
                
                <Button 
                  onClick={handleConnect} 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Checking connection...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect with Stripe
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  By connecting, you agree to Stripe's Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>

            {/* Alternative Options */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 mb-4">Already have a Stripe account?</p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Stripe Dashboard
              </Button>
            </div>
          </div>

          <StripeConnectPopup 
            open={showConnectPopup}
            onOpenChange={setShowConnectPopup}
            onConnectionSuccess={handleConnectionSuccess}
          />
        </div>
      </>
    );
  }

  // Show dashboard if connected
  return (
    <>
      <SEO title="Admin Stripe | HOU GEN PROS" description="Admin dashboard stripe page." canonical="/admin/stripe" pageType="website" keywords="admin, stripe, dashboard" schema={null} />
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
            <Button variant="outline" onClick={checkConnectionStatus} disabled={loading}>
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

        {/* Connected Dashboard Content */}
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {stripeData.payments?.length > 0 ? (
                    <div className="space-y-4">
                      {stripeData.payments.slice(0, 5).map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{payment.customer || 'Unknown Customer'}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.created * 1000).toLocaleDateString()}
                            </p>
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
                    <p className="text-center text-gray-500 py-4">No payments found</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
                    >
                      <CreditCard className="w-6 h-6 mb-2" />
                      Manage Products
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com/customers', '_blank')}
                    >
                      <Users className="w-6 h-6 mb-2" />
                      View Customers
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com/settings', '_blank')}
                    >
                      <Shield className="w-6 h-6 mb-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col"
                      onClick={() => window.open('https://dashboard.stripe.com/reports', '_blank')}
                    >
                      <TrendingUp className="w-6 h-6 mb-2" />
                      Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
