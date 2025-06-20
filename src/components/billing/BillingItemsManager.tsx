import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Edit, Trash2, Plus } from 'lucide-react';
import { getBillingItems, saveBillingItem, deleteBillingItem } from '@/lib/billingService';
import type { BillingItem } from '@/types/billing';

export function BillingItemsManager() {
  const [items, setItems] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BillingItem | null>(null);
  const [form, setForm] = useState<Partial<BillingItem>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBillingItems();
      setItems(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load items');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: BillingItem) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this item?')) return;
    setLoading(true);
    try {
      await deleteBillingItem(id);
      fetchItems();
    } catch (e: any) {
      setError(e.message || 'Failed to delete item');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.unit_price) {
      setError('Name and unit price are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveBillingItem(form as BillingItem);
      setEditing(null);
      setForm({});
      fetchItems();
    } catch (e: any) {
      setError(e.message || 'Failed to save item');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Billing Items</h2>
        <Button onClick={() => { setEditing({} as BillingItem); setForm({}); }}><Plus className="w-4 h-4 mr-1" /> New Item</Button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Unit Price</th>
                <th className="p-2 text-left">Tax Rate</th>
                <th className="p-2 text-left">Active</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4">No items found.</td></tr>
              ) : (
                items.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 capitalize">{item.item_type}</td>
                    <td className="p-2">{item.unit_price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</td>
                    <td className="p-2">{(item.tax_rate * 100).toFixed(2)}%</td>
                    <td className="p-2">{item.is_active ? 'Yes' : 'No'}</td>
                    <td className="p-2 flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)} title="Edit"><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 className="w-4 h-4 text-red-600" /></Button>
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
          <h3 className="font-bold mb-2">{editing.id ? 'Edit Item' : 'New Item'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block font-medium">Type</label>
              <select value={form.item_type || 'service'} onChange={e => setForm(f => ({ ...f, item_type: e.target.value }))} className="w-full border rounded p-2">
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="labor">Labor</option>
                <option value="material">Material</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Unit Price</label>
              <Input type="number" value={form.unit_price || 0} onChange={e => setForm(f => ({ ...f, unit_price: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="block font-medium">Tax Rate (%)</label>
              <Input type="number" value={form.tax_rate ? form.tax_rate * 100 : 0} onChange={e => setForm(f => ({ ...f, tax_rate: Number(e.target.value) / 100 }))} />
            </div>
            <div>
              <label className="block font-medium">Active</label>
              <select value={form.is_active ? 'yes' : 'no'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'yes' }))} className="w-full border rounded p-2">
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Category</label>
              <Input value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
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