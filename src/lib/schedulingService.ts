import { supabase } from './supabase';
import type {
  ScheduleEvent,
  ScheduleFormData,
  ScheduleFilter,
  CalendarView,
  ScheduleStats,
  ProjectSchedule,
  TechnicianSchedule,
  CalendarIntegration,
  ScheduleConflict,
  TimeSlot,
  CalendarExportOptions
} from '@/types/scheduling';

// --- SCHEDULE EVENTS ---
export async function getScheduleEvents(filters: ScheduleFilter = {}): Promise<ScheduleEvent[]> {
  try {
    let query = supabase
      .from('schedule_events')
      .select(`
        *,
        event_reminders(*),
        event_attachments(*),
        projects(name),
        customers(name)
      `)
      .order('start_time', { ascending: true });

    // Apply filters
    if (filters.event_type && filters.event_type.length > 0) {
      query = query.in('event_type', filters.event_type);
    }
    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    if (filters.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }
    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    if (filters.customer_id) {
      query = query.eq('customer_id', filters.customer_id);
    }
    if (filters.technician_ids && filters.technician_ids.length > 0) {
      query = query.overlaps('technician_ids', filters.technician_ids);
    }
    if (filters.date_range) {
      query = query
        .gte('start_time', filters.date_range.start)
        .lte('end_time', filters.date_range.end);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching schedule events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getScheduleEvents:', error);
    return [];
  }
}

export async function getScheduleEvent(id: string): Promise<ScheduleEvent | null> {
  try {
    const { data, error } = await supabase
      .from('schedule_events')
      .select(`
        *,
        event_reminders(*),
        event_attachments(*),
        projects(name),
        customers(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching schedule event:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception in getScheduleEvent:', error);
    return null;
  }
}

export async function saveScheduleEvent(id: string | undefined, form: ScheduleFormData): Promise<string> {
  try {
    const eventData = {
      title: form.title,
      description: form.description,
      start_time: form.start_time,
      end_time: form.end_time,
      all_day: form.all_day,
      location: form.location,
      event_type: form.event_type,
      priority: form.priority,
      color: form.color,
      project_id: form.project_id,
      customer_id: form.customer_id,
      technician_ids: form.technician_ids,
      recurring_pattern: form.recurring_pattern,
      notes: form.notes,
      updated_at: new Date().toISOString()
    };

    if (id) {
      // Update existing event
      const { error } = await supabase
        .from('schedule_events')
        .update(eventData)
        .eq('id', id);
      
      if (error) throw error;

      // Update reminders
      if (form.reminders) {
        // Delete existing reminders
        await supabase.from('event_reminders').delete().eq('event_id', id);
        
        // Insert new reminders
        for (const reminder of form.reminders) {
          await supabase.from('event_reminders').insert({
            event_id: id,
            reminder_time: reminder.reminder_time,
            reminder_type: reminder.reminder_type
          });
        }
      }

      return id;
    } else {
      // Create new event
      const { data, error } = await supabase
        .from('schedule_events')
        .insert([eventData])
        .select('id')
        .single();

      if (error || !data) throw error || new Error('Failed to create event');

      // Insert reminders
      if (form.reminders) {
        for (const reminder of form.reminders) {
          await supabase.from('event_reminders').insert({
            event_id: data.id,
            reminder_time: reminder.reminder_time,
            reminder_type: reminder.reminder_type
          });
        }
      }

      return data.id;
    }
  } catch (error) {
    console.error('Exception in saveScheduleEvent:', error);
    throw error;
  }
}

export async function deleteScheduleEvent(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('schedule_events').delete().eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Exception in deleteScheduleEvent:', error);
    throw error;
  }
}

export async function updateEventStatus(id: string, status: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('schedule_events')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Exception in updateEventStatus:', error);
    throw error;
  }
}

// --- CALENDAR VIEWS ---
export async function getCalendarView(viewType: string, currentDate: string): Promise<CalendarView> {
  try {
    const startOfPeriod = new Date(currentDate);
    let endOfPeriod = new Date(currentDate);

    // Calculate date range based on view type
    switch (viewType) {
      case 'day':
        endOfPeriod.setDate(startOfPeriod.getDate() + 1);
        break;
      case 'week':
        endOfPeriod.setDate(startOfPeriod.getDate() + 7);
        break;
      case 'month':
        endOfPeriod.setMonth(startOfPeriod.getMonth() + 1);
        break;
      case 'year':
        endOfPeriod.setFullYear(startOfPeriod.getFullYear() + 1);
        break;
      default:
        endOfPeriod.setDate(startOfPeriod.getDate() + 1);
    }

    const events = await getScheduleEvents({
      date_range: {
        start: startOfPeriod.toISOString(),
        end: endOfPeriod.toISOString()
      }
    });

    return {
      type: viewType as any,
      current_date: currentDate,
      events
    };
  } catch (error) {
    console.error('Exception in getCalendarView:', error);
    return {
      type: viewType as any,
      current_date: currentDate,
      events: []
    };
  }
}

// --- PROJECT SCHEDULING ---
export async function getProjectSchedule(projectId: string): Promise<ProjectSchedule | null> {
  try {
    // Get project details
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, name, progress_percentage')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      console.error('Error fetching project:', projectError);
      return null;
    }

    // Get project events
    const events = await getScheduleEvents({ project_id: projectId });

    // Get project milestones
    const { data: milestones } = await supabase
      .from('milestones')
      .select('*')
      .eq('project_id', projectId)
      .order('due_date');

    // Calculate total hours
    const totalHours = events.reduce((total, event) => {
      if (event.start_time && event.end_time) {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0);

    return {
      project_id: project.id,
      project_name: project.name,
      events,
      milestones: milestones || [],
      total_hours: totalHours,
      completion_percentage: project.progress_percentage || 0
    };
  } catch (error) {
    console.error('Exception in getProjectSchedule:', error);
    return null;
  }
}

export async function getTechnicianSchedule(technicianId: string): Promise<TechnicianSchedule | null> {
  try {
    // Get technician details
    const { data: technician, error: techError } = await supabase
      .from('technicians')
      .select('id, name')
      .eq('id', technicianId)
      .single();

    if (techError || !technician) {
      console.error('Error fetching technician:', techError);
      return null;
    }

    // Get technician events
    const events = await getScheduleEvents({ 
      technician_ids: [technicianId] 
    });

    // Calculate total hours
    const totalHours = events.reduce((total, event) => {
      if (event.start_time && event.end_time) {
        const start = new Date(event.start_time);
        const end = new Date(event.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return total + hours;
      }
      return total;
    }, 0);

    // Get current project
    const currentProject = events.find(event => 
      event.status === 'in_progress' && event.project_id
    );

    // Generate availability slots (simplified)
    const availability: TimeSlot[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      for (let hour = 8; hour < 18; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);

        const hasConflict = events.some(event => {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);
          return eventStart < endTime && eventEnd > startTime;
        });

        availability.push({
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          available: !hasConflict,
          technician_id: technicianId
        });
      }
    }

    return {
      technician_id: technician.id,
      technician_name: technician.name,
      events,
      total_hours: totalHours,
      availability,
      current_project: currentProject?.project_id
    };
  } catch (error) {
    console.error('Exception in getTechnicianSchedule:', error);
    return null;
  }
}

// --- CALENDAR INTEGRATION ---
export async function getCalendarIntegrations(): Promise<CalendarIntegration[]> {
  try {
    const { data, error } = await supabase
      .from('calendar_integrations')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching calendar integrations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getCalendarIntegrations:', error);
    return [];
  }
}

export async function saveCalendarIntegration(integration: CalendarIntegration): Promise<void> {
  try {
    if (integration.id) {
      const { error } = await supabase
        .from('calendar_integrations')
        .update(integration)
        .eq('id', integration.id);
      
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('calendar_integrations')
        .insert(integration);
      
      if (error) throw error;
    }
  } catch (error) {
    console.error('Exception in saveCalendarIntegration:', error);
    throw error;
  }
}

export async function syncCalendar(integrationId: string): Promise<void> {
  try {
    // This would implement actual calendar sync logic
    // For now, just update the last_sync timestamp
    const { error } = await supabase
      .from('calendar_integrations')
      .update({ 
        last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', integrationId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Exception in syncCalendar:', error);
    throw error;
  }
}

// --- SCHEDULE STATISTICS ---
export async function getScheduleStats(): Promise<ScheduleStats> {
  try {
    const events = await getScheduleEvents();
    const now = new Date();

    const stats: ScheduleStats = {
      total_events: events.length,
      upcoming_events: events.filter(e => new Date(e.start_time) > now).length,
      overdue_events: events.filter(e => 
        new Date(e.end_time) < now && e.status !== 'completed'
      ).length,
      completed_events: events.filter(e => e.status === 'completed').length,
      events_by_type: {},
      events_by_status: {},
      events_by_priority: {},
      busy_hours: {}
    };

    // Calculate breakdowns
    events.forEach(event => {
      // By type
      stats.events_by_type[event.event_type] = (stats.events_by_type[event.event_type] || 0) + 1;
      
      // By status
      stats.events_by_status[event.status] = (stats.events_by_status[event.status] || 0) + 1;
      
      // By priority
      stats.events_by_priority[event.priority] = (stats.events_by_priority[event.priority] || 0) + 1;
      
      // Busy hours
      if (event.start_time && event.end_time) {
        const start = new Date(event.start_time);
        const hour = start.getHours();
        stats.busy_hours[hour] = (stats.busy_hours[hour] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('Exception in getScheduleStats:', error);
    return {
      total_events: 0,
      upcoming_events: 0,
      overdue_events: 0,
      completed_events: 0,
      events_by_type: {},
      events_by_status: {},
      events_by_priority: {},
      busy_hours: {}
    };
  }
}

// --- CONFLICT DETECTION ---
export async function getScheduleConflicts(): Promise<ScheduleConflict[]> {
  try {
    const { data, error } = await supabase
      .from('schedule_conflicts')
      .select('*')
      .is('resolved_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching schedule conflicts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception in getScheduleConflicts:', error);
    return [];
  }
}

export async function resolveConflict(conflictId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('schedule_conflicts')
      .update({ 
        resolved_at: new Date().toISOString(),
        resolved_by: 'current_user' // This would be the actual user ID
      })
      .eq('id', conflictId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Exception in resolveConflict:', error);
    throw error;
  }
}

// --- EXPORT FUNCTIONS ---
export async function exportCalendar(options: CalendarExportOptions): Promise<string> {
  try {
    const events = await getScheduleEvents(options.filter);
    
    switch (options.format) {
      case 'ics':
        return generateICSFile(events);
      case 'csv':
        return generateCSVFile(events);
      case 'json':
        return JSON.stringify(events, null, 2);
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Exception in exportCalendar:', error);
    throw error;
  }
}

function generateICSFile(events: ScheduleEvent[]): string {
  let ics = 'BEGIN:VCALENDAR\r\n';
  ics += 'VERSION:2.0\r\n';
  ics += 'PRODID:-//GenPro Power//Schedule System//EN\r\n';
  
  events.forEach(event => {
    ics += 'BEGIN:VEVENT\r\n';
    ics += `UID:${event.id}\r\n`;
    ics += `DTSTART:${formatICSDate(event.start_time)}\r\n`;
    ics += `DTEND:${formatICSDate(event.end_time)}\r\n`;
    ics += `SUMMARY:${event.title}\r\n`;
    if (event.description) {
      ics += `DESCRIPTION:${event.description}\r\n`;
    }
    if (event.location) {
      ics += `LOCATION:${event.location}\r\n`;
    }
    ics += 'END:VEVENT\r\n';
  });
  
  ics += 'END:VCALENDAR\r\n';
  return ics;
}

function generateCSVFile(events: ScheduleEvent[]): string {
  const headers = ['Title', 'Description', 'Start Time', 'End Time', 'Location', 'Type', 'Status', 'Priority'];
  const rows = events.map(event => [
    event.title,
    event.description || '',
    event.start_time,
    event.end_time,
    event.location || '',
    event.event_type,
    event.status,
    event.priority
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}

function formatICSDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

// --- UTILITY FUNCTIONS ---
export async function getAvailableTimeSlots(
  date: string,
  technicianIds?: string[],
  duration: number = 60
): Promise<TimeSlot[]> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(8, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0);
    
    const events = await getScheduleEvents({
      date_range: {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      },
      technician_ids: technicianIds
    });
    
    const slots: TimeSlot[] = [];
    const currentTime = new Date(startOfDay);
    
    while (currentTime < endOfDay) {
      const slotEnd = new Date(currentTime);
      slotEnd.setMinutes(currentTime.getMinutes() + duration);
      
      const hasConflict = events.some(event => {
        const eventStart = new Date(event.start_time);
        const eventEnd = new Date(event.end_time);
        return eventStart < slotEnd && eventEnd > currentTime;
      });
      
      slots.push({
        start_time: currentTime.toISOString(),
        end_time: slotEnd.toISOString(),
        available: !hasConflict,
        technician_id: technicianIds?.[0]
      });
      
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-minute intervals
    }
    
    return slots;
  } catch (error) {
    console.error('Exception in getAvailableTimeSlots:', error);
    return [];
  }
} 