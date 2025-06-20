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
  Building
} from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { 
  InventoryItem, 
  InventoryCategory, 
  Supplier, 
  InventoryStats, 
  InventoryFilters,
  InventoryFormData 
} from '@/types/inventory';
import { InventoryItemForm } from '@/components/inventory/InventoryItemForm';
import { BarcodeScanner } from '@/components/inventory/BarcodeScanner';
import { StockAdjustmentDialog } from '@/components/inventory/StockAdjustmentDialog';
import { InventoryStatsCards } from '@/components/inventory/InventoryStatsCards';
import { InventoryFiltersPanel } from '@/components/inventory/InventoryFiltersPanel';

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadInventoryData();
    // Test inventory tables for debugging
    supabaseService.testInventoryTables();
    supabaseService.testInventoryAccess();
    supabaseService.testUserAuth();
    supabaseService.testSupabaseClient();
    supabaseService.testDirectFetch();
    // Test minimal item creation
    setTimeout(() => {
      supabaseService.testCreateMinimalItem();
    }, 2000); // Wait 2 seconds for other tests to complete
  }, []);

  useEffect(() => {
    loadInventoryItems();
  }, [filters, searchTerm]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [categoriesData, suppliersData, statsData] = await Promise.all([
        supabaseService.getInventoryCategories(),
        supabaseService.getSuppliers(),
        supabaseService.getInventoryStats()
      ]);
      
      setCategories(categoriesData);
      setSuppliers(suppliersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading inventory data:', error);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryItems = async () => {
    try {
      const itemsData = await supabaseService.getInventoryItems({
        ...filters,
        search: searchTerm
      });
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading inventory items:', error);
      setError('Failed to load inventory items');
    }
  };

  const handleCreateItem = async (itemData: InventoryFormData) => {
    try {
      console.log('Submitting inventory item:', itemData);
      
      // Test access before creating
      const canAccess = await supabaseService.testInventoryAccess();
      if (!canAccess) {
        throw new Error('Cannot access inventory tables. Please check if tables exist and RLS is disabled.');
      }
      
      const result = await supabaseService.createInventoryItem(itemData);
      console.log('Item created successfully:', result);
      setShowItemForm(false);
      setError(null); // Clear any previous errors
      await loadInventoryData();
      await loadInventoryItems();
    } catch (error) {
      console.error('Error creating inventory item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create inventory item';
      setError(`Failed to create inventory item: ${errorMessage}`);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<InventoryFormData>) => {
    try {
      await supabaseService.updateInventoryItem(id, updates);
      setSelectedItem(null);
      loadInventoryData();
      loadInventoryItems();
    } catch (error) {
      console.error('Error updating inventory item:', error);
      setError('Failed to update inventory item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await supabaseService.deleteInventoryItem(id);
      loadInventoryData();
      loadInventoryItems();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      setError('Failed to delete inventory item');
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const result = await supabaseService.scanBarcode({
        barcode,
        scan_type: 'audit',
        notes: 'Scanned from inventory management'
      });
      
      if (result.found) {
        setSelectedItem(result.item);
        setShowStockAdjustment(true);
      } else {
        // Item not found, create new item
        setShowItemForm(true);
        // You could pre-populate the form with barcode data
      }
    } catch (error) {
      console.error('Error processing barcode scan:', error);
      setError('Failed to process barcode scan');
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-yellow-100 text-yellow-800';
      case 'refurbished': return 'bg-blue-100 text-blue-800';
      case 'damaged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <Button onClick={loadInventoryData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your inventory items, track stock levels, and monitor suppliers</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Barcode className="w-4 h-4 mr-2" />
                Scan Barcode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Scan Barcode</DialogTitle>
                <DialogDescription>
                  Use your camera or manually enter a barcode to scan inventory items.
                </DialogDescription>
              </DialogHeader>
              <BarcodeScanner onScan={handleBarcodeScan} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
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
        </div>
      </div>

      {/* Stats Cards */}
      {stats && <InventoryStatsCards stats={stats} />}

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
                {stats?.recent_movements?.slice(0, 5).map((movement) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          {/* Filters */}
          <InventoryFiltersPanel
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            suppliers={suppliers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

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
                  {items.map((item) => (
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
                          {item.shelf_location && (
                            <p className="text-xs text-muted-foreground">
                              Shelf: {item.shelf_location}
                            </p>
                          )}
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
                  ))}
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
                {categories.map((category) => (
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
                ))}
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
                {suppliers.map((supplier) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Dialog */}
      {selectedItem && (
        <StockAdjustmentDialog
          item={selectedItem}
          open={showStockAdjustment}
          onOpenChange={setShowStockAdjustment}
          onAdjustment={async (adjustment) => {
            try {
              await supabaseService.adjustStock(selectedItem.id, adjustment);
              setShowStockAdjustment(false);
              setSelectedItem(null);
              loadInventoryData();
              loadInventoryItems();
            } catch (error) {
              console.error('Error adjusting stock:', error);
              setError('Failed to adjust stock');
            }
          }}
        />
      )}
    </div>
  );
} 