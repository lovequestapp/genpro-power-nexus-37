
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
  X,
  LogOut,
  Mail,
  BarChart3,
  Cloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { useAuth } from '@/contexts/AuthContext';

const adminNav = [
  { label: 'Dashboard', icon: <LayoutDashboard />, to: '/admin/dashboard' },
  { label: 'Customers', icon: <Users />, to: '/admin/customers' },
  { label: 'Projects', icon: <ClipboardList />, to: '/admin/projects' },
  { label: 'Inventory', icon: <Package />, to: '/admin/inventory' },
  { label: 'Forms', icon: <FileText />, to: '/admin/forms' },
  { label: 'Billing', icon: <DollarSign />, to: '/admin/billing' },
  { label: 'Orders', icon: <FileText />, to: '/admin/inventory/orders' },
  { label: 'Stripe', icon: <CreditCard />, to: '/admin/stripe' },
  { label: 'Schedule', icon: <Calendar />, to: '/admin/schedule' },
  { label: 'Weather', icon: <Cloud />, to: '/admin/weather' },
  { label: 'Support', icon: <LifeBuoy />, to: '/admin/support' },
  { label: 'Analytics', icon: <BarChart3 />, to: '/admin/analytics' },
  { label: 'Email', icon: <Mail />, to: '/admin/email' },
  { label: 'Parts', icon: <Wrench />, to: '/admin/inventory/parts' },
  { label: 'Team', icon: <Users />, to: '/admin/team' },
  { label: 'Settings', icon: <Settings />, to: '/admin/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  
  return (
    <>
      <aside className={cn(
        "fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-64 bg-white h-screen p-4 flex flex-col transition-transform duration-300 ease-in-out",
        "border-r border-gray-200",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-2 mb-6">
          <Link to="/admin">
            <Logo />
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1">
            {adminNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.to || (item.to !== '/admin/dashboard' && location.pathname.startsWith(item.to))
                      ? 'bg-orange-50 text-orange-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {React.cloneElement(item.icon, { className: 'w-5 h-5 mr-3' })}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => {
              signOut();
              onClose();
            }}
            className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />}
    </>
  );
} 
