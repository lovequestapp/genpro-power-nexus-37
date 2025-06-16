import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProjectsCompleted() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Completed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display all completed projects. (Placeholder)</p>
        </CardContent>
      </Card>
    </div>
  );
} 