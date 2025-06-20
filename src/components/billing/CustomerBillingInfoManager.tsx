import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Edit, Trash2, Plus } from 'lucide-react';
import { getCustomerBillingInfo, saveCustomerBillingInfo, deleteCustomerBillingInfo, getCustomers } from '@/lib/billingService';
import type { CustomerBillingInfo } from '@/types/billing';

export function CustomerBillingInfoManager() {
  const [infos, setInfos] = useState<CustomerBillingInfo[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CustomerBillingInfo | null>(null);
  const [form, setForm] = useState<Partial<CustomerBillingInfo>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [infos, custs] = await Promise.all([
        getCustomerBillingInfo(),
        getCustomers(),
      ]);
      setInfos(infos);
      setCustomers(custs);
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (info: CustomerBillingInfo) => {
    setEditing(info);
    setForm(info);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return;
    setLoading(true);
    try {
      await deleteCustomerBillingInfo(id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to delete record');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.customer_id || !form.billing_address) {
      setError('Customer and billing address are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveCustomerBillingInfo(form as CustomerBillingInfo);
      setEditing(null);
      setForm({});
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to save record');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customer Billing Info</h2>
        <Button onClick={() => { setEditing({} as CustomerBillingInfo); setForm({}); }}><Plus className="w-4 h-4 mr-1" /> New Record</Button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Billing Address</th>
                <th className="p-2 text-left">Tax Exempt</th>
                <th className="p-2 text-left">Payment Terms</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {infos.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4">No records found.</td></tr>
              ) : (
                infos.map(info => (
                  <tr key={info.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{customers.find(c => c.id === info.customer_id)?.name || info.customer_id}</td>
                    <td className="p-2">{info.billing_address}</td>
                    <td className="p-2">{info.tax_exempt ? 'Yes' : 'No'}</td>
                    <td className="p-2">{info.payment_terms}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(info)} title="Edit"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(info.id)} title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="font-bold mb-2">{editing.id ? 'Edit Record' : 'New Record'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Customer</label>
              <select value={form.customer_id || ''} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))} className="w-full border rounded p-2">
                <option value="">Select customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium">Billing Address</label>
              <Input value={form.billing_address || ''} onChange={e => setForm(f => ({ ...f, billing_address: e.target.value }))} />
            </div>
            <div>
              <label className="block font-medium">Tax Exempt</label>
              <select value={form.tax_exempt ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, tax_exempt: e.target.value === 'yes' }))} className="w-full border rounded p-2">
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Payment Terms (days)</label>
              <Input type="number" value={form.payment_terms || 30} onChange={e => setForm(f => ({ ...f, payment_terms: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => { setEditing(null); setForm({}); }} variant="outline">Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      )}
    </div>
  );
} 