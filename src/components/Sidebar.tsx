import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  Wrench,
  Settings,
  LifeBuoy,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
} from 'lucide-react';

const adminNav = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, to: '/admin' },
  { label: 'Customers', icon: <Users className="w-5 h-5" />, to: '/admin/customers' },
  { label: 'Projects', icon: <ClipboardList className="w-5 h-5" />, to: '/admin/projects' },
  { label: 'Inventory', icon: <Package className="w-5 h-5" />, to: '/admin/inventory' },
  { label: 'Parts', icon: <Wrench className="w-5 h-5" />, to: '/admin/inventory/parts' },
  { label: 'Orders', icon: <FileText className="w-5 h-5" />, to: '/admin/inventory/orders' },
  { label: 'Billing', icon: <DollarSign className="w-5 h-5" />, to: '/admin/billing' },
  { label: 'Schedule', icon: <Calendar className="w-5 h-5" />, to: '/admin/schedule' },
  { label: 'Stripe', icon: <CreditCard className="w-5 h-5" />, to: '/admin/stripe' },
  { label: 'Support', icon: <LifeBuoy className="w-5 h-5" />, to: '/admin/support' },
  { label: 'Team', icon: <Users className="w-5 h-5" />, to: '/admin/team' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, to: '/admin/settings' },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <aside className="w-64 bg-white h-screen p-6 border-r shadow-lg flex flex-col">
      <div className="mb-8">
        <Link to="/admin" className="flex items-center space-x-3 mb-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">HGP</span>
          <span className="text-lg font-semibold text-steel-900">Admin</span>
        </Link>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {adminNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors font-medium text-steel-700 hover:bg-accent/10 hover:text-accent ${location.pathname === item.to ? 'bg-accent/20 text-accent font-bold' : ''}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 
