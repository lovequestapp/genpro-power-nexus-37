
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Users, Settings, Upload, BarChart3 } from 'lucide-react';
import { getScheduleStats } from '@/lib/schedulingService';
import type { ScheduleStats as StatsType, ScheduleEvent } from '@/types/scheduling';
import { CalendarTabContent } from '@/components/scheduling/CalendarTabContent';
import { ScheduleForm } from '@/components/scheduling/ScheduleForm';
import { ScheduleList } from '@/components/scheduling/ScheduleList';
import { ProjectSchedule } from '@/components/scheduling/ProjectSchedule';
import { TechnicianSchedule } from '@/components/scheduling/TechnicianSchedule';
import { CalendarIntegration } from '@/components/scheduling/CalendarIntegration';
import { ScheduleStats } from '@/components/scheduling/ScheduleStats';

export default function Scheduling() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [recentEvents, setRecentEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await getScheduleStats();
      setStats(statsData);
      setRecentEvents([]);
    } catch (error) {
      console.error('Error loading scheduling stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleEditEvent = (event: ScheduleEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    loadData();
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage appointments, projects, and team scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleCreateEvent}>
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && stats && (
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
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.upcoming_events}</div>
              <p className="text-xs text-muted-foreground">
                Events scheduled ahead
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed_events}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue_events}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="technicians" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Technicians
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Integration
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Interactive calendar with drag-and-drop scheduling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarTabContent 
                handleEditEvent={handleEditEvent} 
                handleCreateEvent={handleCreateEvent} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <ScheduleList 
            onEventClick={handleEditEvent}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ProjectSchedule 
            onEventClick={handleEditEvent}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <TechnicianSchedule 
            onEventClick={handleEditEvent}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <CalendarIntegration onRefresh={handleRefresh} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ScheduleStats stats={stats} recentEvents={recentEvents} />
        </TabsContent>
      </Tabs>
      
      {showForm && (
        <ScheduleForm
          event={editingEvent}
          onClose={handleFormClose}
          onSave={handleFormClose}
        />
      )}
    </div>
  );
}
