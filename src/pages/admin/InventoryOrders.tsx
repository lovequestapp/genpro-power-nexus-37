import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Edit, Trash2, RefreshCw, Package, AlertTriangle, CheckCircle, XCircle, Truck, FileText, UserPlus } from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { PurchaseOrder, Supplier, PurchaseOrderItem } from '@/types/inventory';

// Import Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Supporting Components ---
// Minimal inline versions for now; can be split out later
function OrderItemRow({ item, onEdit, onDelete }: { item: Partial<PurchaseOrderItem>, onEdit: () => void, onDelete: () => void }) {
  return (
    <TableRow>
      <TableCell>{item.item_name}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>${item.unit_cost?.toFixed(2) ?? '0.00'}</TableCell>
      <TableCell>${item.total_cost?.toFixed(2) ?? '0.00'}</TableCell>
      <TableCell>
        <Button variant="ghost" size="sm" onClick={onEdit}><Edit className="w-4 h-4" /></Button>
        <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="w-4 h-4" /></Button>
      </TableCell>
    </TableRow>
  );
}

function OrderItemEditor({ item, onSave, onCancel }: { item: Partial<PurchaseOrderItem>, onSave: (item: Partial<PurchaseOrderItem>) => void, onCancel: () => void }) {
  const [form, setForm] = useState<Partial<PurchaseOrderItem>>(item || {});
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      setError(null);
      if (!form.item_name || !form.quantity || !form.unit_cost) {
        setError('Please fill in all required fields');
        return;
      }
      onSave(form);
    } catch (err) {
      console.error('Error saving item:', err);
      setError('Failed to save item');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <div>
          <label className="text-sm font-medium">Item Name *</label>
          <Input 
            placeholder="Item name" 
            value={form.item_name || ''} 
            onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Quantity *</label>
          <Input 
            type="number" 
            placeholder="Quantity" 
            value={form.quantity || ''} 
            onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) || 0 }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Unit Cost *</label>
          <Input 
            type="number" 
            placeholder="Unit cost" 
            value={form.unit_cost || ''} 
            onChange={e => setForm(f => ({ ...f, unit_cost: Number(e.target.value) || 0 }))} 
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!form.item_name || !form.quantity || !form.unit_cost}>
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function SupplierForm({ onSave, onCancel }: { onSave: (supplier: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    payment_terms: 'Net 30',
    notes: ''
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Supplier Name *</label>
          <Input 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            placeholder="Enter supplier name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contact Name</label>
          <Input 
            value={form.contact_name} 
            onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} 
            placeholder="Contact person name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input 
            type="email"
            value={form.email} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            placeholder="supplier@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input 
            value={form.phone} 
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} 
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <Input 
            value={form.address} 
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))} 
            placeholder="Full address"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Website</label>
          <Input 
            value={form.website} 
            onChange={e => setForm(f => ({ ...f, website: e.target.value }))} 
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Payment Terms</label>
          <Select value={form.payment_terms} onValueChange={v => setForm(f => ({ ...f, payment_terms: v }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Net 30">Net 30</SelectItem>
              <SelectItem value="Net 15">Net 15</SelectItem>
              <SelectItem value="Net 60">Net 60</SelectItem>
              <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Notes</label>
        <Input 
          value={form.notes} 
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} 
          placeholder="Additional notes about this supplier"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button onClick={() => onSave(form)} disabled={!form.name}>Save Supplier</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

function PurchaseOrderForm({
  order,
  suppliers,
  onSave,
  onCancel,
  onSupplierCreated
}: {
  order?: Partial<PurchaseOrder>,
  suppliers: Supplier[],
  onSave: (orderData: Partial<PurchaseOrder> & { items: Partial<PurchaseOrderItem>[] }) => void,
  onCancel: () => void,
  onSupplierCreated: (supplier: Supplier) => void
}) {
  console.log('PurchaseOrderForm: Component rendering', { order: !!order, suppliersCount: suppliers.length });
  
  const [form, setForm] = useState<Partial<PurchaseOrder>>(order || {});
  const [items, setItems] = useState<Partial<PurchaseOrderItem>[]>(order?.items || []);
  const [editingItem, setEditingItem] = useState<Partial<PurchaseOrderItem> | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate totals
  const subtotal = items.reduce((sum, it) => sum + ((it.quantity || 0) * (it.unit_cost || 0)), 0);
  const tax = form.tax_amount || 0;
  const shipping = form.shipping_amount || 0;
  const total = subtotal + tax + shipping;

  // Validate form using useMemo to prevent infinite re-renders
  const { isFormValid, errors } = React.useMemo(() => {
    try {
      const errors: string[] = [];
      if (!form.po_number) errors.push('PO Number is required');
      if (!form.supplier_id) errors.push('Supplier is required');
      if (!form.order_date) errors.push('Order Date is required');
      if (items.length === 0) errors.push('At least one item is required');
      return { isFormValid: errors.length === 0, errors };
    } catch (error) {
      console.error('PurchaseOrderForm: Error validating form:', error);
      return { isFormValid: false, errors: ['Form validation error'] };
    }
  }, [form.po_number, form.supplier_id, form.order_date, items.length]);

  // Update validation errors when they change
  React.useEffect(() => {
    setValidationErrors(errors);
  }, [errors]);

  const handleAddItem = () => {
    console.log('PurchaseOrderForm: Adding item');
    try {
      setEditingItem({ item_name: '', quantity: 1, unit_cost: 0 });
      setEditingIndex(null);
    } catch (error) {
      console.error('PurchaseOrderForm: Error adding item:', error);
      setFormError('Failed to add item');
    }
  };

  const handleEditItem = (item: Partial<PurchaseOrderItem>, idx: number) => {
    console.log('PurchaseOrderForm: Editing item', idx);
    try {
      setEditingItem(item);
      setEditingIndex(idx);
    } catch (error) {
      console.error('PurchaseOrderForm: Error editing item:', error);
      setFormError('Failed to edit item');
    }
  };

  const handleSaveItem = (item: Partial<PurchaseOrderItem>) => {
    console.log('PurchaseOrderForm: Saving item', item);
    try {
      if (editingIndex !== null) {
        setItems(items => items.map((it, idx) => idx === editingIndex ? { ...item, total_cost: (item.quantity || 0) * (item.unit_cost || 0) } : it));
      } else {
        setItems(items => [...items, { ...item, total_cost: (item.quantity || 0) * (item.unit_cost || 0) }]);
      }
      setEditingItem(null);
      setEditingIndex(null);
      setFormError(null);
    } catch (error) {
      console.error('PurchaseOrderForm: Error saving item:', error);
      setFormError('Failed to save item');
    }
  };

  const handleDeleteItem = (idx: number) => {
    console.log('PurchaseOrderForm: Deleting item', idx);
    try {
      setItems(items => items.filter((_, i) => i !== idx));
      setFormError(null);
    } catch (error) {
      console.error('PurchaseOrderForm: Error deleting item:', error);
      setFormError('Failed to delete item');
    }
  };

  const handleCreateSupplier = async (supplierData: any) => {
    console.log('PurchaseOrderForm: Creating supplier', supplierData);
    try {
      setFormError(null);
      const newSupplier = await supabaseService.createSupplier(supplierData);
      onSupplierCreated(newSupplier);
      setShowSupplierForm(false);
      // Auto-select the newly created supplier
      setForm(f => ({ ...f, supplier_id: newSupplier.id }));
    } catch (error) {
      console.error('PurchaseOrderForm: Error creating supplier:', error);
      setFormError('Failed to create supplier');
    }
  };

  const handleSave = () => {
    console.log('PurchaseOrderForm: Saving order', { form, items });
    try {
      setFormError(null);
      onSave({ ...form, items } as any);
    } catch (error) {
      console.error('PurchaseOrderForm: Error saving order:', error);
      setFormError('Failed to save order');
    }
  };

  console.log('PurchaseOrderForm: Render state', { 
    formError, 
    validationErrors: validationErrors.length,
    itemsCount: items.length,
    editingItem: !!editingItem,
    showSupplierForm,
    isFormValid
  });

  return (
    <div className="space-y-4">
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{formError}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">PO Number *</label>
          <Input 
            value={form.po_number || ''} 
            onChange={e => setForm(f => ({ ...f, po_number: e.target.value }))} 
            placeholder="PO-2024-001"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Supplier *</label>
          <div className="flex gap-2">
            <Select value={form.supplier_id || ''} onValueChange={v => setForm(f => ({ ...f, supplier_id: v }))}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSupplierForm(true)}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Order Date *</label>
          <Input 
            type="date" 
            value={form.order_date || ''} 
            onChange={e => setForm(f => ({ ...f, order_date: e.target.value }))} 
          />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={form.status || 'draft'} onValueChange={v => setForm(f => ({ ...f, status: v as any }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Tax Amount</label>
          <Input 
            type="number" 
            value={form.tax_amount || 0} 
            onChange={e => setForm(f => ({ ...f, tax_amount: Number(e.target.value) }))} 
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Shipping Amount</label>
          <Input 
            type="number" 
            value={form.shipping_amount || 0} 
            onChange={e => setForm(f => ({ ...f, shipping_amount: Number(e.target.value) }))} 
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="text-sm font-medium">Order Items *</label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Unit Cost</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => (
              <OrderItemRow key={idx} item={item} onEdit={() => handleEditItem(item, idx)} onDelete={() => handleDeleteItem(idx)} />
            ))}
          </TableBody>
        </Table>
        <Button className="mt-2" variant="outline" onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-2" />Add Item
        </Button>
        {editingItem && (
          <Dialog open onOpenChange={() => setEditingItem(null)}>
            <DialogContent>
              <DialogHeader><DialogTitle>{editingIndex !== null ? 'Edit Item' : 'Add Item'}</DialogTitle></DialogHeader>
              <OrderItemEditor item={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <div className="space-y-1">
          <div>Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span></div>
          <div>Tax: <span className="font-semibold">${tax.toFixed(2)}</span></div>
          <div>Shipping: <span className="font-semibold">${shipping.toFixed(2)}</span></div>
          <div>Total: <span className="font-bold text-lg">${total.toFixed(2)}</span></div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!isFormValid}
        >
          Save Order
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      {/* Supplier Creation Dialog */}
      <Dialog open={showSupplierForm} onOpenChange={setShowSupplierForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Fill out the form below to add a new supplier to your system.</DialogDescription>
          </DialogHeader>
          <SupplierForm onSave={handleCreateSupplier} onCancel={() => setShowSupplierForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Purchase Orders</h1>
              <p className="text-muted-foreground">Manage all purchase orders for inventory and supplies</p>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
                <p className="mb-4">An error occurred while loading the orders page.</p>
                <Button onClick={() => window.location.reload()}>Reload Page</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Main Orders Page ---
export default function InventoryOrders() {
  console.log('InventoryOrders: Component rendering');
  
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [viewOrder, setViewOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = async () => {
    console.log('InventoryOrders: Loading data...');
    try {
      setLoading(true);
      setError(null);
      
      // Load data with individual error handling
      let ordersData: PurchaseOrder[] = [];
      let suppliersData: Supplier[] = [];
      let ordersError = null;
      let suppliersError = null;
      
      try {
        console.log('InventoryOrders: Testing purchase_orders table...');
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/purchase_orders?limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (testResponse.status === 404) {
          console.error('InventoryOrders: purchase_orders table does not exist');
          ordersError = 'Purchase orders table not found. Please run the database migrations.';
        } else {
          ordersData = await supabaseService.getPurchaseOrders();
          console.log('InventoryOrders: Orders loaded successfully', { count: ordersData.length });
        }
      } catch (err: any) {
        console.error('InventoryOrders: Error loading orders:', err);
        ordersError = err.message || 'Failed to load orders';
        ordersData = []; // Use empty array as fallback
      }
      
      try {
        console.log('InventoryOrders: Testing suppliers table...');
        const testResponse = await fetch(`${supabaseUrl}/rest/v1/suppliers?limit=1`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (testResponse.status === 404) {
          console.error('InventoryOrders: suppliers table does not exist');
          suppliersError = 'Suppliers table not found. Please run the database migrations.';
        } else {
          suppliersData = await supabaseService.getSuppliers();
          console.log('InventoryOrders: Suppliers loaded successfully', { count: suppliersData.length });
        }
      } catch (err: any) {
        console.error('InventoryOrders: Error loading suppliers:', err);
        suppliersError = err.message || 'Failed to load suppliers';
        suppliersData = []; // Use empty array as fallback
      }
      
      setOrders(ordersData);
      setSuppliers(suppliersData);
      
      // Show specific error messages
      if (ordersError && suppliersError) {
        setError(`Database tables missing. ${ordersError} ${suppliersError} Please run the migrations in your Supabase dashboard.`);
      } else if (ordersError) {
        setError(ordersError);
      } else if (suppliersError) {
        setError(suppliersError);
      } else if (ordersData.length === 0 && suppliersData.length === 0) {
        setError('No data found. The tables may be empty or you may need to run the database migrations.');
      }
    } catch (err: any) {
      console.error('InventoryOrders: Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('InventoryOrders: Component mounted, loading data');
    loadData();
  }, []);

  const handleCreate = () => {
    console.log('InventoryOrders: Creating new order');
    try {
      setError(null);
      setEditingOrder(null);
      setShowForm(true);
      console.log('InventoryOrders: Form dialog opened');
    } catch (err) {
      console.error('InventoryOrders: Error creating order:', err);
      setError('Failed to open order form');
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    console.log('InventoryOrders: Editing order', order.id);
    try {
      setError(null);
      setEditingOrder(order);
      setShowForm(true);
    } catch (err) {
      console.error('InventoryOrders: Error editing order:', err);
      setError('Failed to open order form');
    }
  };

  const handleDelete = async (order: PurchaseOrder) => {
    if (!window.confirm('Delete this order?')) return;
    console.log('InventoryOrders: Deleting order', order.id);
    try {
      setError(null);
      await supabaseService.deletePurchaseOrder(order.id);
      await loadData();
    } catch (err: any) {
      console.error('InventoryOrders: Error deleting order:', err);
      setError(err.message || 'Failed to delete order');
    }
  };

  const handleSave = async (orderData: Partial<PurchaseOrder> & { items: Partial<PurchaseOrderItem>[] }) => {
    console.log('InventoryOrders: Saving order', orderData);
    try {
      setError(null);
      if (editingOrder) {
        await supabaseService.updatePurchaseOrder(editingOrder.id, orderData);
      } else {
        await supabaseService.createPurchaseOrder(orderData);
      }
      setShowForm(false);
      setEditingOrder(null);
      await loadData();
    } catch (err: any) {
      console.error('InventoryOrders: Error saving order:', err);
      setError(err.message || 'Failed to save order');
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.po_number?.toLowerCase().includes(search.toLowerCase()) ||
                         order.supplier?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('InventoryOrders: Render state', { 
    loading, 
    error, 
    ordersCount: orders.length, 
    suppliersCount: suppliers.length,
    showForm,
    editingOrder: !!editingOrder
  });

  if (error) {
    console.log('InventoryOrders: Rendering error state');
    return (
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Purchase Orders</h1>
              <p className="text-muted-foreground">Manage all purchase orders for inventory and supplies</p>
            </div>
            <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Retry</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    );
  }

  console.log('InventoryOrders: Rendering main content');
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage all purchase orders for inventory and supplies</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />New Order</Button>
            <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Orders List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input placeholder="Search PO number..." value={search} onChange={e => setSearch(e.target.value)} onBlur={loadData} />
              <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setTimeout(loadData, 0); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>{order.po_number}</TableCell>
                    <TableCell>{order.supplier?.name || '-'}</TableCell>
                    <TableCell>
                      {order.status === 'draft' && <span className="text-gray-500">Draft</span>}
                      {order.status === 'sent' && <span className="text-blue-600">Sent</span>}
                      {order.status === 'confirmed' && <span className="text-green-600">Confirmed</span>}
                      {order.status === 'received' && <span className="text-green-800 font-semibold">Received</span>}
                      {order.status === 'cancelled' && <span className="text-red-600">Cancelled</span>}
                    </TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setViewOrder(order)}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(order)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms.</p>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />Create First Order</Button>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Create/Edit Order Dialog */}
        <Dialog open={showForm} onOpenChange={v => { 
          console.log('InventoryOrders: Dialog state changing', v);
          setShowForm(v); 
          if (!v) setEditingOrder(null); 
        }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingOrder ? 'Edit Order' : 'New Purchase Order'}</DialogTitle>
              <DialogDescription>{editingOrder ? 'Edit the order details below.' : 'Fill out the form to create a new purchase order.'}</DialogDescription>
            </DialogHeader>
            {(() => {
              try {
                // Test if we can render a simple form first
                if (suppliers.length === 0) {
                  return (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground mb-4">Loading suppliers...</p>
                      <Button variant="outline" onClick={() => setShowForm(false)}>Close</Button>
                    </div>
                  );
                }
                
                return (
                  <PurchaseOrderForm 
                    order={editingOrder || undefined} 
                    suppliers={suppliers} 
                    onSave={handleSave} 
                    onCancel={() => setShowForm(false)} 
                    onSupplierCreated={(supplier) => {
                      setSuppliers(prevSuppliers => [...prevSuppliers, supplier]);
                    }} 
                  />
                );
              } catch (error) {
                console.error('InventoryOrders: Error rendering PurchaseOrderForm:', error);
                return (
                  <div className="p-4 text-center text-red-600">
                    <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                    <p>Failed to load order form. Please try again.</p>
                    <Button 
                      variant="outline" 
                      className="mt-2" 
                      onClick={() => setShowForm(false)}
                    >
                      Close
                    </Button>
                  </div>
                );
              }
            })()}
          </DialogContent>
        </Dialog>
        {/* View Order Dialog */}
        <Dialog open={!!viewOrder} onOpenChange={v => setViewOrder(v ? viewOrder : null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {viewOrder && (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    <div className="font-semibold">PO Number:</div>
                    <div>{viewOrder.po_number}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Supplier:</div>
                    <div>{viewOrder.supplier?.name || '-'}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Status:</div>
                    <div>{viewOrder.status}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Order Date:</div>
                    <div>{viewOrder.order_date}</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">Order Items</div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Cost</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items?.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.item_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_cost?.toFixed(2)}</TableCell>
                          <TableCell>${item.total_cost?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-end">
                  <div className="space-y-1">
                    <div>Subtotal: <span className="font-semibold">${viewOrder.items?.reduce((sum, it) => sum + ((it.quantity || 0) * (it.unit_cost || 0)), 0).toFixed(2)}</span></div>
                    <div>Tax: <span className="font-semibold">${viewOrder.tax_amount?.toFixed(2) || '0.00'}</span></div>
                    <div>Shipping: <span className="font-semibold">${viewOrder.shipping_amount?.toFixed(2) || '0.00'}</span></div>
                    <div>Total: <span className="font-bold text-lg">${viewOrder.total_amount?.toFixed(2) || '0.00'}</span></div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 