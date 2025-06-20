export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating: number;
  terms?: string;
  payment_terms: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category_id?: string;
  supplier_id?: string;
  manufacturer?: string;
  model?: string;
  part_number?: string;
  quantity: number;
  min_quantity: number;
  max_quantity?: number;
  unit_cost: number;
  unit_price: number;
  location?: string;
  shelf_location?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued' | 'on_order';
  condition: 'new' | 'used' | 'refurbished' | 'damaged';
  warranty_period?: number;
  weight?: number;
  dimensions?: string;
  image_url?: string;
  documents?: string[];
  tags: string[];
  metadata?: Record<string, any>;
  last_restocked?: string;
  last_audit?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  category?: InventoryCategory;
  supplier?: Supplier;
}

export interface StockMovement {
  id: string;
  item_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'transfer' | 'damage' | 'return';
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_type?: 'purchase_order' | 'sales_order' | 'project' | 'audit' | 'manual' | 'return';
  reference_id?: string;
  notes?: string;
  location_from?: string;
  location_to?: string;
  unit_cost?: number;
  total_value?: number;
  created_at: string;
  created_by: string;
  item?: InventoryItem;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier_id: string;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  order_date: string;
  expected_delivery?: string;
  delivery_date?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  item_id?: string;
  item_name: string;
  item_description?: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  received_quantity: number;
  notes?: string;
  created_at: string;
  item?: InventoryItem;
}

export interface BarcodeScan {
  id: string;
  barcode: string;
  item_id?: string;
  scan_type: 'in' | 'out' | 'audit' | 'location_change';
  quantity?: number;
  location?: string;
  notes?: string;
  scanned_at: string;
  scanned_by: string;
  device_info?: Record<string, any>;
  item?: InventoryItem;
}

export interface InventoryAlert {
  id: string;
  item_id: string;
  alert_type: 'low_stock' | 'out_of_stock' | 'expiring_warranty' | 'overstock' | 'price_change';
  message: string;
  is_active: boolean;
  is_read: boolean;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  item?: InventoryItem;
}

export interface InventoryStats {
  total_items: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  categories_count: number;
  suppliers_count: number;
  recent_movements: StockMovement[];
  recent_alerts: InventoryAlert[];
}

export interface InventoryFilters {
  search?: string;
  category_id?: string;
  supplier_id?: string;
  status?: string;
  condition?: string;
  location?: string;
  min_quantity?: number;
  max_quantity?: number;
  min_price?: number;
  max_price?: number;
  tags?: string[];
}

export interface InventoryFormData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  supplier_id?: string;
  manufacturer?: string;
  model?: string;
  part_number?: string;
  quantity: number;
  min_quantity: number;
  max_quantity?: number;
  unit_cost: number;
  unit_price: number;
  location?: string;
  shelf_location?: string;
  condition: 'new' | 'used' | 'refurbished' | 'damaged';
  warranty_period?: number;
  weight?: number;
  dimensions?: string;
  image_url?: string;
  documents?: string[];
  tags?: string[];
}

export interface SupplierFormData {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  terms?: string;
  payment_terms?: string;
  notes?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface StockAdjustmentData {
  item_id: string;
  quantity_change: number;
  movement_type: 'in' | 'out' | 'adjustment';
  notes?: string;
  reference_type?: string;
  reference_id?: string;
  location_from?: string;
  location_to?: string;
}

export interface BarcodeScanData {
  barcode: string;
  scan_type: 'in' | 'out' | 'audit' | 'location_change';
  quantity?: number;
  location?: string;
  notes?: string;
  device_info?: Record<string, any>;
} 