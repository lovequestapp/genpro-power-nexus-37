import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const orders = [
  { id: 1, orderNumber: 'ORD-1001', item: 'Generac 22KW', status: 'Shipped', date: '2024-06-01' },
  { id: 2, orderNumber: 'ORD-1002', item: 'Battery', status: 'Processing', date: '2024-06-03' },
  { id: 3, orderNumber: 'ORD-1003', item: 'Transfer Switch', status: 'Delivered', date: '2024-06-05' },
];

export default function InventoryOrders() {
  return (
    <Card className="p-6 bg-card border border-border text-card-foreground">
      <h1 className="text-2xl font-bold mb-4">Orders Inventory</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.orderNumber}</TableCell>
              <TableCell>{order.item}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 