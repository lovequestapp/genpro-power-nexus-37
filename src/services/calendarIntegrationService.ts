
import { supabase } from '@/lib/supabase';

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface OutlookCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface CalendarSyncResult {
  success: boolean;
  message: string;
  syncedEvents?: number;
  errors?: string[];
}

// Google Calendar Integration
export class GoogleCalendarIntegration {
  private config: GoogleCalendarConfig;
  private accessToken: string | null = null;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const authUrl = this.buildAuthUrl();
      const popup = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check if we received the token (would be stored in localStorage by redirect handler)
            const token = localStorage.getItem('google_calendar_token');
            if (token) {
              this.accessToken = token;
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Google Calendar authentication error:', error);
      return false;
    }
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async syncFromGoogle(): Promise<CalendarSyncResult> {
    if (!this.accessToken) {
      return { success: false, message: 'Not authenticated with Google Calendar' };
    }

    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Google Calendar events');
      }

      const data = await response.json();
      const events = data.items || [];

      let syncedCount = 0;
      const errors: string[] = [];

      for (const event of events) {
        try {
          await this.importGoogleEvent(event);
          syncedCount++;
        } catch (error) {
          errors.push(`Failed to import event "${event.summary}": ${error}`);
        }
      }

      return {
        success: true,
        message: `Successfully synced ${syncedCount} events from Google Calendar`,
        syncedEvents: syncedCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      return { success: false, message: `Sync failed: ${error}` };
    }
  }

  async syncToGoogle(eventId: string): Promise<CalendarSyncResult> {
    if (!this.accessToken) {
      return { success: false, message: 'Not authenticated with Google Calendar' };
    }

    try {
      // Get event from our database
      const { data: event, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error || !event) {
        return { success: false, message: 'Event not found' };
      }

      // Convert to Google Calendar format
      const googleEvent = {
        summary: event.title,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.start_time,
          timeZone: 'America/Chicago'
        },
        end: {
          dateTime: event.end_time,
          timeZone: 'America/Chicago'
        }
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(googleEvent)
      });

      if (!response.ok) {
        throw new Error('Failed to create Google Calendar event');
      }

      const createdEvent = await response.json();

      // Update our event with Google Calendar ID
      await supabase
        .from('schedule_events')
        .update({ external_calendar_id: createdEvent.id })
        .eq('id', eventId);

      return { success: true, message: 'Event synced to Google Calendar', syncedEvents: 1 };
    } catch (error) {
      console.error('Google Calendar export error:', error);
      return { success: false, message: `Export failed: ${error}` };
    }
  }

  private async importGoogleEvent(googleEvent: any): Promise<void> {
    const eventData = {
      title: googleEvent.summary || 'Untitled Event',
      description: googleEvent.description || '',
      start_time: googleEvent.start?.dateTime || googleEvent.start?.date,
      end_time: googleEvent.end?.dateTime || googleEvent.end?.date,
      all_day: !googleEvent.start?.dateTime,
      location: googleEvent.location || '',
      event_type: 'other' as const,
      status: 'scheduled' as const,
      priority: 'medium' as const,
      external_calendar_id: googleEvent.id,
      sync_status: 'synced' as const
    };

    // Check if event already exists
    const { data: existing } = await supabase
      .from('schedule_events')
      .select('id')
      .eq('external_calendar_id', googleEvent.id)
      .single();

    if (!existing) {
      const { error } = await supabase
        .from('schedule_events')
        .insert(eventData);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    }
  }
}

// Outlook Calendar Integration
export class OutlookCalendarIntegration {
  private config: OutlookCalendarConfig;
  private accessToken: string | null = null;

  constructor(config: OutlookCalendarConfig) {
    this.config = config;
  }

  async authenticate(): Promise<boolean> {
    try {
      const authUrl = this.buildAuthUrl();
      const popup = window.open(authUrl, 'outlook-auth', 'width=500,height=600');
      
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            const token = localStorage.getItem('outlook_calendar_token');
            if (token) {
              this.accessToken = token;
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Outlook Calendar authentication error:', error);
      return false;
    }
  }

  private buildAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_type: 'code',
      response_mode: 'query'
    });

    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  }

  async syncFromOutlook(): Promise<CalendarSyncResult> {
    if (!this.accessToken) {
      return { success: false, message: 'Not authenticated with Outlook Calendar' };
    }

    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/events', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Outlook Calendar events');
      }

      const data = await response.json();
      const events = data.value || [];

      let syncedCount = 0;
      const errors: string[] = [];

      for (const event of events) {
        try {
          await this.importOutlookEvent(event);
          syncedCount++;
        } catch (error) {
          errors.push(`Failed to import event "${event.subject}": ${error}`);
        }
      }

      return {
        success: true,
        message: `Successfully synced ${syncedCount} events from Outlook Calendar`,
        syncedEvents: syncedCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Outlook Calendar sync error:', error);
      return { success: false, message: `Sync failed: ${error}` };
    }
  }

  private async importOutlookEvent(outlookEvent: any): Promise<void> {
    const eventData = {
      title: outlookEvent.subject || 'Untitled Event',
      description: outlookEvent.bodyPreview || '',
      start_time: outlookEvent.start?.dateTime,
      end_time: outlookEvent.end?.dateTime,
      all_day: outlookEvent.isAllDay || false,
      location: outlookEvent.location?.displayName || '',
      event_type: 'other' as const,
      status: 'scheduled' as const,
      priority: 'medium' as const,
      external_calendar_id: outlookEvent.id,
      sync_status: 'synced' as const
    };

    // Check if event already exists
    const { data: existing } = await supabase
      .from('schedule_events')
      .select('id')
      .eq('external_calendar_id', outlookEvent.id)
      .single();

    if (!existing) {
      const { error } = await supabase
        .from('schedule_events')
        .insert(eventData);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }
    }
  }
}

// ICS File Import/Export
export class ICSCalendarIntegration {
  static async exportToICS(events: any[]): Promise<string> {
    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//HOU GEN PROS//Schedule System//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';

    for (const event of events) {
      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += `UID:${event.id}@hougenprops.com\r\n`;
      icsContent += `DTSTART:${this.formatICSDateTime(event.start_time)}\r\n`;
      icsContent += `DTEND:${this.formatICSDateTime(event.end_time)}\r\n`;
      icsContent += `SUMMARY:${this.escapeICSText(event.title)}\r\n`;
      
      if (event.description) {
        icsContent += `DESCRIPTION:${this.escapeICSText(event.description)}\r\n`;
      }
      
      if (event.location) {
        icsContent += `LOCATION:${this.escapeICSText(event.location)}\r\n`;
      }
      
      icsContent += `STATUS:${event.status.toUpperCase()}\r\n`;
      icsContent += `PRIORITY:${this.mapPriorityToICS(event.priority)}\r\n`;
      icsContent += `CREATED:${this.formatICSDateTime(event.created_at)}\r\n`;
      icsContent += `LAST-MODIFIED:${this.formatICSDateTime(event.updated_at)}\r\n`;
      icsContent += 'END:VEVENT\r\n';
    }

    icsContent += 'END:VCALENDAR\r\n';
    return icsContent;
  }

  static async importFromICS(icsContent: string): Promise<CalendarSyncResult> {
    try {
      const events = this.parseICS(icsContent);
      let syncedCount = 0;
      const errors: string[] = [];

      for (const event of events) {
        try {
          const { error } = await supabase
            .from('schedule_events')
            .insert(event);

          if (error) throw error;
          syncedCount++;
        } catch (error) {
          errors.push(`Failed to import event "${event.title}": ${error}`);
        }
      }

      return {
        success: true,
        message: `Successfully imported ${syncedCount} events from ICS file`,
        syncedEvents: syncedCount,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('ICS import error:', error);
      return { success: false, message: `Import failed: ${error}` };
    }
  }

  private static parseICS(icsContent: string): any[] {
    const events: any[] = [];
    const lines = icsContent.split('\r\n').filter(line => line.trim());
    
    let currentEvent: any = null;
    
    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') {
        currentEvent = {
          event_type: 'other',
          status: 'scheduled',
          priority: 'medium',
          all_day: false
        };
      } else if (line === 'END:VEVENT' && currentEvent) {
        events.push(currentEvent);
        currentEvent = null;
      } else if (currentEvent && line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':');
        
        switch (key) {
          case 'SUMMARY':
            currentEvent.title = this.unescapeICSText(value);
            break;
          case 'DESCRIPTION':
            currentEvent.description = this.unescapeICSText(value);
            break;
          case 'LOCATION':
            currentEvent.location = this.unescapeICSText(value);
            break;
          case 'DTSTART':
            currentEvent.start_time = this.parseICSDateTime(value);
            break;
          case 'DTEND':
            currentEvent.end_time = this.parseICSDateTime(value);
            break;
        }
      }
    }
    
    return events;
  }

  private static formatICSDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  private static parseICSDateTime(icsDateTime: string): string {
    // Handle YYYYMMDDTHHMMSSZ format
    if (icsDateTime.endsWith('Z')) {
      const year = icsDateTime.substring(0, 4);
      const month = icsDateTime.substring(4, 6);
      const day = icsDateTime.substring(6, 8);
      const hour = icsDateTime.substring(9, 11);
      const minute = icsDateTime.substring(11, 13);
      const second = icsDateTime.substring(13, 15);
      
      return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }
    
    return new Date(icsDateTime).toISOString();
  }

  private static escapeICSText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  }

  private static unescapeICSText(text: string): string {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
  }

  private static mapPriorityToICS(priority: string): string {
    switch (priority) {
      case 'urgent': return '1';
      case 'high': return '3';
      case 'medium': return '5';
      case 'low': return '7';
      default: return '5';
    }
  }
}
