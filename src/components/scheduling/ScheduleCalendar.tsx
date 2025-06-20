import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { getCalendarView, getScheduleEvents } from '@/lib/schedulingService';
import type { ScheduleEvent, CalendarView as CalendarViewType } from '@/types/scheduling';

interface ScheduleCalendarProps {
  onEventClick: (event: ScheduleEvent) => void;
  onDateClick: () => void;
}

type ViewType = 'day' | 'week' | 'month' | 'year' | 'agenda';

export function ScheduleCalendar({ onEventClick, onDateClick }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('month');
  const [calendarView, setCalendarView] = useState<CalendarViewType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendarData();
  }, [currentDate, viewType]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const data = await getCalendarView(viewType, currentDate.toISOString());
      setCalendarView(data);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
    setLoading(false);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewType) {
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date, format: 'short' | 'long' | 'month' | 'year' = 'short') => {
    switch (format) {
      case 'long':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'month':
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
    }
  };

  const getEventColor = (event: ScheduleEvent) => {
    if (event.color) return event.color;
    
    switch (event.event_type) {
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

  const renderMonthView = () => {
    if (!calendarView) return null;

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startOfWeek = new Date(startOfMonth);
    startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());

    const weeks = [];
    const currentWeek = new Date(startOfWeek);

    while (currentWeek <= endOfMonth || currentWeek.getDay() !== 0) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeek);
        day.setDate(currentWeek.getDate() + i);
        
        const dayEvents = calendarView.events.filter(event => {
          const eventDate = new Date(event.start_time);
          return eventDate.toDateString() === day.toDateString();
        });

        week.push({ date: day, events: dayEvents });
      }
      weeks.push(week);
      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    return (
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map(({ date, events }, index) => {
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={onDateClick}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isToday ? 'text-blue-600' : ''}
                `}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {events.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer truncate"
                      style={{ backgroundColor: getEventColor(event) + '20', color: getEventColor(event) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    if (!calendarView) return null;

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      const dayEvents = calendarView.events.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === day.toDateString();
      });

      days.push({ date: day, events: dayEvents });
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map(({ date, events }) => (
          <div key={date.toISOString()} className="space-y-2">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-500">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`
                text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto
                ${date.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white' : ''}
              `}>
                {date.getDate()}
              </div>
            </div>
            
            <div className="space-y-1">
              {events.map(event => (
                <div
                  key={event.id}
                  className="p-2 rounded text-xs cursor-pointer border-l-4"
                  style={{ borderLeftColor: getEventColor(event) }}
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-gray-500">
                    {new Date(event.start_time).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    if (!calendarView) return null;

    const dayEvents = calendarView.events.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return (
      <div className="space-y-2">
        {dayEvents.map(event => (
          <div
            key={event.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onEventClick(event)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <Badge className={getPriorityColor(event.priority)}>
                    {event.priority}
                  </Badge>
                  <Badge variant="outline">{event.event_type}</Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(event.start_time).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })} - {new Date(event.end_time).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  )}
                  
                  {event.description && (
                    <p className="text-gray-500">{event.description}</p>
                  )}
                </div>
              </div>
              
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getEventColor(event) }}
              />
            </div>
          </div>
        ))}
        
        {dayEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events scheduled for this day
          </div>
        )}
      </div>
    );
  };

  const renderAgendaView = () => {
    if (!calendarView) return null;

    const sortedEvents = calendarView.events.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return (
      <div className="space-y-4">
        {sortedEvents.map(event => (
          <div
            key={event.id}
            className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onEventClick(event)}
          >
            <div className="flex-shrink-0 w-20 text-center">
              <div className="text-sm font-medium">
                {new Date(event.start_time).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(event.start_time).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{event.title}</h3>
                <Badge className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                )}
                
                {event.description && (
                  <p className="text-gray-500">{event.description}</p>
                )}
              </div>
            </div>
            
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: getEventColor(event) }}
            />
          </div>
        ))}
        
        {sortedEvents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events in this time period
          </div>
        )}
      </div>
    );
  };

  const renderView = () => {
    switch (viewType) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-lg font-semibold">
            {formatDate(currentDate, viewType === 'month' ? 'month' : 'long')}
          </div>
          
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewType === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('day')}
          >
            Day
          </Button>
          <Button
            variant={viewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('week')}
          >
            Week
          </Button>
          <Button
            variant={viewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('month')}
          >
            Month
          </Button>
          <Button
            variant={viewType === 'agenda' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('agenda')}
          >
            Agenda
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="border rounded-lg p-4">
        {renderView()}
      </div>
    </div>
  );
} 