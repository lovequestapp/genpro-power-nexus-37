import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ArrowUpDown,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  DollarSign,
  FileText,
  Users,
  BarChart,
} from 'lucide-react';

type SyncStatus = 'synced' | 'syncing' | 'error' | 'not_connected';

export default function QuickBooksPage() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());

  // Mock financial data
  const financialOverview = {
    revenue: {
      total: 128500,
      change: 12.3,
      trend: 'up' as const,
    },
    expenses: {
      total: 45600,
      change: -5.2,
      trend: 'down' as const,
    },
    profit: {
      total: 82900,
      change: 8.7,
      trend: 'up' as const,
    },
    invoices: {
      total: 156,
      pending: 12,
      overdue: 3,
    },
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">QuickBooks Integration</h1>
          <p className="text-muted-foreground mt-1">
            Manage your QuickBooks connection and view financial data
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncStatus === 'syncing'}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      {/* Sync Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Connection Status</h2>
            <div className="flex items-center gap-2">
              {syncStatus === 'synced' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-500">Connected and synced</span>
                </>
              )}
              {syncStatus === 'syncing' && (
                <>
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-blue-500">Syncing data...</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-500">Sync error</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last synced</p>
            <p className="font-medium">{lastSync.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
            <Badge variant={financialOverview.revenue.trend === 'up' ? 'default' : 'destructive'}>
              {financialOverview.revenue.change}%
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <h3 className="text-2xl font-bold">${financialOverview.revenue.total.toLocaleString()}</h3>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-100 rounded-full">
              <ArrowUpDown className="w-6 h-6 text-red-700" />
            </div>
            <Badge variant={financialOverview.expenses.trend === 'up' ? 'destructive' : 'default'}>
              {financialOverview.expenses.change}%
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <h3 className="text-2xl font-bold">${financialOverview.expenses.total.toLocaleString()}</h3>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart className="w-6 h-6 text-blue-700" />
            </div>
            <Badge variant={financialOverview.profit.trend === 'up' ? 'default' : 'destructive'}>
              {financialOverview.profit.change}%
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <h3 className="text-2xl font-bold">${financialOverview.profit.total.toLocaleString()}</h3>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-full">
              <FileText className="w-6 h-6 text-purple-700" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{financialOverview.invoices.pending} pending</Badge>
              <Badge variant="destructive">{financialOverview.invoices.overdue} overdue</Badge>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <h3 className="text-2xl font-bold">{financialOverview.invoices.total}</h3>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button variant="outline" className="h-24">
          <div className="text-center">
            <FileText className="w-6 h-6 mx-auto mb-2" />
            <span>Create Invoice</span>
          </div>
        </Button>
        <Button variant="outline" className="h-24">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span>Manage Customers</span>
          </div>
        </Button>
        <Button variant="outline" className="h-24">
          <div className="text-center">
            <BarChart className="w-6 h-6 mx-auto mb-2" />
            <span>View Reports</span>
          </div>
        </Button>
      </div>
    </div>
  );
} 