
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Save, X } from 'lucide-react';
import { saveScheduleEvent } from '@/lib/schedulingService';
import { useToast } from '@/hooks/use-toast';
import type { ScheduleEvent, ScheduleFormData } from '@/types/scheduling';

interface ScheduleFormProps {
  event?: ScheduleEvent | null;
  onClose: () => void;
  onSave: () => void;
}

export function ScheduleForm({ event, onClose, onSave }: ScheduleFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    all_day: false,
    location: '',
    event_type: 'appointment',
    priority: 'medium',
    color: '#3B82F6',
    project_id: '',
    customer_id: '',
    technician_ids: [],
    notes: ''
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description || '',
        start_time: event.start_time,
        end_time: event.end_time,
        all_day: event.all_day,
        location: event.location || '',
        event_type: event.event_type,
        priority: event.priority,
        color: event.color || '#3B82F6',
        project_id: event.project_id || '',
        customer_id: event.customer_id || '',
        technician_ids: event.technician_ids || [],
        notes: event.notes || ''
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveScheduleEvent(event?.id, formData);
      toast({
        title: 'Success',
        description: `Event ${event ? 'updated' : 'created'} successfully`
      });
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Failed to save event',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <Label htmlFor="event_type">Event Type</Label>
              <Select 
                value={formData.event_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, event_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time.slice(0, 16)}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value + ':00Z' }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time.slice(0, 16)}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value + ':00Z' }))}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Internal notes"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="all_day"
                  checked={formData.all_day}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, all_day: checked }))}
                />
                <Label htmlFor="all_day">All Day Event</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
