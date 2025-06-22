import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Barcode,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Users,
  Building,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { InventoryItemForm } from '@/components/inventory/InventoryItemForm';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  min_quantity: number;
  unit_cost: number;
  unit_price: number;
  location?: string;
  status: string;
  condition?: string;
  manufacturer?: string;
  model?: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  created_at: string;
}

interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating: number;
  created_at: string;
}

interface InventoryStats {
  total_items: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  categories_count: number;
  suppliers_count: number;
  recent_movements: any[];
}

export default function Inventory() {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    loadInventoryItems();
  }, [searchTerm]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('inventory_categories')
        .select('*')
        .order('name');
      
      if (categoriesError) {
        console.error('Error loading categories:', categoriesError);
        // Create default categories if table doesn't exist
        setCategories([
          { id: '1', name: 'Electronics', description: 'Electronic components', color: '#3B82F6', created_at: new Date().toISOString() },
          { id: '2', name: 'Tools', description: 'Hand and power tools', color: '#10B981', created_at: new Date().toISOString() },
          { id: '3', name: 'Parts', description: 'Replacement parts', color: '#F59E0B', created_at: new Date().toISOString() }
        ]);
      } else {
        setCategories(categoriesData || []);
      }

      // Load suppliers
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (suppliersError) {
        console.error('Error loading suppliers:', suppliersError);
        // Create default suppliers if table doesn't exist
        setSuppliers([
          { id: '1', name: 'ABC Electronics', contact_name: 'John Doe', email: 'john@abc.com', rating: 4.5, created_at: new Date().toISOString() },
          { id: '2', name: 'XYZ Tools', contact_name: 'Jane Smith', email: 'jane@xyz.com', rating: 4.2, created_at: new Date().toISOString() }
        ]);
      } else {
        setSuppliers(suppliersData || []);
      }

      // Calculate stats
      const { data: itemsData } = await supabase
        .from('inventory_items')
        .select('*');
      
      const itemsList = itemsData || [];
      const totalValue = itemsList.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
      const lowStockItems = itemsList.filter(item => item.quantity <= item.min_quantity).length;
      const outOfStockItems = itemsList.filter(item => item.quantity === 0).length;
      
      setStats({
        total_items: itemsList.length,
        total_value: totalValue,
        low_stock_items: lowStockItems,
        out_of_stock_items: outOfStockItems,
        categories_count: categoriesData?.length || 3,
        suppliers_count: suppliersData?.length || 2,
        recent_movements: []
      });

    } catch (error) {
      console.error('Error loading inventory data:', error);
      setError('Failed to load inventory data');
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryItems = async () => {
    try {
      let query = supabase
        .from('inventory_items')
        .select(`
          *,
          category:inventory_categories(*),
          supplier:suppliers(*)
        `)
        .order('name');

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error loading inventory items:', error);
        // Create sample data if table doesn't exist
        setItems([
          {
            id: '1',
            name: 'Generator Control Panel',
            description: 'Main control panel for industrial generators',
            sku: 'GCP-001',
            quantity: 15,
            min_quantity: 5,
            unit_cost: 250.00,
            unit_price: 350.00,
            location: 'Warehouse A',
            status: 'in_stock',
            condition: 'new',
            manufacturer: 'GenPro',
            model: 'GCP-2024',
            category: { id: '1', name: 'Electronics', color: '#3B82F6' },
            supplier: { id: '1', name: 'ABC Electronics' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Fuel Filter Assembly',
            description: 'High-quality fuel filter for diesel generators',
            sku: 'FF-002',
            quantity: 3,
            min_quantity: 10,
            unit_cost: 45.00,
            unit_price: 65.00,
            location: 'Warehouse B',
            status: 'low_stock',
            condition: 'new',
            manufacturer: 'FilterMax',
            model: 'FF-500',
            category: { id: '3', name: 'Parts', color: '#F59E0B' },
            supplier: { id: '2', name: 'XYZ Tools' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } else {
        setItems(data || []);
      }
    } catch (error) {
      console.error('Error loading inventory items:', error);
      setError('Failed to load inventory items');
    }
  };

  const handleCreateItem = async (itemData: any) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([itemData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Inventory item created successfully",
      });
      
      setShowItemForm(false);
      loadInventoryData();
      loadInventoryItems();
    } catch (error) {
      console.error('Error creating inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to create inventory item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      loadInventoryData();
      loadInventoryItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      // Find item by barcode
      const { data: item } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('barcode', barcode)
        .single();

      if (item) {
        setSelectedItem(item);
        setShowStockAdjustment(true);
        toast({
          title: "Item Found",
          description: `Found item: ${item.name}`,
        });
      } else {
        toast({
          title: "Item Not Found",
          description: "No item found with this barcode",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing barcode scan:', error);
      toast({
        title: "Error",
        description: "Failed to process barcode scan",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'discontinued': return 'bg-gray-100 text-gray-800';
      case 'on_order': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-2">
              Manage your inventory items, categories, and suppliers
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading inventory data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your inventory items, categories, and suppliers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadInventoryData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowItemForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
          <Button variant="outline" onClick={() => setShowBarcodeScanner(true)}>
            <Barcode className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_items}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats.categories_count} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                At current stock levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.low_stock_items}
              </div>
              <p className="text-xs text-muted-foreground">
                Need restocking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.out_of_stock_items}
              </div>
              <p className="text-xs text-muted-foreground">
                Items to reorder
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_items || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Across {stats?.categories_count || 0} categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats?.total_value?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  At current stock levels
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats?.low_stock_items || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Need restocking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recent_movements?.length > 0 ? (
                  stats.recent_movements.slice(0, 5).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{movement.item?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {movement.movement_type} {movement.quantity} units
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {movement.movement_type === 'in' ? '+' : '-'}{movement.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(movement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent stock movements</p>
                    <p className="text-sm">Stock adjustments will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.manufacturer} {item.model}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {item.sku}
                          </code>
                        </TableCell>
                        <TableCell>
                          {item.category && (
                            <Badge variant="outline" style={{ 
                              backgroundColor: item.category.color + '20',
                              color: item.category.color,
                              borderColor: item.category.color
                            }}>
                              {item.category.name}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{item.quantity}</p>
                            <p className="text-xs text-muted-foreground">
                              Min: {item.min_quantity}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{item.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.quantity * item.unit_cost).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @${item.unit_cost}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(item);
                                setShowStockAdjustment(true);
                              }}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No inventory items found</p>
                          <p className="text-sm">Add your first item to get started</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Card key={category.id} className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <span style={{ color: category.color }}>📦</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No categories found</p>
                    <p className="text-sm">Create categories to organize your inventory</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suppliers</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Supplier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <Card key={supplier.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-medium">{supplier.name}</h3>
                        </div>
                        {supplier.contact_name && (
                          <p className="text-sm text-muted-foreground">
                            Contact: {supplier.contact_name}
                          </p>
                        )}
                        {supplier.email && (
                          <p className="text-sm text-muted-foreground">
                            {supplier.email}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(supplier.rating) 
                                    ? 'bg-yellow-400' 
                                    : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {supplier.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No suppliers found</p>
                    <p className="text-sm">Add suppliers to manage your supply chain</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Barcode Scanner Dialog */}
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>
              Scan a barcode to find or add inventory items
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              <Barcode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Barcode scanner not implemented</p>
              <p className="text-sm text-gray-400">Manual entry available</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                placeholder="Enter barcode manually"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBarcodeScan(e.currentTarget.value);
                    setShowBarcodeScanner(false);
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBarcodeScanner(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                const input = document.getElementById('barcode') as HTMLInputElement;
                if (input?.value) {
                  handleBarcodeScan(input.value);
                  setShowBarcodeScanner(false);
                }
              }}>
                Scan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new inventory item to your system.
            </DialogDescription>
          </DialogHeader>
          <InventoryItemForm
            categories={categories}
            suppliers={suppliers}
            onSubmit={handleCreateItem}
            onCancel={() => setShowItemForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      {selectedItem && (
        <Dialog open={showStockAdjustment} onOpenChange={setShowStockAdjustment}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adjust Stock</DialogTitle>
              <DialogDescription>
                Adjust stock levels for {selectedItem.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Current Quantity</Label>
                <p className="text-lg font-semibold">{selectedItem.quantity}</p>
              </div>
              <div>
                <Label htmlFor="adjustment">Adjustment (+/-)</Label>
                <Input
                  id="adjustment"
                  type="number"
                  placeholder="Enter quantity change"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Reason for adjustment"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowStockAdjustment(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // Handle stock adjustment
                  setShowStockAdjustment(false);
                  setSelectedItem(null);
                }}>
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 