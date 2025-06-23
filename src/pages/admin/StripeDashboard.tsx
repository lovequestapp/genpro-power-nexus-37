import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Download,
  Settings,
  Link as LinkIcon,
  Zap,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { StripeAnalytics } from '@/components/stripe/StripeAnalytics';
import { StripeIntegration } from '@/components/invoicing/StripeIntegration';
import { StripeService } from '@/services/stripeService';
import { useToast } from '@/components/ui/use-toast';
import SEO from '../../components/SEO';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StripeData {
  account: any;
  balance: any;
  payments: any;
  customers: any;
  products: any;
}

export default function StripeDashboard() {
  const [loading, setLoading] = useState(true);
  const [stripeData, setStripeData] = useState<StripeData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const { toast } = useToast();

  useEffect(() => {
    fetchStripeData();
  }, []);

  const fetchStripeData = async () => {
    try {
      setLoading(true);
      const [account, balance, payments, customers, products] = await Promise.all([
        StripeService.getAccountStatus().catch(() => ({ charges_enabled: false })),
        StripeService.getBalance().catch(() => ({ available: [], pending: [] })),
        StripeService.getPayments(10).catch(() => ({ data: [] })),
        StripeService.getCustomers(10).catch(() => ({ data: [] })),
        StripeService.getProducts().catch(() => ({ data: [] }))
      ]);

      setStripeData({ account, balance, payments, customers, products });
    } catch (error) {
      console.error('Error fetching Stripe data:', error);
      toast({
        title: "Error",
        description: "Failed to load Stripe data",
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
      a.download = `stripe-${type}-export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: `${type} data exported successfully`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleCreatePayout = async () => {
    try {
      const availableBalance = stripeData?.balance?.available?.[0]?.amount || 0;
      if (availableBalance < 100) {
        toast({
          title: "Insufficient Balance",
          description: "Minimum payout amount is $1.00",
          variant: "destructive"
        });
        return;
      }

      await StripeService.createPayout(availableBalance);
      toast({
        title: "Payout Created",
        description: "Payout has been initiated successfully",
      });
      fetchStripeData();
    } catch (error) {
      toast({
        title: "Payout Failed",
        description: "Failed to create payout",
        variant: "destructive"
      });
    }
  };

  const MetricCard = ({ title, value, change, icon, trend, subtitle, color = "blue" }: any) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            ) : null}
            {change >= 0 ? '+' : ''}{change}% from last period
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800">Loading Stripe Dashboard...</h2>
          <p className="text-slate-600 mt-2">Fetching your payment data</p>
        </div>
      </div>
    );
  }

  const isConnected = stripeData?.account?.charges_enabled;
  const totalRevenue = stripeData?.payments?.data?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
  const totalCustomers = stripeData?.customers?.data?.length || 0;
  const availableBalance = stripeData?.balance?.available?.[0]?.amount || 0;
  const pendingBalance = stripeData?.balance?.pending?.[0]?.amount || 0;

  return (
    <>
      <SEO title="Admin Stripe Dashboard | HOU GEN PROS" description="Admin dashboard stripe dashboard page." canonical="/admin/stripe-dashboard" pageType="website" keywords="admin, stripe dashboard, dashboard" schema={null} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Stripe Dashboard</h1>
              <p className="text-slate-600 mt-2">Manage your payments, customers, and revenue</p>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Not Connected
                </Badge>
              )}
              <Button variant="outline" onClick={fetchStripeData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Revenue"
                  value={`$${(totalRevenue / 100).toFixed(2)}`}
                  change={8.2}
                  trend="up"
                  icon={<DollarSign className="h-4 w-4 text-green-600" />}
                  color="green"
                  subtitle="All time"
                />
                <MetricCard
                  title="Customers"
                  value={totalCustomers}
                  change={12.5}
                  trend="up"
                  icon={<Users className="h-4 w-4 text-blue-600" />}
                  color="blue"
                  subtitle="Active customers"
                />
                <MetricCard
                  title="Available Balance"
                  value={`$${(availableBalance / 100).toFixed(2)}`}
                  icon={<CreditCard className="h-4 w-4 text-purple-600" />}
                  color="purple"
                  subtitle="Ready for payout"
                />
                <MetricCard
                  title="Pending Balance"
                  value={`$${(pendingBalance / 100).toFixed(2)}`}
                  icon={<Calendar className="h-4 w-4 text-orange-600" />}
                  color="orange"
                  subtitle="Processing"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Recent Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stripeData?.payments?.data?.slice(0, 5).map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{payment.currency.toUpperCase()}</p>
                          </div>
                          <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleCreatePayout}
                      disabled={availableBalance < 100}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Create Payout ({availableBalance < 100 ? 'Insufficient funds' : `$${(availableBalance / 100).toFixed(2)}`})
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleExportData('payments')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Payments
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleExportData('customers')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Customers
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => handleExportData('all')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <StripeAnalytics timeRange={selectedTimeRange as any} />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              {/* Transaction Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stripeData?.payments?.data?.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(payment.created * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={payment.status === 'succeeded' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">ID: {payment.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <StripeIntegration />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
