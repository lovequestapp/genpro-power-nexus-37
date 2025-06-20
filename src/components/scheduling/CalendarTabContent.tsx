
import React from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';
import type { ScheduleEvent } from '@/types/scheduling';

interface CalendarTabContentProps {
  handleEditEvent: (event: ScheduleEvent) => void;
  handleCreateEvent: () => void;
}

export function CalendarTabContent({ handleEditEvent, handleCreateEvent }: CalendarTabContentProps) {
  return (
    <div className="space-y-4">
      <ScheduleCalendar 
        onEventClick={handleEditEvent}
        onDateClick={handleCreateEvent}
      />
    </div>
  );
}
