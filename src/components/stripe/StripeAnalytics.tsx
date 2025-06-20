
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface StripeAnalyticsProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

export function StripeAnalytics({ timeRange = '30d' }: StripeAnalyticsProps) {
  const [selectedRange, setSelectedRange] = useState(timeRange);
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      current: 45280,
      previous: 38950,
      change: 16.3,
      trend: 'up' as const
    },
    transactions: {
      current: 156,
      previous: 142,
      change: 9.9,
      trend: 'up' as const
    },
    customers: {
      current: 89,
      previous: 76,
      change: 17.1,
      trend: 'up' as const
    },
    avgOrderValue: {
      current: 290.26,
      previous: 274.30,
      change: 5.8,
      trend: 'up' as const
    },
    revenueChart: [
      { date: '2024-01-01', revenue: 3200, transactions: 12 },
      { date: '2024-01-02', revenue: 4100, transactions: 15 },
      { date: '2024-01-03', revenue: 2800, transactions: 10 },
      { date: '2024-01-04', revenue: 5200, transactions: 18 },
      { date: '2024-01-05', revenue: 4600, transactions: 16 },
      { date: '2024-01-06', revenue: 3900, transactions: 14 },
      { date: '2024-01-07', revenue: 4800, transactions: 17 }
    ],
    paymentMethods: [
      { name: 'Credit Card', value: 65, amount: 29432 },
      { name: 'Debit Card', value: 20, amount: 9056 },
      { name: 'Bank Transfer', value: 10, amount: 4528 },
      { name: 'Digital Wallet', value: 5, amount: 2264 }
    ],
    topProducts: [
      { name: 'Generator Installation', revenue: 18500, orders: 15 },
      { name: 'Maintenance Service', revenue: 12800, orders: 42 },
      { name: 'Emergency Repair', revenue: 8900, orders: 23 },
      { name: 'System Upgrade', revenue: 5080, orders: 8 }
    ]
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const MetricCard = ({ title, current, previous, change, trend, icon, format = 'number' }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format === 'currency' ? formatCurrency(current) : current.toLocaleString()}
        </div>
        <div className={`flex items-center text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3 mr-1" />
          ) : (
            <ArrowDownRight className="w-3 h-3 mr-1" />
          )}
          {change}% from last period
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRange(range as any)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          current={analyticsData.revenue.current}
          previous={analyticsData.revenue.previous}
          change={analyticsData.revenue.change}
          trend={analyticsData.revenue.trend}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          format="currency"
        />
        <MetricCard
          title="Transactions"
          current={analyticsData.transactions.current}
          previous={analyticsData.transactions.previous}
          change={analyticsData.transactions.change}
          trend={analyticsData.transactions.trend}
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Customers"
          current={analyticsData.customers.current}
          previous={analyticsData.customers.previous}
          change={analyticsData.customers.change}
          trend={analyticsData.customers.trend}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg Order Value"
          current={analyticsData.avgOrderValue.current}
          previous={analyticsData.avgOrderValue.previous}
          change={analyticsData.avgOrderValue.change}
          trend={analyticsData.avgOrderValue.trend}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          format="currency"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenue' : 'Transactions'
                  ]}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" />
                <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.paymentMethods}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
