import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const parts = [
  { id: 1, name: 'Starter Motor', status: 'In Stock', location: 'Warehouse 1' },
  { id: 2, name: 'Battery', status: 'Low Stock', location: 'Warehouse 2' },
  { id: 3, name: 'Transfer Switch', status: 'In Stock', location: 'Warehouse 1' },
];

export default function InventoryParts() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Parts Inventory</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Part Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.map((part) => (
            <TableRow key={part.id}>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.status}</TableCell>
              <TableCell>{part.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 