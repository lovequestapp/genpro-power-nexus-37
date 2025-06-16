import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 