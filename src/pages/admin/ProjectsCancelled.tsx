import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProjectsCancelled() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cancelled Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display all cancelled projects. (Placeholder)</p>
        </CardContent>
      </Card>
    </div>
  );
} 