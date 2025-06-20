import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import type { ScheduleStats as StatsType, ScheduleEvent } from '@/types/scheduling';

interface ScheduleStatsProps {
  stats: StatsType | null;
  recentEvents: ScheduleEvent[];
}

export function ScheduleStats({ stats, recentEvents }: ScheduleStatsProps) {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    );
  }

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

  const getBusyHoursChart = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const maxCount = Math.max(...Object.values(stats.busy_hours));
    
    return (
      <div className="space-y-2">
        {hours.map(hour => {
          const count = stats.busy_hours[hour] || 0;
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
          
          return (
            <div key={hour} className="flex items-center gap-2">
              <div className="w-8 text-xs text-gray-500">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-8 text-xs text-gray-500 text-right">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getEventsByTypeChart = () => {
    const types = Object.entries(stats.events_by_type);
    const total = types.reduce((sum, [_, count]) => sum + count, 0);
    
    return (
      <div className="space-y-2">
        {types.map(([type, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEventTypeColor(type) }}
                />
                <span className="text-sm capitalize">{type}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getEventTypeColor(type)
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getEventsByPriorityChart = () => {
    const priorities = Object.entries(stats.events_by_priority);
    const total = priorities.reduce((sum, [_, count]) => sum + count, 0);
    
    return (
      <div className="space-y-2">
        {priorities.map(([priority, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          
          return (
            <div key={priority} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(priority)}>
                  {priority}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: getPriorityColor(priority).includes('red') ? '#EF4444' :
                                    getPriorityColor(priority).includes('orange') ? '#F59E0B' :
                                    getPriorityColor(priority).includes('yellow') ? '#EAB308' :
                                    getPriorityColor(priority).includes('green') ? '#10B981' : '#6B7280'
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_events}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming_events}</div>
            <p className="text-xs text-muted-foreground">
              Events in the future
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed_events}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Events</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue_events}</div>
            <p className="text-xs text-muted-foreground">
              Past due events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events by Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Events by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsByTypeChart()}
          </CardContent>
        </Card>

        {/* Events by Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Events by Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getEventsByPriorityChart()}
          </CardContent>
        </Card>

        {/* Events by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Events by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.events_by_status).map(([status, count]) => {
                const total = Object.values(stats.events_by_status).reduce((sum, val) => sum + val, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{status.replace('_', ' ')}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <Progress value={percentage} />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Busy Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Busy Hours (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto">
              {getBusyHoursChart()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent events
              </div>
            ) : (
              recentEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                      <div className="text-xs text-gray-500">{formatTime(event.start_time)}</div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Badge className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 