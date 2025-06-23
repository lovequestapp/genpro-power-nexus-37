
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User, Briefcase } from 'lucide-react';
import { getProjectSchedule } from '@/lib/schedulingService';
import type { ProjectSchedule as ProjectScheduleType, ScheduleEvent } from '@/types/scheduling';

interface ProjectScheduleProps {
  onEventClick: (event: ScheduleEvent) => void;
  onRefresh: () => void;
}

export function ProjectSchedule({ onEventClick, onRefresh }: ProjectScheduleProps) {
  const [projects, setProjects] = useState<ProjectScheduleType[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectSchedules();
  }, []);

  const loadProjectSchedules = async () => {
    setLoading(true);
    try {
      // This would typically fetch a list of projects and their schedules
      // For now, we'll show a placeholder structure
      setProjects([]);
    } catch (error) {
      console.error('Error loading project schedules:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project schedules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Project Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project to view schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="project1">Generator Installation - Miller Residence</SelectItem>
                <SelectItem value="project2">Maintenance Service - Wilson Property</SelectItem>
                <SelectItem value="project3">Commercial Setup - Downtown Office</SelectItem>
              </SelectContent>
            </Select>

            {selectedProject && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Total Events</span>
                      </div>
                      <div className="text-2xl font-bold">12</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Total Hours</span>
                      </div>
                      <div className="text-2xl font-bold">84.5</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium">Progress</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">65%</div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: '1',
                          title: 'Site Survey',
                          date: '2024-01-15',
                          status: 'completed',
                          technician: 'Mike Johnson'
                        },
                        {
                          id: '2',
                          title: 'Equipment Delivery',
                          date: '2024-01-20',
                          status: 'completed',
                          technician: 'David Chen'
                        },
                        {
                          id: '3',
                          title: 'Installation - Phase 1',
                          date: '2024-01-25',
                          status: 'in_progress',
                          technician: 'Mike Johnson'
                        },
                        {
                          id: '4',
                          title: 'Installation - Phase 2',
                          date: '2024-01-30',
                          status: 'scheduled',
                          technician: 'Alex Thompson'
                        },
                        {
                          id: '5',
                          title: 'Testing & Commissioning',
                          date: '2024-02-05',
                          status: 'scheduled',
                          technician: 'Mike Johnson'
                        }
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            // Create a mock event for the onClick handler
                            const mockEvent: ScheduleEvent = {
                              id: item.id,
                              title: item.title,
                              start_time: `${item.date}T09:00:00Z`,
                              end_time: `${item.date}T17:00:00Z`,
                              all_day: false,
                              event_type: 'project',
                              status: item.status as any,
                              priority: 'medium',
                              created_at: new Date().toISOString(),
                              updated_at: new Date().toISOString(),
                              sync_status: 'local'
                            };
                            onEventClick(mockEvent);
                          }}
                        >
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(item.date).toLocaleDateString()} • {item.technician}
                            </div>
                          </div>
                          <Badge
                            variant={
                              item.status === 'completed' ? 'default' :
                              item.status === 'in_progress' ? 'secondary' :
                              'outline'
                            }
                          >
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!selectedProject && (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a project to view its schedule</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
