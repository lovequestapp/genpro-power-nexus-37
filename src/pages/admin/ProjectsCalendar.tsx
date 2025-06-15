import React from 'react';
import { Card } from '@/components/ui/card';

const upcomingProjects = [
  { id: 1, title: 'Generac 22KW Installation', dueDate: 'Jun 15, 2024' },
  { id: 2, title: 'Maintenance Check', dueDate: 'Jun 18, 2024' },
  { id: 3, title: 'Emergency Repair', dueDate: 'Jun 10, 2024' },
];

export default function ProjectsCalendar() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Project Calendar</h1>
      <div className="mb-6">[Calendar Component Coming Soon]</div>
      <h2 className="text-xl font-semibold mb-2">Upcoming Deadlines</h2>
      <ul className="list-disc pl-6">
        {upcomingProjects.map((project) => (
          <li key={project.id} className="mb-1">{project.title} - <span className="font-medium">{project.dueDate}</span></li>
        ))}
      </ul>
    </Card>
  );
} 