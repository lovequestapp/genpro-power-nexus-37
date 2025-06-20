import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw,
  Package,
  Building,
  AlertTriangle
} from 'lucide-react';
import { InventoryFilters, InventoryCategory, Supplier } from '@/types/inventory';

interface InventoryFiltersPanelProps {
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  categories: InventoryCategory[];
  suppliers: Supplier[];
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export function InventoryFiltersPanel({
  filters,
  onFiltersChange,
  categories,
  suppliers,
  searchTerm,
  onSearchChange
}: InventoryFiltersPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
    onSearchChange('');
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {Object.keys(filters).length + (searchTerm ? 1 : 0)} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search items by name, SKU, barcode, or manufacturer..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category_id || ''}
              onValueChange={(value) => handleFilterChange('category_id', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supplier">Supplier</Label>
            <Select
              value={filters.supplier_id || ''}
              onValueChange={(value) => handleFilterChange('supplier_id', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleFilterChange('status', value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="on_order">On Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={filters.condition || ''}
                  onValueChange={(value) => handleFilterChange('condition', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  placeholder="Filter by location"
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                />
              </div>

              <div>
                <Label htmlFor="min_quantity">Min Quantity</Label>
                <Input
                  type="number"
                  placeholder="Minimum quantity"
                  value={filters.min_quantity || ''}
                  onChange={(e) => handleFilterChange('min_quantity', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="max_quantity">Max Quantity</Label>
                <Input
                  type="number"
                  placeholder="Maximum quantity"
                  value={filters.max_quantity || ''}
                  onChange={(e) => handleFilterChange('max_quantity', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_price">Min Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Minimum unit cost"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>

              <div>
                <Label htmlFor="max_price">Max Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Maximum unit cost"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => onSearchChange('')}
                  />
                </Badge>
              )}
              
              {filters.category_id && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {categories.find(c => c.id === filters.category_id)?.name}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('category_id', undefined)}
                  />
                </Badge>
              )}
              
              {filters.supplier_id && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Supplier: {suppliers.find(s => s.id === filters.supplier_id)?.name}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('supplier_id', undefined)}
                  />
                </Badge>
              )}
              
              {filters.status && (
                <Badge className={`flex items-center gap-1 ${getStatusColor(filters.status)}`}>
                  Status: {filters.status.replace('_', ' ')}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('status', undefined)}
                  />
                </Badge>
              )}
              
              {filters.condition && (
                <Badge className={`flex items-center gap-1 ${getConditionColor(filters.condition)}`}>
                  Condition: {filters.condition}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('condition', undefined)}
                  />
                </Badge>
              )}
              
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('location', undefined)}
                  />
                </Badge>
              )}
              
              {filters.min_quantity && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min Qty: {filters.min_quantity}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('min_quantity', undefined)}
                  />
                </Badge>
              )}
              
              {filters.max_quantity && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max Qty: {filters.max_quantity}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('max_quantity', undefined)}
                  />
                </Badge>
              )}
              
              {filters.min_price && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Min Price: ${filters.min_price}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('min_price', undefined)}
                  />
                </Badge>
              )}
              
              {filters.max_price && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Max Price: ${filters.max_price}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleFilterChange('max_price', undefined)}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
