import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  RefreshCw,
  Settings,
  Building,
  Zap,
  Wrench,
  Gauge,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { 
  InventoryItem, 
  InventoryCategory, 
  Supplier, 
  InventoryFormData 
} from '@/types/inventory';
import { InventoryItemForm } from '@/components/inventory/InventoryItemForm';
import { StockAdjustmentDialog } from '@/components/inventory/StockAdjustmentDialog';
import SEO from '../../components/SEO';

// Generator-specific part types
const GENERATOR_PART_TYPES = [
  'Engine Components',
  'Electrical System',
  'Fuel System',
  'Cooling System',
  'Exhaust System',
  'Control Panel',
  'Transfer Switch',
  'Battery System',
  'Air Filter',
  'Oil Filter',
  'Spark Plugs',
  'Belts & Pulleys',
  'Sensors',
  'Wiring & Connectors',
  'Other'
];

const GENERATOR_MODELS = [
  'Cummins',
  'Caterpillar',
  'Kohler',
  'Generac',
  'Briggs & Stratton',
  'Honda',
  'Yamaha',
  'Generic',
  'Custom'
];

export default function InventoryParts() {
  const [parts, setParts] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [partTypeFilter, setPartTypeFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadPartsData();
  }, []);

  useEffect(() => {
    loadParts();
  }, [searchTerm, statusFilter, conditionFilter, partTypeFilter]);

  const loadPartsData = async () => {
    try {
      setLoading(true);
      const [categoriesData, suppliersData] = await Promise.all([
        supabaseService.getInventoryCategories(),
        supabaseService.getSuppliers()
      ]);
      
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading parts data:', error);
      setError('Failed to load parts data');
    } finally {
      setLoading(false);
    }
  };

  const loadParts = async () => {
    try {
      const filters: any = {
        search: searchTerm,
        category_id: categories.find(c => c.name === 'Parts')?.id
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (conditionFilter !== 'all') {
        filters.condition = conditionFilter;
      }

      const itemsData = await supabaseService.getInventoryItems(filters);
      
      // Filter by part type if specified
      let filteredParts = itemsData;
      if (partTypeFilter !== 'all') {
        filteredParts = itemsData.filter(part => 
          part.tags?.includes(partTypeFilter) || 
          part.description?.toLowerCase().includes(partTypeFilter.toLowerCase())
        );
      }
      
      setParts(filteredParts);
    } catch (error) {
      console.error('Error loading parts:', error);
      setError('Failed to load parts');
    }
  };

  const handleCreateItem = async (itemData: InventoryFormData) => {
    try {
      console.log('Creating part:', itemData);
      
      // Ensure the item is categorized as a part
      const partsCategory = categories.find(c => c.name === 'Parts');
      if (partsCategory) {
        itemData.category_id = partsCategory.id;
      }
      
      // Add generator-specific tags if not present
      if (!itemData.tags) {
        itemData.tags = [];
      }
      if (!itemData.tags.includes('Generator Parts')) {
        itemData.tags.push('Generator Parts');
      }
      
      const result = await supabaseService.createInventoryItem(itemData);
      console.log('Part created successfully:', result);
      setShowItemForm(false);
      setError(null);
      await loadParts();
    } catch (error) {
      console.error('Error creating part:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create part';
      setError(`Failed to create part: ${errorMessage}`);
    }
  };

  const handleUpdateItem = async (itemData: InventoryFormData) => {
    if (!editingItem) return;
    
    try {
      console.log('Updating part:', itemData);
      const result = await supabaseService.updateInventoryItem(editingItem.id, itemData);
      console.log('Part updated successfully:', result);
      setShowItemForm(false);
      setEditingItem(null);
      setError(null);
      await loadParts();
    } catch (error) {
      console.error('Error updating part:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update part';
      setError(`Failed to update part: ${errorMessage}`);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    
    try {
      await supabaseService.deleteInventoryItem(id);
      await loadParts();
    } catch (error) {
      console.error('Error deleting part:', error);
      setError('Failed to delete part');
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

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleStockAdjustment = async (adjustment: any) => {
    if (!selectedItem) return;
    
    try {
      await supabaseService.adjustStock(selectedItem.id, adjustment);
      setShowStockAdjustment(false);
      setSelectedItem(null);
      await loadParts();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      setError('Failed to adjust stock');
    }
  };

  const getCriticalParts = () => {
    return parts.filter(part => 
      part.status === 'out_of_stock' || 
      (part.status === 'low_stock' && part.quantity <= part.min_quantity)
    );
  };

  const getMaintenanceParts = () => {
    return parts.filter(part => 
      part.tags?.some(tag => 
        tag.toLowerCase().includes('maintenance') || 
        tag.toLowerCase().includes('filter') ||
        tag.toLowerCase().includes('oil') ||
        tag.toLowerCase().includes('spark')
      )
    );
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
          <Button onClick={loadPartsData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <SEO title="Admin Inventory Parts | HOU GEN PROS" description="Admin dashboard inventory parts page." canonical="/admin/inventory/parts" pageType="website" keywords="admin, inventory parts, dashboard" schema={null} />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Generator Parts Inventory</h1>
            <p className="text-muted-foreground">Manage generator parts, components, and spare parts</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Part
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Part' : 'Add Generator Part'}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? 'Update the part information below.' : 'Fill out the form below to add a new generator part to your inventory.'}
                  </DialogDescription>
                </DialogHeader>
                <InventoryItemForm
                  categories={categories}
                  suppliers={suppliers}
                  item={editingItem || undefined}
                  onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
                  onCancel={() => {
                    setShowItemForm(false);
                    setEditingItem(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parts.length}</div>
              <p className="text-xs text-muted-foreground">
                Generator parts
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
                ${parts.reduce((sum, part) => sum + (part.quantity * part.unit_cost), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                At current stock levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Parts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {getCriticalParts().length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Parts</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getMaintenanceParts().length}
              </div>
              <p className="text-xs text-muted-foreground">
                Regular maintenance items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="critical">Critical Parts</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="all">All Parts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Critical Parts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getCriticalParts().slice(0, 3).map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="text-sm font-medium">{part.name}</span>
                        <Badge variant="destructive">{part.quantity}</Badge>
                      </div>
                    ))}
                    {getCriticalParts().length === 0 && (
                      <p className="text-sm text-muted-foreground">No critical parts</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-500" />
                    Maintenance Parts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getMaintenanceParts().slice(0, 3).map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium">{part.name}</span>
                        <Badge variant="secondary">{part.quantity}</Badge>
                      </div>
                    ))}
                    {getMaintenanceParts().length === 0 && (
                      <p className="text-sm text-muted-foreground">No maintenance parts</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Last restock: 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span>5 parts updated today</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>3 new parts added</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="critical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Parts Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min Required</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getCriticalParts().map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {part.manufacturer} {part.model}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-red-600">{part.quantity}</span>
                        </TableCell>
                        <TableCell>{part.min_quantity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(part.status)}>
                            {part.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(part);
                                setShowStockAdjustment(true);
                              }}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Restock
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(part)}
                            >
                              <Edit className="w-4 h-4" />
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

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-500" />
                  Maintenance Parts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getMaintenanceParts().map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {part.manufacturer} {part.model}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {part.tags?.find(tag => 
                            GENERATOR_PART_TYPES.some(type => 
                              tag.toLowerCase().includes(type.toLowerCase().replace(' ', ''))
                            )
                          ) || 'General'}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{part.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {part.last_restocked ? new Date(part.last_restocked).toLocaleDateString() : 'Never'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(part);
                                setShowStockAdjustment(true);
                              }}
                            >
                              <TrendingUp className="w-4 h-4 mr-1" />
                              Adjust
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(part)}
                            >
                              <Edit className="w-4 h-4" />
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

          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search parts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="in_stock">In Stock</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                        <SelectItem value="on_order">On Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Condition</label>
                    <Select value={conditionFilter} onValueChange={setConditionFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="refurbished">Refurbished</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Part Type</label>
                    <Select value={partTypeFilter} onValueChange={setPartTypeFilter}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {GENERATOR_PART_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={loadParts} variant="outline" className="w-full">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parts Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Generator Parts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Part</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{part.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {part.manufacturer} {part.model}
                            </p>
                            {part.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-xs">
                                {part.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {part.sku}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {part.tags?.find(tag => 
                              GENERATOR_PART_TYPES.some(type => 
                                tag.toLowerCase().includes(type.toLowerCase().replace(' ', ''))
                              )
                            ) || 'General'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <p className="font-medium">{part.quantity}</p>
                            <p className="text-xs text-muted-foreground">
                              Min: {part.min_quantity}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(part.status)}>
                            {part.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getConditionColor(part.condition)}>
                            {part.condition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{part.location}</p>
                            {part.shelf_location && (
                              <p className="text-xs text-muted-foreground">
                                Shelf: {part.shelf_location}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(part.quantity * part.unit_cost).toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @${part.unit_cost}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedItem(part)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditItem(part)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedItem(part);
                                setShowStockAdjustment(true);
                              }}
                            >
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(part.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {parts.length === 0 && (
                  <div className="text-center py-8">
                    <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No parts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm || statusFilter !== 'all' || conditionFilter !== 'all' || partTypeFilter !== 'all'
                        ? 'Try adjusting your filters or search terms.'
                        : 'Get started by adding your first generator part to the inventory.'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && conditionFilter === 'all' && partTypeFilter === 'all' && (
                      <Button onClick={() => setShowItemForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Part
                      </Button>
                    )}
                  </div>
                )}
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
            onSubmit={handleStockAdjustment}
          />
        )}
      </div>
    </>
  );
}
