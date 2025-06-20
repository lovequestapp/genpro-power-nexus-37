import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, Eye, Edit, Trash2 } from 'lucide-react';
import { getInvoices, deleteInvoice } from '@/lib/billingService';
import type { Invoice } from '@/types/billing';

interface BillingInvoiceListProps {
  onCreateInvoice: () => void;
  onViewInvoice: (id: string) => void;
  onEditInvoice: (id: string) => void;
}

const statusTabs = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Cancelled', value: 'cancelled' },
];

export function BillingInvoiceList({ onCreateInvoice, onViewInvoice, onEditInvoice }: BillingInvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInvoices({ status: status === 'all' ? undefined : status, search });
      setInvoices(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load invoices');
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
    } catch (e: any) {
      setError(e.message || 'Failed to delete invoice');
    }
    setLoading(false);
  };

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
          placeholder="Search invoices..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Button onClick={onCreateInvoice} className="ml-2">New Invoice</Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Issue Date</th>
                <th className="p-2 text-left">Due Date</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Paid</th>
                <th className="p-2 text-left">Balance</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={9} className="text-center p-4">No invoices found.</td></tr>
              ) : (
                invoices.map(inv => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-mono">{inv.invoice_number}</td>
                    <td className="p-2">{inv.customer_name}</td>
                    <td className="p-2 capitalize">{inv.status.replace('_', ' ')}</td>
                    <td className="p-2">{inv.issue_date}</td>
                    <td className="p-2">{inv.due_date}</td>
                    <td className="p-2">{inv.total_amount.toLocaleString(undefined, { style: 'currency', currency: inv.currency })}</td>
                    <td className="p-2">{inv.amount_paid.toLocaleString(undefined, { style: 'currency', currency: inv.currency })}</td>
                    <td className="p-2">{inv.balance_due.toLocaleString(undefined, { style: 'currency', currency: inv.currency })}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => onViewInvoice(inv.id)} title="View"><Eye className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => onEditInvoice(inv.id)} title="Edit"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(inv.id)} title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </td>
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