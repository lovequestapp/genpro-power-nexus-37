import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { InventoryItem, StockAdjustmentData } from '@/types/inventory';

interface StockAdjustmentDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdjustment: (adjustment: StockAdjustmentData) => void;
}

export function StockAdjustmentDialog({
  item,
  open,
  onOpenChange,
  onAdjustment
}: StockAdjustmentDialogProps) {
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [movementType, setMovementType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [notes, setNotes] = useState('');
  const [referenceType, setReferenceType] = useState<string>('');
  const [referenceId, setReferenceId] = useState('');
  const [locationFrom, setLocationFrom] = useState('');
  const [locationTo, setLocationTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adjustment: StockAdjustmentData = {
      item_id: item.id,
      quantity_change: quantityChange,
      movement_type: movementType,
      notes: notes || undefined,
      reference_type: referenceType || undefined,
      reference_id: referenceId || undefined,
      location_from: locationFrom || undefined,
      location_to: locationTo || undefined
    };

    onAdjustment(adjustment);
    
    // Reset form
    setQuantityChange(0);
    setMovementType('in');
    setNotes('');
    setReferenceType('');
    setReferenceId('');
    setLocationFrom('');
    setLocationTo('');
  };

  const getNewQuantity = () => {
    if (movementType === 'in') {
      return item.quantity + Math.abs(quantityChange);
    } else if (movementType === 'out') {
      return item.quantity - Math.abs(quantityChange);
    } else {
      return quantityChange; // For adjustment, set to exact value
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Current Quantity</Label>
                  <p className="text-2xl font-bold">{item.quantity}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">SKU</Label>
                  <p className="font-mono text-sm">{item.sku}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-sm">{item.location || 'Not specified'}</p>
                </div>
              </div>

              {item.category && (
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Badge variant="outline" style={{ 
                    backgroundColor: item.category.color + '20',
                    color: item.category.color,
                    borderColor: item.category.color
                  }}>
                    {item.category.name}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adjustment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="movement_type">Movement Type</Label>
                  <Select value={movementType} onValueChange={(value: 'in' | 'out' | 'adjustment') => setMovementType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          Stock In
                        </div>
                      </SelectItem>
                      <SelectItem value="out">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          Stock Out
                        </div>
                      </SelectItem>
                      <SelectItem value="adjustment">
                        <div className="flex items-center gap-2">
                          <Minus className="w-4 h-4 text-blue-600" />
                          Adjustment
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity_change">
                    {movementType === 'adjustment' ? 'New Quantity' : 'Quantity Change'}
                  </Label>
                  <Input
                    id="quantity_change"
                    type="number"
                    value={quantityChange}
                    onChange={(e) => setQuantityChange(parseInt(e.target.value) || 0)}
                    placeholder={movementType === 'adjustment' ? 'Enter new quantity' : 'Enter quantity'}
                    min={movementType === 'adjustment' ? 0 : 1}
                    required
                  />
                </div>
              </div>

              {movementType !== 'adjustment' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location_from">From Location</Label>
                    <Input
                      id="location_from"
                      value={locationFrom}
                      onChange={(e) => setLocationFrom(e.target.value)}
                      placeholder="Source location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_to">To Location</Label>
                    <Input
                      id="location_to"
                      value={locationTo}
                      onChange={(e) => setLocationTo(e.target.value)}
                      placeholder="Destination location"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_type">Reference Type</Label>
                  <Select value={referenceType} onValueChange={setReferenceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reference type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase_order">Purchase Order</SelectItem>
                      <SelectItem value="sales_order">Sales Order</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reference_id">Reference ID</Label>
                  <Input
                    id="reference_id"
                    value={referenceId}
                    onChange={(e) => setReferenceId(e.target.value)}
                    placeholder="Reference number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about this adjustment"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Quantity:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Change:</span>
                  <span className={`font-medium ${
                    movementType === 'in' ? 'text-green-600' : 
                    movementType === 'out' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {movementType === 'in' ? '+' : movementType === 'out' ? '-' : ''}
                    {Math.abs(quantityChange)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">New Quantity:</span>
                  <span className={`font-bold text-lg ${
                    getNewQuantity() <= item.min_quantity ? 'text-yellow-600' :
                    getNewQuantity() <= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {getNewQuantity()}
                  </span>
                </div>
                
                {getNewQuantity() <= item.min_quantity && getNewQuantity() > 0 && (
                  <div className="text-yellow-600 text-sm bg-yellow-50 p-2 rounded">
                    ⚠️ This will put the item at or below minimum stock level
                  </div>
                )}
                
                {getNewQuantity() < 0 && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                    ⚠️ This will result in negative stock
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={quantityChange === 0}>
              Apply Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
