import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const generators = [
  { id: 1, model: 'Generac 22KW', status: 'In Stock', location: 'Warehouse 1' },
  { id: 2, model: 'Generac 16KW', status: 'Low Stock', location: 'Warehouse 2' },
  { id: 3, model: 'Generac 10KW', status: 'Out of Stock', location: 'Warehouse 1' },
];

export default function InventoryGenerators() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Generators Inventory</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {generators.map((gen) => (
            <TableRow key={gen.id}>
              <TableCell>{gen.model}</TableCell>
              <TableCell>{gen.status}</TableCell>
              <TableCell>{gen.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 