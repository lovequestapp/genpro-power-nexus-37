import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const activeProjects = [
  { id: 1, title: 'Generac 22KW Installation', customer: 'John & Sarah Miller', status: 'In Progress', dueDate: 'Jun 15, 2024' },
  { id: 2, title: 'Maintenance Check', customer: 'Robert Wilson', status: 'Pending', dueDate: 'Jun 18, 2024' },
  { id: 3, title: 'Emergency Repair', customer: 'Emily Thompson', status: 'Completed', dueDate: 'Jun 10, 2024' },
];

export default function ProjectsActive() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Active Projects</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.customer}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{project.dueDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 