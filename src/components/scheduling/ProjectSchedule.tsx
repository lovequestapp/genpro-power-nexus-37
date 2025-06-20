import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Users, MapPin, ChevronRight } from 'lucide-react';
import { getProjects } from '@/lib/billingService';
import { getProjectSchedule } from '@/lib/schedulingService';
import type { ScheduleEvent, ProjectSchedule as ProjectScheduleType } from '@/types/scheduling';

interface ProjectScheduleProps {
  onEventClick: (event: ScheduleEvent) => void;
  onRefresh: () => void;
}

export function ProjectSchedule({ onEventClick, onRefresh }: ProjectScheduleProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectSchedule, setProjectSchedule] = useState<ProjectScheduleType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectSchedule();
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0].id);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadProjectSchedule = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const data = await getProjectSchedule(selectedProject);
      setProjectSchedule(data);
    } catch (error) {
      console.error('Error loading project schedule:', error);
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
    if (!projectSchedule) return [];
    const now = new Date();
    return projectSchedule.events.filter(event => new Date(event.start_time) > now);
  };

  const getCompletedEvents = () => {
    if (!projectSchedule) return [];
    return projectSchedule.events.filter(event => event.status === 'completed');
  };

  const getInProgressEvents = () => {
    if (!projectSchedule) return [];
    return projectSchedule.events.filter(event => event.status === 'in_progress');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading project schedule...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {projectSchedule && (
        <>
          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{projectSchedule.project_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {projectSchedule.events.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(projectSchedule.total_hours)}h
                  </div>
                  <div className="text-sm text-gray-500">Total Hours</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {projectSchedule.completion_percentage}%
                  </div>
                  <div className="text-sm text-gray-500">Completion</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{projectSchedule.completion_percentage}%</span>
                </div>
                <Progress value={projectSchedule.completion_percentage} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{getUpcomingEvents().length}</div>
                <div className="text-sm text-gray-500">Upcoming Events</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{getInProgressEvents().length}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{getCompletedEvents().length}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Milestones */}
          {projectSchedule.milestones && projectSchedule.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectSchedule.milestones.map((milestone: any) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'in_progress' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}
                        />
                        <div>
                          <div className="font-medium">{milestone.title}</div>
                          {milestone.description && (
                            <div className="text-sm text-gray-500">{milestone.description}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {milestone.due_date ? formatDate(milestone.due_date) : 'No due date'}
                        </div>
                        <Badge className={getPriorityColor(milestone.priority)}>
                          {milestone.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Events */}
          <Card>
            <CardHeader>
              <CardTitle>Project Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectSchedule.events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No events scheduled for this project
                  </div>
                ) : (
                  projectSchedule.events.map(event => (
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
                        
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 