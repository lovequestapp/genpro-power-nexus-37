import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import SEO from '../../components/SEO';

type Appointment = {
  id: string;
  title: string;
  type: 'installation' | 'maintenance' | 'repair' | 'survey';
  date: Date;
  customer: string;
  address: string;
  technicians: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
};

export default function SchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Generator Installation',
      type: 'installation',
      date: new Date(),
      customer: 'John & Sarah Miller',
      address: '1234 Oak Street, Houston, TX',
      technicians: ['Mike Johnson', 'David Chen'],
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Maintenance Check',
      type: 'maintenance',
      date: new Date(Date.now() + 86400000), // Tomorrow
      customer: 'Robert Wilson',
      address: '567 Pine Road, Houston, TX',
      technicians: ['Alex Thompson'],
      status: 'scheduled',
    },
  ];

  const appointmentsForDate = (date: Date) => {
    return appointments.filter(
      (apt) => apt.date.toDateString() === date.toDateString()
    );
  };

  return (
    <>
      <SEO title="Admin Schedule | HOU GEN PROS" description="Admin dashboard schedule page." canonical="/admin/schedule" pageType="website" keywords="admin, schedule, dashboard" schema={null} />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Schedule</h1>
          <div className="flex items-center gap-4">
            <Select value={view} onValueChange={(v: 'day' | 'week' | 'month') => setView(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                </DialogHeader>
                {/* Add appointment form will go here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Calendar */}
          <div className="bg-card rounded-lg border border-border p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="rounded-md"
            />
          </div>

          {/* Appointments for selected date */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Appointments for {date.toLocaleDateString()}
              </h2>
              <Badge variant="outline">
                {appointmentsForDate(date).length} appointments
              </Badge>
            </div>

            <div className="space-y-4">
              {appointmentsForDate(date).map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-background/50 rounded-lg p-4 border border-border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{appointment.title}</h3>
                    <Badge variant={
                      appointment.status === 'completed' ? 'default' :
                      appointment.status === 'in-progress' ? 'secondary' :
                      appointment.status === 'cancelled' ? 'destructive' :
                      'outline'
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Customer: {appointment.customer}</p>
                    <p>Address: {appointment.address}</p>
                    <p>Technicians: {appointment.technicians.join(', ')}</p>
                    <p>Type: {appointment.type}</p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}

              {appointmentsForDate(date).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 