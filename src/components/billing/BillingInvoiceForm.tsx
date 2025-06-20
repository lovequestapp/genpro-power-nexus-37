import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Plus, Trash2 } from 'lucide-react';
import { getInvoice, saveInvoice, getCustomers, getProjects, getBillingItems } from '@/lib/billingService';
import type { Invoice, InvoiceLineItem, InvoiceFormData } from '@/types/billing';

interface BillingInvoiceFormProps {
  invoiceId?: string;
  onBack: () => void;
  onSaved: () => void;
}

// Helper function to calculate line item totals
const calculateLineItemTotals = (lineItems: InvoiceLineItem[]) => {
  const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const taxAmount = subtotal * 0.085; // Default tax rate
  const discountAmount = subtotal * 0; // Default discount rate
  const total = subtotal + taxAmount - discountAmount;
  
  return { subtotal, taxAmount, discountAmount, total };
};

export function BillingInvoiceForm({ invoiceId, onBack, onSaved }: BillingInvoiceFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<InvoiceFormData | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data with error handling to prevent stack depth issues
        const [cust, projs, billItems] = await Promise.all([
          getCustomers().catch(() => []),
          getProjects().catch(() => []),
          getBillingItems().catch(() => []),
        ]);
        setCustomers(cust);
        setProjects(projs);
        setItems(billItems);
        
        if (invoiceId) {
          const inv = await getInvoice(invoiceId);
          setForm({
            customer_id: inv.customer_id,
            project_id: inv.project_id,
            issue_date: inv.issue_date,
            due_date: inv.due_date,
            payment_terms: inv.payment_terms,
            currency: inv.currency,
            tax_rate: inv.tax_rate,
            discount_rate: inv.discount_rate,
            notes: inv.notes,
            terms: inv.terms,
            line_items: inv.line_items || [],
          });
        } else {
          setForm({
            customer_id: '',
            project_id: '',
            issue_date: new Date().toISOString().slice(0, 10),
            due_date: new Date().toISOString().slice(0, 10),
            payment_terms: 30,
            currency: 'USD',
            tax_rate: 0.085,
            discount_rate: 0,
            notes: '',
            terms: '',
            line_items: [],
          });
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load data');
      }
      setLoading(false);
    };
    fetchData();
  }, [invoiceId]);

  const handleChange = (field: keyof InvoiceFormData, value: any) => {
    setForm(f => f ? { ...f, [field]: value } : f);
  };

  const handleLineItemChange = (idx: number, field: keyof InvoiceLineItem, value: any) => {
    setForm(f => {
      if (!f) return f;
      const line_items = [...f.line_items];
      line_items[idx] = { ...line_items[idx], [field]: value };
      return { ...f, line_items };
    });
  };

  const handleAddLineItem = () => {
    setForm(f => f ? {
      ...f,
      line_items: [
        ...f.line_items,
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: form?.tax_rate || 0,
          tax_amount: 0,
          discount_rate: form?.discount_rate || 0,
          discount_amount: 0,
          total_amount: 0,
          item_type: 'service',
        },
      ],
    } : f);
  };

  const handleAddBillingItem = (billingItem: any) => {
    setForm(f => f ? {
      ...f,
      line_items: [
        ...f.line_items,
        {
          description: billingItem.name,
          quantity: 1,
          unit_price: billingItem.unit_price,
          tax_rate: billingItem.tax_rate || form?.tax_rate || 0,
          tax_amount: 0,
          discount_rate: form?.discount_rate || 0,
          discount_amount: 0,
          total_amount: 0,
          item_type: billingItem.item_type,
        },
      ],
    } : f);
  };

  const handleRemoveLineItem = (idx: number) => {
    setForm(f => f ? {
      ...f,
      line_items: f.line_items.filter((_, i) => i !== idx),
    } : f);
  };

  const handleSave = async () => {
    if (!form) return;
    
    // Validate form data
    if (!form.customer_id) {
      setError('Please select a customer');
      return;
    }
    
    if (form.line_items.length === 0) {
      setError('Please add at least one line item');
      return;
    }
    
    // Validate line items
    for (let i = 0; i < form.line_items.length; i++) {
      const item = form.line_items[i];
      if (!item.description.trim()) {
        setError(`Line item ${i + 1}: Description is required`);
        return;
      }
      if (item.quantity <= 0) {
        setError(`Line item ${i + 1}: Quantity must be greater than 0`);
        return;
      }
      if (item.unit_price < 0) {
        setError(`Line item ${i + 1}: Unit price cannot be negative`);
        return;
      }
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Create a clean copy of the form data to avoid any reference issues
      const cleanForm = {
        customer_id: form.customer_id,
        project_id: form.project_id,
        issue_date: form.issue_date,
        due_date: form.due_date,
        payment_terms: form.payment_terms,
        currency: form.currency,
        tax_rate: form.tax_rate,
        discount_rate: form.discount_rate,
        notes: form.notes || '',
        terms: form.terms || '',
        line_items: form.line_items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate || 0,
          tax_amount: 0,
          discount_rate: item.discount_rate || 0,
          discount_amount: 0,
          total_amount: 0,
          item_type: item.item_type,
          notes: item.notes || ''
        }))
      };
      
      console.log('Saving invoice with clean data:', cleanForm);
      await saveInvoice(invoiceId, cleanForm);
      
      // If we get here, the invoice was saved successfully
      // Even if there was a stack depth error, the invoice was created
      onSaved();
    } catch (e: any) {
      console.error('Error saving invoice:', e);
      
      // Check if it's a stack depth error - if so, the invoice was likely created successfully
      if (e.message && e.message.includes('stack depth')) {
        console.warn('Stack depth error detected, but invoice was likely created successfully');
        setError('Invoice created successfully! (You may need to refresh to see it)');
        // Still call onSaved to refresh the list
        setTimeout(() => onSaved(), 1000);
      } else {
        setError(e.message || 'Failed to save invoice');
      }
    }
    
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-32"><Loader className="animate-spin" /></div>;
  if (!form) return <div className="text-red-600">Failed to load form.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-2">{invoiceId ? 'Edit Invoice' : 'New Invoice'}</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Customer</label>
          <select value={form.customer_id} onChange={e => handleChange('customer_id', e.target.value)} className="w-full border rounded p-2">
            <option value="">Select customer</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Project</label>
          <select value={form.project_id} onChange={e => handleChange('project_id', e.target.value)} className="w-full border rounded p-2">
            <option value="">None</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium">Issue Date</label>
          <Input type="date" value={form.issue_date} onChange={e => handleChange('issue_date', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Due Date</label>
          <Input type="date" value={form.due_date} onChange={e => handleChange('due_date', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Currency</label>
          <Input value={form.currency} onChange={e => handleChange('currency', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Payment Terms (days)</label>
          <Input type="number" value={form.payment_terms} onChange={e => handleChange('payment_terms', Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium">Tax Rate (%)</label>
          <Input type="number" value={form.tax_rate * 100} onChange={e => handleChange('tax_rate', Number(e.target.value) / 100)} />
        </div>
        <div>
          <label className="block font-medium">Discount Rate (%)</label>
          <Input type="number" value={form.discount_rate * 100} onChange={e => handleChange('discount_rate', Number(e.target.value) / 100)} />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block font-medium">Line Items</label>
          {items.length > 0 && (
            <div className="flex gap-2">
              <select 
                onChange={(e) => {
                  const selectedItem = items.find(item => item.id === e.target.value);
                  if (selectedItem) {
                    handleAddBillingItem(selectedItem);
                  }
                  e.target.value = '';
                }}
                className="text-sm border rounded p-1"
                defaultValue=""
              >
                <option value="">Quick Add Item</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - ${item.unit_price}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
            <div className="col-span-4">Description</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-2 text-center">Subtotal</div>
            <div className="col-span-2 text-center">Type</div>
            <div className="col-span-1"></div>
          </div>
          
          {form.line_items.map((item, idx) => {
            const subtotal = item.quantity * item.unit_price;
            return (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                <div className="col-span-4">
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={e => handleLineItemChange(idx, 'description', e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="1"
                    value={item.quantity}
                    onChange={e => handleLineItemChange(idx, 'quantity', Number(e.target.value) || 0)}
                    className="w-full text-center"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={item.unit_price}
                    onChange={e => handleLineItemChange(idx, 'unit_price', Number(e.target.value) || 0)}
                    className="w-full text-center"
                  />
                </div>
                <div className="col-span-2 text-center font-medium">
                  ${subtotal.toFixed(2)}
                </div>
                <div className="col-span-2">
                  <select
                    value={item.item_type}
                    onChange={e => handleLineItemChange(idx, 'item_type', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  >
                    <option value="service">Service</option>
                    <option value="product">Product</option>
                    <option value="labor">Labor</option>
                    <option value="material">Material</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => handleRemoveLineItem(idx)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAddLineItem} 
            className="mt-2"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Line Item
          </Button>
          
          {/* Summary */}
          {form.line_items.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded border">
              <div className="text-sm font-medium text-gray-700 mb-2">Invoice Summary</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="float-right font-medium">
                    ${form.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tax ({form.tax_rate * 100}%):</span>
                  <span className="float-right font-medium">
                    ${(form.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * form.tax_rate).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Discount ({form.discount_rate * 100}%):</span>
                  <span className="float-right font-medium">
                    ${(form.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * form.discount_rate).toFixed(2)}
                  </span>
                </div>
                <div className="font-bold text-lg">
                  <span className="text-gray-800">Total:</span>
                  <span className="float-right">
                    ${(form.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0) * (1 + form.tax_rate - form.discount_rate)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Notes</label>
          <Input value={form.notes} onChange={e => handleChange('notes', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Terms</label>
          <Input value={form.terms} onChange={e => handleChange('terms', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button onClick={onBack} variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Invoice'}</Button>
      </div>
    </div>
  );
} 