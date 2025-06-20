
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Clock, MapPin, Users, Repeat, Bell } from 'lucide-react';
import { saveScheduleEvent, getScheduleEvents } from '@/lib/schedulingService';
import { getCustomers, getProjects } from '@/lib/billingService';
import type { ScheduleEvent, ScheduleFormData, RecurringPattern } from '@/types/scheduling';
import type { CheckedState } from '@radix-ui/react-checkbox';

interface ScheduleFormProps {
  event?: ScheduleEvent | null;
  onClose: () => void;
  onSave: () => void;
}

export function ScheduleForm({ event, onClose, onSave }: ScheduleFormProps) {
  const [form, setForm] = useState<ScheduleFormData>({
    title: '',
    description: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    all_day: false,
    location: '',
    event_type: 'other',
    priority: 'medium',
    color: '#3B82F6',
    project_id: '',
    customer_id: '',
    technician_ids: [],
    recurring_pattern: undefined,
    reminders: [],
    notes: ''
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description || '',
        start_time: event.start_time.slice(0, 16),
        end_time: event.end_time.slice(0, 16),
        all_day: event.all_day,
        location: event.location || '',
        event_type: event.event_type,
        priority: event.priority,
        color: event.color || '#3B82F6',
        project_id: event.project_id || '',
        customer_id: event.customer_id || '',
        technician_ids: event.technician_ids || [],
        recurring_pattern: event.recurring_pattern,
        reminders: event.reminders?.map(r => ({
          reminder_time: r.reminder_time.slice(0, 16),
          reminder_type: r.reminder_type,
          sent: r.sent || false,
        })) || [],
        notes: event.notes || ''
      });
      setShowRecurring(!!event.recurring_pattern);
      setShowReminders(event.reminders && event.reminders.length > 0);
    } else {
      loadData();
    }
  }, [event]);

  const loadData = async () => {
    console.log('ScheduleForm: Starting to load data...');
    setLoading(true);
    setError(null);
    try {
      console.log('ScheduleForm: Fetching customers and projects...');
      const [cust, projs] = await Promise.all([
        getCustomers(),
        getProjects()
      ]);
      console.log('ScheduleForm: Fetched data', { cust, projs });

      if (!Array.isArray(cust) || !Array.isArray(projs)) {
        throw new Error('Received invalid data from service.');
      }

      setCustomers(cust);
      setProjects(projs);
      
      console.log('ScheduleForm: Setting mock technicians...');
      setTechnicians([
        { id: '1', name: 'John Smith' },
        { id: '2', name: 'Jane Doe' },
        { id: '3', name: 'Mike Johnson' }
      ]);
      console.log('ScheduleForm: Data loading complete.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error loading form data:', err);
      setError(`Failed to load required data: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
      console.log('ScheduleForm: Finished loading sequence.');
    }
  };

  const handleChange = (field: keyof ScheduleFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert('Please enter a title');
      return;
    }

    setLoading(true);
    try {
      await saveScheduleEvent(event?.id, form);
      onSave();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
    setLoading(false);
  };

  const addReminder = () => {
    const newReminder = {
      reminder_time: new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
      reminder_type: 'desktop' as const,
      sent: false,
    };
    setForm(prev => ({
      ...prev,
      reminders: [...(prev.reminders || []), newReminder]
    }));
  };

  const removeReminder = (index: number) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders?.filter((_, i) => i !== index) || []
    }));
  };

  const updateReminder = (index: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      reminders: prev.reminders?.map((reminder, i) => 
        i === index ? { ...reminder, [field]: value } : reminder
      ) || []
    }));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'project': return '#3B82F6';
      case 'meeting': return '#8B5CF6';
      case 'appointment': return '#10B981';
      case 'reminder': return '#F59E0B';
      case 'task': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>

        {loading && <div className="p-6 text-center">Loading form...</div>}
        {error && <div className="p-6 text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Enter event title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Enter event description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select value={form.event_type} onValueChange={(value) => handleChange('event_type', value)}>
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
                      <Select value={form.priority} onValueChange={(value) => handleChange('priority', value)}>
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
                  </div>

                  <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={form.color}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <div className="flex gap-1">
                        {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'].map(color => (
                          <button
                            key={color}
                            type="button"
                            className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                            style={{ backgroundColor: color }}
                            onClick={() => handleChange('color', color)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="datetime-local"
                        value={form.start_time}
                        onChange={(e) => handleChange('start_time', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="datetime-local"
                        value={form.end_time}
                        onChange={(e) => handleChange('end_time', e.target.value)}
                        disabled={form.all_day}
                      />
                    </div>
                    <div className="flex items-center pt-6 space-x-2">
                      <Checkbox
                        id="all_day"
                        checked={form.all_day}
                        onCheckedChange={(checked: CheckedState) => handleChange('all_day', checked === true)}
                      />
                      <Label htmlFor="all_day">All Day</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        placeholder="Enter location"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* People & Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    People & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={form.customer_id} onValueChange={(value) => handleChange('customer_id', value === 'none' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Select value={form.project_id} onValueChange={(value) => handleChange('project_id', value === 'none' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Technicians</Label>
                    <div className="space-y-2">
                      {technicians.map(tech => (
                        <div key={tech.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tech-${tech.id}`}
                            checked={form.technician_ids?.includes(tech.id)}
                            onCheckedChange={(checked) => {
                              const current = form.technician_ids || [];
                              if (checked) {
                                handleChange('technician_ids', [...current, tech.id]);
                              } else {
                                handleChange('technician_ids', current.filter(id => id !== tech.id));
                              }
                            }}
                          />
                          <Label htmlFor={`tech-${tech.id}`}>{tech.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recurring Pattern */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Recurring Event</CardTitle>
                  <Checkbox 
                    checked={showRecurring} 
                    onCheckedChange={(checked: CheckedState) => setShowRecurring(checked === true)}
                  />
                </CardHeader>
                {showRecurring && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Repeat</Label>
                        <Select 
                          value={form.recurring_pattern?.type || 'daily'} 
                          onValueChange={(value) => handleChange('recurring_pattern', { 
                            ...form.recurring_pattern, 
                            type: value 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Interval</Label>
                        <Input
                          type="number"
                          min="1"
                          value={form.recurring_pattern?.interval || 1}
                          onChange={(e) => handleChange('recurring_pattern', {
                            ...form.recurring_pattern,
                            interval: parseInt(e.target.value) || 1
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={form.recurring_pattern?.end_date || ''}
                        onChange={(e) => handleChange('recurring_pattern', {
                          ...form.recurring_pattern,
                          end_date: e.target.value
                        })}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Reminders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Reminders</CardTitle>
                  <Checkbox
                    checked={showReminders}
                    onCheckedChange={(checked: CheckedState) => setShowReminders(checked === true)}
                  />
                </CardHeader>
                {showReminders && (
                  <CardContent className="space-y-4">
                    {form.reminders?.map((reminder, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="datetime-local"
                          value={reminder.reminder_time}
                          onChange={(e) => updateReminder(index, 'reminder_time', e.target.value)}
                        />
                        <Select
                          value={reminder.reminder_type}
                          onValueChange={(value) => updateReminder(index, 'reminder_type', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desktop">Desktop</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="push">Push</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeReminder(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addReminder}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Reminder
                    </Button>
                  </CardContent>
                )}
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Add any additional notes..."
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 p-4">
                <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Event'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
