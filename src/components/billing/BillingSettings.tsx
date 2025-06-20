import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';
import { getBillingSettings, saveBillingSettings } from '@/lib/billingService';
import type { BillingSettings as BillingSettingsType } from '@/types/billing';

export function BillingSettings() {
  const [settings, setSettings] = useState<BillingSettingsType | null>(null);
  const [form, setForm] = useState<Partial<BillingSettingsType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBillingSettings();
      setSettings(data);
      setForm(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load settings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (field: keyof BillingSettingsType, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveBillingSettings(form as BillingSettingsType);
      fetchSettings();
    } catch (e: any) {
      setError(e.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>;
  if (!form) return <div className="text-red-600">Failed to load settings.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-2">Billing Settings</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Company Name</label>
          <Input value={form.company_name || ''} onChange={e => handleChange('company_name', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Company Email</label>
          <Input value={form.company_email || ''} onChange={e => handleChange('company_email', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Company Phone</label>
          <Input value={form.company_phone || ''} onChange={e => handleChange('company_phone', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Company Address</label>
          <Input value={form.company_address || ''} onChange={e => handleChange('company_address', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Default Currency</label>
          <Input value={form.default_currency || ''} onChange={e => handleChange('default_currency', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Default Tax Rate (%)</label>
          <Input type="number" value={form.default_tax_rate ? form.default_tax_rate * 100 : 0} onChange={e => handleChange('default_tax_rate', Number(e.target.value) / 100)} />
        </div>
        <div>
          <label className="block font-medium">Default Payment Terms (days)</label>
          <Input type="number" value={form.default_payment_terms || 30} onChange={e => handleChange('default_payment_terms', Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Invoice Prefix</label>
          <Input value={form.invoice_prefix || ''} onChange={e => handleChange('invoice_prefix', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Invoice Start Number</label>
          <Input type="number" value={form.invoice_start_number || 1000} onChange={e => handleChange('invoice_start_number', Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Auto Numbering</label>
          <select value={form.auto_numbering ? 'yes' : 'no'} onChange={e => handleChange('auto_numbering', e.target.value === 'yes')} className="w-full border rounded p-2">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Default Notes</label>
          <Input value={form.default_notes || ''} onChange={e => handleChange('default_notes', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Default Terms</label>
          <Input value={form.default_terms || ''} onChange={e => handleChange('default_terms', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </div>
  );
} 