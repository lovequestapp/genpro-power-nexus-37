import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { getPayments, getPaymentStats } from '@/lib/billingService';
import type { Payment, PaymentStats } from '@/types/billing';

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

export function BillingPaymentTracking() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pays, stats] = await Promise.all([
        getPayments(undefined, { status: status === 'all' ? undefined : status, search }),
        getPaymentStats(),
      ]);
      setPayments(pays);
      setStats(stats);
    } catch (e: any) {
      setError(e.message || 'Failed to load payments');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [status, search]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <TabsList className="flex space-x-2">
          {statusTabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={status === tab.value ? 'bg-blue-100 text-blue-700' : ''}
              onClick={() => setStatus(tab.value)}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Input
          placeholder="Search payments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
      {stats && (
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded shadow">
            <div className="font-bold text-lg">Total Payments</div>
            <div className="text-2xl">{stats.total_payments}</div>
          </div>
          <div className="bg-green-50 p-4 rounded shadow">
            <div className="font-bold text-lg">Total Amount</div>
            <div className="text-2xl">{stats.total_amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded shadow">
            <div className="font-bold text-lg">This Month</div>
            <div className="text-2xl">{stats.this_month.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Method</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4">No payments found.</td></tr>
              ) : (
                payments.map((p, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{p.payment_date}</td>
                    <td className="p-2">{p.amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td className="p-2">{p.payment_method}</td>
                    <td className="p-2 capitalize">{p.status.replace('_', ' ')}</td>
                    <td className="p-2 font-mono">{p.invoice_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 