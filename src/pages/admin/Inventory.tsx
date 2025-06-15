import React from 'react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function Inventory() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Overview</h1>
      <ul className="list-disc pl-6">
        <li className="mb-2"><Link to="/admin/inventory/generators" className="text-accent hover:underline">Generators</Link></li>
        <li className="mb-2"><Link to="/admin/inventory/parts" className="text-accent hover:underline">Parts</Link></li>
        <li className="mb-2"><Link to="/admin/inventory/orders" className="text-accent hover:underline">Orders</Link></li>
      </ul>
    </Card>
  );
} 