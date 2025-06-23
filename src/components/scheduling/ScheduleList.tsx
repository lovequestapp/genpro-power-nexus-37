
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Clock, MapPin, User } from 'lucide-react';
import { getScheduleEvents, updateEventStatus } from '@/lib/schedulingService';
import { useToast } from '@/hooks/use-toast';
import type { ScheduleEvent, ScheduleFilter } from '@/types/scheduling';

interface ScheduleListProps {
  onEventClick: (event: ScheduleEvent) => void;
  onRefresh: () => void;
}

export function ScheduleList({ onEventClick, onRefresh }: ScheduleListProps) {
  const { toast } = useToast();
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    loadEvents();
  }, [searchTerm, statusFilter, typeFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const filters: ScheduleFilter = {};
      
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.status = [statusFilter];
      if (typeFilter) filters.event_type = [typeFilter];

      const data = await getScheduleEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (eventId: string, newStatus: string) => {
    try {
      await updateEventStatus(eventId, newStatus);
      toast({
        title: 'Success',
        description: 'Event status updated'
      });
      loadEvents();
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event status',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="project">Project</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onEventClick(event)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                      
                      {event.description && (
                        <p className="text-gray-500 mt-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    
                    <Select
                      value={event.status}
                      onValueChange={(value) => handleStatusUpdate(event.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
