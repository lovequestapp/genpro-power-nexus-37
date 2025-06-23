import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Menu } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { GlobalSearch } from '@/components/GlobalSearch';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:flex bg-white shadow-sm items-center justify-between p-4 sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <GlobalSearch />
          </div>
          <UserMenu />
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm flex items-center justify-between p-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch className="w-48" />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
