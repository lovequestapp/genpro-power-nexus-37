import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Edit, Trash2, CreditCard } from 'lucide-react';
import { getInvoice, deleteInvoice, getPayments, addPayment } from '@/lib/billingService';
import type { Invoice, Payment } from '@/types/billing';

interface BillingInvoiceViewProps {
  invoiceId: string;
  onBack: () => void;
  onEdit: () => void;
}

export function BillingInvoiceView({ invoiceId, onBack, onEdit }: BillingInvoiceViewProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const inv = await getInvoice(invoiceId);
      setInvoice(inv);
      const pays = await getPayments(invoiceId);
      setPayments(pays);
    } catch (e: any) {
      setError(e.message || 'Failed to load invoice');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [invoiceId]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this invoice?')) return;
    setLoading(true);
    try {
      await deleteInvoice(invoiceId);
      onBack();
    } catch (e: any) {
      setError(e.message || 'Failed to delete invoice');
    }
    setLoading(false);
  };

  const handleAddPayment = async () => {
    // For demo: add a payment of the remaining balance
    if (!invoice) return;
    setLoading(true);
    try {
      await addPayment(invoice.id, invoice.balance_due);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to add payment');
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>;
  if (!invoice) return <div className="text-red-600">Invoice not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h2>
        <div className="flex gap-2">
          <Button onClick={onEdit} variant="outline"><Edit className="w-4 h-4 mr-1" /> Edit</Button>
          <Button onClick={handleDelete} variant="outline"><Trash2 className="w-4 h-4 mr-1 text-red-600" /> Delete</Button>
          <Button onClick={onBack} variant="outline">Back</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium">Customer:</div>
          <div>{invoice.customer_name}</div>
          <div className="font-medium mt-2">Status:</div>
          <div className="capitalize">{invoice.status.replace('_', ' ')}</div>
        </div>
        <div>
          <div className="font-medium">Issue Date:</div>
          <div>{invoice.issue_date}</div>
          <div className="font-medium mt-2">Due Date:</div>
          <div>{invoice.due_date}</div>
        </div>
      </div>
      <div>
        <div className="font-medium mb-2">Line Items</div>
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Qty</th>
              <th className="p-2 text-left">Unit Price</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.line_items || []).map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2">{item.description}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">{item.unit_price.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</td>
                <td className="p-2">{item.total_amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium">Subtotal:</div>
          <div>{invoice.subtotal.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
          <div className="font-medium mt-2">Tax:</div>
          <div>{invoice.tax_amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
          <div className="font-medium mt-2">Discount:</div>
          <div>{invoice.discount_amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
        </div>
        <div>
          <div className="font-medium">Total:</div>
          <div>{invoice.total_amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
          <div className="font-medium mt-2">Paid:</div>
          <div>{invoice.amount_paid.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
          <div className="font-medium mt-2">Balance Due:</div>
          <div>{invoice.balance_due.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</div>
        </div>
      </div>
      <div>
        <div className="font-medium mb-2">Payments</div>
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Method</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={4} className="text-center p-4">No payments found.</td></tr>
            ) : (
              payments.map((p, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{p.payment_date}</td>
                  <td className="p-2">{p.amount.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}</td>
                  <td className="p-2">{p.payment_method}</td>
                  <td className="p-2 capitalize">{p.status.replace('_', ' ')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Button onClick={handleAddPayment} className="mt-2"><CreditCard className="w-4 h-4 mr-1" /> Add Payment</Button>
      </div>
    </div>
  );
} 