
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, Phone } from 'lucide-react';
import { getTechnicianSchedule } from '@/lib/schedulingService';
import type { TechnicianSchedule as TechnicianScheduleType, ScheduleEvent } from '@/types/scheduling';

interface TechnicianScheduleProps {
  onEventClick: (event: ScheduleEvent) => void;
  onRefresh: () => void;
}

export function TechnicianSchedule({ onEventClick, onRefresh }: TechnicianScheduleProps) {
  const [schedules, setSchedules] = useState<TechnicianScheduleType[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTechnicianSchedules();
  }, []);

  const loadTechnicianSchedules = async () => {
    setLoading(true);
    try {
      // This would typically fetch technician schedules
      // For now, we'll show a placeholder structure
      setSchedules([]);
    } catch (error) {
      console.error('Error loading technician schedules:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading technician schedules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Technician Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger>
                <SelectValue placeholder="Select a technician to view schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Technicians</SelectItem>
                <SelectItem value="tech1">Mike Johnson - Senior Technician</SelectItem>
                <SelectItem value="tech2">David Chen - Installation Specialist</SelectItem>
                <SelectItem value="tech3">Alex Thompson - Maintenance Tech</SelectItem>
                <SelectItem value="tech4">Sarah Wilson - Service Manager</SelectItem>
              </SelectContent>
            </Select>

            {selectedTechnician && selectedTechnician !== 'all' && (
              <div className="space-y-4">
                {/* Technician Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          MJ
                        </div>
                        <div>
                          <div className="font-medium">Mike Johnson</div>
                          <div className="text-sm text-gray-500">Senior Technician</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          (555) 123-4567
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">This Week</span>
                      </div>
                      <div className="text-2xl font-bold">8</div>
                      <div className="text-xs text-gray-500">appointments</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Hours Logged</span>
                      </div>
                      <div className="text-2xl font-bold">42.5</div>
                      <div className="text-xs text-gray-500">this week</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Utilization</span>
                      </div>
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-xs text-gray-500">efficiency</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Schedule - {new Date().toLocaleDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: '1',
                          time: '09:00 AM - 11:00 AM',
                          title: 'Generator Installation',
                          customer: 'Miller Residence',
                          location: '1234 Oak Street, Houston, TX',
                          status: 'scheduled'
                        },
                        {
                          id: '2',
                          time: '01:00 PM - 03:00 PM',
                          title: 'Maintenance Check',
                          customer: 'Wilson Property',
                          location: '567 Pine Road, Houston, TX',
                          status: 'in_progress'
                        },
                        {
                          id: '3',
                          time: '04:00 PM - 06:00 PM',
                          title: 'Service Call',
                          customer: 'Downtown Office',
                          location: '890 Main Street, Houston, TX',
                          status: 'scheduled'
                        }
                      ].map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-start justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            // Create mock event for onClick handler
                            const mockEvent: ScheduleEvent = {
                              id: appointment.id,
                              title: appointment.title,
                              start_time: new Date().toISOString(),
                              end_time: new Date().toISOString(),
                              all_day: false,
                              event_type: 'appointment',
                              status: appointment.status as any,
                              priority: 'medium',
                              location: appointment.location,
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString(),
                              sync_status: 'local'
                            };
                            onEventClick(mockEvent);
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium">{appointment.time}</span>
                            </div>
                            <div className="font-medium">{appointment.title}</div>
                            <div className="text-sm text-gray-600">{appointment.customer}</div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {appointment.location}
                            </div>
                          </div>
                          <Badge
                            variant={
                              appointment.status === 'completed' ? 'default' :
                              appointment.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }
                          >
                            {appointment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Weekly Availability */}
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="text-center">
                          <div className="text-sm font-medium mb-2">{day}</div>
                          <div className="space-y-1">
                            {[
                              { time: '9-12', available: index < 5 },
                              { time: '1-5', available: index < 6 },
                              { time: '6-9', available: index === 0 || index === 2 }
                            ].map((slot, slotIndex) => (
                              <div
                                key={slotIndex}
                                className={`text-xs p-1 rounded ${
                                  slot.available 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {slot.time}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedTechnician === 'all' && (
              <Card>
                <CardHeader>
                  <CardTitle>All Technicians Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Mike Johnson', role: 'Senior Technician', status: 'available', appointments: 3 },
                      { name: 'David Chen', role: 'Installation Specialist', status: 'busy', appointments: 5 },
                      { name: 'Alex Thompson', role: 'Maintenance Tech', status: 'available', appointments: 2 },
                      { name: 'Sarah Wilson', role: 'Service Manager', status: 'in_meeting', appointments: 4 }
                    ].map((tech) => (
                      <div key={tech.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {tech.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-gray-500">{tech.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">{tech.appointments}</span> appointments today
                          </div>
                          <Badge
                            variant={
                              tech.status === 'available' ? 'default' :
                              tech.status === 'busy' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {tech.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!selectedTechnician && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a technician to view their schedule</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
