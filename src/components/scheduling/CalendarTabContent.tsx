import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleCalendar } from '@/components/scheduling/ScheduleCalendar';
import type { ScheduleEvent } from '@/types/scheduling';

interface CalendarTabContentProps {
  handleEditEvent: (event: ScheduleEvent) => void;
  handleCreateEvent: () => void;
}

export const CalendarTabContent: React.FC<CalendarTabContentProps> = ({ handleEditEvent, handleCreateEvent }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
        <CardDescription>
          View and manage your schedule in a calendar format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScheduleCalendar onEventClick={handleEditEvent} onDateClick={handleCreateEvent} />
      </CardContent>
    </Card>
  );
}; 