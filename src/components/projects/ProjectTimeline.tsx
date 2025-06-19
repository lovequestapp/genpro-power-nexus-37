import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabaseService } from '@/services/supabase';
import { 
  Clock, 
  User, 
  MessageSquare, 
  Paperclip, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  Wrench
} from 'lucide-react';
import type { Project } from '@/lib/supabase';

interface TimelineEvent {
  id: string;
  type: 'status_change' | 'note_added' | 'attachment_uploaded' | 'project_created' | 'project_updated' | 'assignment_change';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: any;
}

interface ProjectTimelineProps {
  project: Project;
}

export function ProjectTimeline({ project }: ProjectTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateTimeline();
  }, [project]);

  const generateTimeline = async () => {
    try {
      setLoading(true);
      const timelineEvents: TimelineEvent[] = [];

      // Project creation event
      timelineEvents.push({
        id: 'project-created',
        type: 'project_created',
        title: 'Project Created',
        description: `Project "${project.name}" was created`,
        timestamp: project.created_at,
        user: 'System',
      });

      // Project updates
      if (project.updated_at !== project.created_at) {
        timelineEvents.push({
          id: 'project-updated',
          type: 'project_updated',
          title: 'Project Updated',
          description: 'Project details were modified',
          timestamp: project.updated_at,
          user: 'System',
        });
      }

      // Status changes (if not initial status)
      if (project.status !== 'planned') {
        timelineEvents.push({
          id: 'status-change',
          type: 'status_change',
          title: 'Status Changed',
          description: `Project status changed to ${project.status.replace('_', ' ')}`,
          timestamp: project.updated_at,
          user: 'System',
          metadata: { status: project.status },
        });
      }

      // Fetch and add notes
      try {
        const notes = await supabaseService.getProjectNotes(project.id);
        if (notes) {
          notes.forEach((note, index) => {
            timelineEvents.push({
              id: `note-${note.id}`,
              type: 'note_added',
              title: 'Note Added',
              description: `${note.type.charAt(0).toUpperCase() + note.type.slice(1)} note: ${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}`,
              timestamp: note.created_at,
              user: note.author_id || 'System',
              metadata: { note },
            });
          });
        }
      } catch (error) {
        console.error('Error fetching notes for timeline:', error);
      }

      // Fetch and add attachments
      try {
        const attachments = await supabaseService.getProjectAttachments(project.id);
        if (attachments) {
          attachments.forEach((attachment) => {
            timelineEvents.push({
              id: `attachment-${attachment.id}`,
              type: 'attachment_uploaded',
              title: 'File Uploaded',
              description: `File "${attachment.file_name}" was uploaded`,
              timestamp: attachment.created_at,
              user: attachment.uploaded_by || 'System',
              metadata: { attachment },
            });
          });
        }
      } catch (error) {
        console.error('Error fetching attachments for timeline:', error);
      }

      // Sort events by timestamp (newest first)
      timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setEvents(timelineEvents);
    } catch (error) {
      console.error('Error generating timeline:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project timeline',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'project_created':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'project_updated':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'status_change':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'note_added':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'attachment_uploaded':
        return <Paperclip className="h-4 w-4 text-indigo-500" />;
      case 'assignment_change':
        return <Users className="h-4 w-4 text-teal-500" />;
      default:
        return <Clock className="h-4 w-4 text-steel-500" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'project_created':
        return 'border-green-200 bg-green-50';
      case 'project_updated':
        return 'border-blue-200 bg-blue-50';
      case 'status_change':
        return 'border-orange-200 bg-orange-50';
      case 'note_added':
        return 'border-purple-200 bg-purple-50';
      case 'attachment_uploaded':
        return 'border-indigo-200 bg-indigo-50';
      case 'assignment_change':
        return 'border-teal-200 bg-teal-50';
      default:
        return 'border-steel-200 bg-steel-50';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'archived': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Project Timeline ({events.length} events)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-steel-300" />
              <p>No timeline events yet</p>
              <p className="text-sm">Project activity will appear here</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-16 bg-steel-200" />
                )}
                
                {/* Event card */}
                <div className={`relative flex gap-4 p-4 rounded-lg border ${getEventColor(event.type)}`}>
                  {/* Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-steel-200 flex items-center justify-center">
                    {getEventIcon(event.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-steel-900">{event.title}</h4>
                        <p className="text-sm text-steel-600 mt-1">{event.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-steel-500">
                        <span>{getRelativeTime(event.timestamp)}</span>
                        <span>•</span>
                        <span>{formatDate(event.timestamp)}</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    {event.metadata && (
                      <div className="mt-2">
                        {event.metadata.status && (
                          <Badge variant={getStatusBadgeVariant(event.metadata.status)} className="capitalize">
                            {event.metadata.status.replace('_', ' ')}
                          </Badge>
                        )}
                        {event.metadata.note && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <p className="text-sm text-steel-700">
                              {event.metadata.note.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {event.metadata.note.type}
                              </Badge>
                              {event.metadata.note.is_internal && (
                                <Badge variant="outline" className="text-xs">
                                  Internal
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        {event.metadata.attachment && (
                          <div className="mt-2 p-2 bg-white rounded border">
                            <div className="flex items-center gap-2">
                              <Paperclip className="w-4 h-4 text-steel-500" />
                              <span className="text-sm font-medium">
                                {event.metadata.attachment.file_name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* User info */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-steel-500">
                      <User className="w-3 h-3" />
                      <span>{event.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 