import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Users, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getTechnicianSchedule } from '@/lib/schedulingService';
import type { ScheduleEvent, TechnicianSchedule as TechnicianScheduleType, TimeSlot } from '@/types/scheduling';

interface TechnicianScheduleProps {
  onEventClick: (event: ScheduleEvent) => void;
  onRefresh: () => void;
}

export function TechnicianSchedule({ onEventClick, onRefresh }: TechnicianScheduleProps) {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [technicianSchedule, setTechnicianSchedule] = useState<TechnicianScheduleType | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadTechnicians();
  }, []);

  useEffect(() => {
    if (selectedTechnician) {
      loadTechnicianSchedule();
    }
  }, [selectedTechnician]);

  const loadTechnicians = async () => {
    // Mock technicians data - replace with actual API call
    const mockTechnicians = [
      { id: '1', name: 'John Smith', role: 'lead', availability: 'available' },
      { id: '2', name: 'Jane Doe', role: 'assistant', availability: 'assigned' },
      { id: '3', name: 'Mike Johnson', role: 'apprentice', availability: 'available' },
      { id: '4', name: 'Sarah Wilson', role: 'lead', availability: 'off-duty' },
      { id: '5', name: 'David Brown', role: 'assistant', availability: 'available' }
    ];
    setTechnicians(mockTechnicians);
    if (mockTechnicians.length > 0) {
      setSelectedTechnician(mockTechnicians[0].id);
    }
  };

  const loadTechnicianSchedule = async () => {
    if (!selectedTechnician) return;
    
    setLoading(true);
    try {
      const data = await getTechnicianSchedule(selectedTechnician);
      setTechnicianSchedule(data);
    } catch (error) {
      console.error('Error loading technician schedule:', error);
    }
    setLoading(false);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'off-duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getUpcomingEvents = () => {
    if (!technicianSchedule) return [];
    const now = new Date();
    return technicianSchedule.events.filter(event => new Date(event.start_time) > now);
  };

  const getTodayEvents = () => {
    if (!technicianSchedule) return [];
    const today = new Date();
    return technicianSchedule.events.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === today.toDateString();
    });
  };

  const getAvailableSlots = () => {
    if (!technicianSchedule) return [];
    return technicianSchedule.availability.filter(slot => slot.available);
  };

  const getBusySlots = () => {
    if (!technicianSchedule) return [];
    return technicianSchedule.availability.filter(slot => !slot.available);
  };

  const renderAvailabilityGrid = () => {
    if (!technicianSchedule) return null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 6 PM

    return (
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 text-center text-sm font-medium text-gray-500">
          <div></div>
          {days.map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        {/* Time slots */}
        {hours.map(hour => (
          <div key={hour} className="grid grid-cols-8 gap-1">
            <div className="text-sm text-gray-500 p-2 text-right">
              {hour}:00
            </div>
            {days.map((_, dayIndex) => {
              const slot = technicianSchedule.availability.find(s => {
                const slotDate = new Date(s.start_time);
                const slotHour = slotDate.getHours();
                const slotDay = slotDate.getDay();
                return slotHour === hour && slotDay === (dayIndex + 1) % 7;
              });

              return (
                <div
                  key={dayIndex}
                  className={`
                    h-8 border rounded cursor-pointer
                    ${slot?.available ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}
                  `}
                  title={slot?.available ? 'Available' : 'Busy'}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading technician schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Technician Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Technician</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
            <SelectTrigger>
              <SelectValue placeholder="Select a technician" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map(technician => (
                <SelectItem key={technician.id} value={technician.id}>
                  <div className="flex items-center gap-2">
                    <span>{technician.name}</span>
                    <Badge className={getAvailabilityColor(technician.availability)}>
                      {technician.availability}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {technicianSchedule && (
        <>
          {/* Technician Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{technicianSchedule.technician_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {technicianSchedule.events.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(technicianSchedule.total_hours)}h
                  </div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {getAvailableSlots().length}
                  </div>
                  <div className="text-sm text-gray-500">Available Slots</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {getUpcomingEvents().length}
                  </div>
                  <div className="text-sm text-gray-500">Upcoming Events</div>
                </div>
              </div>
              
              {technicianSchedule.current_project && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Current Project</div>
                  <div className="text-blue-600">{technicianSchedule.current_project}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule Tabs */}
          <Tabs defaultValue="events" className="space-y-4">
            <TabsList>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {technicianSchedule.events.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No events scheduled for this technician
                      </div>
                    ) : (
                      technicianSchedule.events.map(event => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                            />
                            
                            <div>
                              <div className="font-medium">{event.title}</div>
                              {event.description && (
                                <div className="text-sm text-gray-500">{event.description}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">{formatDate(event.start_time)}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(event.start_time)} - {formatTime(event.end_time)}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-sm text-gray-600">
                                {formatDuration(event.start_time, event.end_time)}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {event.event_type}
                              </Badge>
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderAvailabilityGrid()}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Available Slots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getAvailableSlots().slice(0, 10).map((slot, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {formatDate(slot.start_time)} {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </div>
                      ))}
                      {getAvailableSlots().length > 10 && (
                        <div className="text-sm text-gray-500">
                          +{getAvailableSlots().length - 10} more slots
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Busy Slots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {getBusySlots().slice(0, 10).map((slot, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {formatDate(slot.start_time)} {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </div>
                      ))}
                      {getBusySlots().length > 10 && (
                        <div className="text-sm text-gray-500">
                          +{getBusySlots().length - 10} more slots
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTodayEvents().length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No events scheduled for today
                      </div>
                    ) : (
                      getTodayEvents().map(event => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => onEventClick(event)}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: getEventTypeColor(event.event_type) }}
                            />
                            
                            <div>
                              <div className="font-medium">{event.title}</div>
                              {event.description && (
                                <div className="text-sm text-gray-500">{event.description}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-sm font-medium">
                                {formatTime(event.start_time)} - {formatTime(event.end_time)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDuration(event.start_time, event.end_time)}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <Badge className={getPriorityColor(event.priority)}>
                                {event.priority}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {event.event_type}
                              </Badge>
                            </div>
                            
                            {event.location && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 