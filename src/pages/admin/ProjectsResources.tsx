import React from 'react';
import { Card } from '@/components/ui/card';

const resources = [
  { id: 1, name: 'Installation Guide', link: '#' },
  { id: 2, name: 'Maintenance Checklist', link: '#' },
  { id: 3, name: 'Warranty Information', link: '#' },
];

export default function ProjectsResources() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Project Resources</h1>
      <ul className="list-disc pl-6">
        {resources.map((res) => (
          <li key={res.id} className="mb-2">
            <a href={res.link} className="text-accent hover:underline">{res.name}</a>
          </li>
        ))}
      </ul>
    </Card>
  );
} 