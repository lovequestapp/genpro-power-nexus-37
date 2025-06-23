import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';

interface StockAdjustmentDialogProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    min_quantity: number;
    unit_cost: number;
  };
  onSubmit: (data: {
    item_id: string;
    adjustment: number;
    movement_type: 'in' | 'out' | 'adjustment';
    reason: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({ 
  item, 
  onSubmit, 
  onCancel, 
  open, 
  onOpenChange 
}: StockAdjustmentDialogProps) {
  const [formData, setFormData] = useState({
    adjustment: 0,
    movement_type: 'adjustment' as 'in' | 'out' | 'adjustment',
    reason: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.adjustment === 0) {
      alert('Adjustment amount cannot be zero');
      return;
    }
    
    if (!formData.reason.trim()) {
      alert('Reason is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        item_id: item.id,
        adjustment: formData.adjustment,
        movement_type: formData.movement_type,
        reason: formData.reason,
        notes: formData.notes
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        adjustment: 0,
        movement_type: 'adjustment',
        reason: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting stock adjustment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getNewQuantity = () => {
    if (formData.movement_type === 'in') {
      return item.quantity + Math.abs(formData.adjustment);
    } else if (formData.movement_type === 'out') {
      return item.quantity - Math.abs(formData.adjustment);
    } else {
      return formData.adjustment;
    }
  };

  const newQuantity = getNewQuantity();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Adjust stock levels for {item.name}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current Quantity</Label>
              <div className="text-lg font-semibold">{item.quantity}</div>
            </div>
            <div>
              <Label>New Quantity</Label>
              <div className={`text-lg font-semibold ${
                newQuantity < item.min_quantity ? 'text-red-600' : 
                newQuantity < item.quantity ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {newQuantity}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="movement_type">Movement Type</Label>
            <Select 
              value={formData.movement_type} 
              onValueChange={(value: 'in' | 'out' | 'adjustment') => handleChange('movement_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Stock In
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    Stock Out
                  </div>
                </SelectItem>
                <SelectItem value="adjustment">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    Direct Adjustment
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="adjustment">
              {formData.movement_type === 'in' ? 'Quantity In' : 
               formData.movement_type === 'out' ? 'Quantity Out' : 'New Quantity'}
            </Label>
            <Input
              id="adjustment"
              type="number"
              value={formData.adjustment}
              onChange={(e) => handleChange('adjustment', parseInt(e.target.value) || 0)}
              placeholder="Enter quantity"
              min="0"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Select 
              value={formData.reason} 
              onValueChange={(value) => handleChange('reason', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="return">Return</SelectItem>
                <SelectItem value="damage">Damage/Loss</SelectItem>
                <SelectItem value="correction">Inventory Correction</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes about this adjustment"
              rows={3}
            />
          </div>
          
          {newQuantity < item.min_quantity && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex">
                <Package className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Low Stock Warning</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    New quantity ({newQuantity}) will be below minimum ({item.min_quantity})
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Applying...' : 'Apply Adjustment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
