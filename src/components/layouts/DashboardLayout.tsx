import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Boxes,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Bell,
  Search,
  Menu,
  X,
  Calculator,
  Headphones,
  UserCircle,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  submenu?: NavItem[];
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin',
    },
    {
      title: 'Projects',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/projects',
    },
    {
      title: 'Customers',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/customers',
      badge: 3,
    },
    {
      title: 'Inventory',
      icon: <Boxes className="w-5 h-5" />,
      path: '/admin/inventory',
      submenu: [
        { title: 'Generators', icon: <ChevronDown className="w-4 h-4" />, path: '/admin/inventory/generators' },
        { title: 'Parts', icon: <ChevronDown className="w-4 h-4" />, path: '/admin/inventory/parts' },
        { title: 'Orders', icon: <ChevronDown className="w-4 h-4" />, path: '/admin/inventory/orders' },
      ],
    },
    {
      title: 'Schedule',
      icon: <Calendar className="w-5 h-5" />,
      path: '/admin/schedule',
    },
    {
      title: 'Stripe',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/admin/stripe',
    },
    {
      title: 'Invoice Templates',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/invoice-templates',
    },
    {
      title: 'Support',
      icon: <Headphones className="w-5 h-5" />,
      path: '/admin/support',
    },
    {
      title: 'Team',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/team',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings',
    },
  ];

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setActiveSubmenu(activeSubmenu === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-background border rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[80px]" : "w-[280px]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!isCollapsed && (
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">HGP</span>
              <span className="text-lg font-semibold">Admin</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:flex hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-background"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1 p-2">
          {navItems.map((item) => (
            <div key={item.title}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.path && "bg-accent text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
                onClick={() => item.submenu && toggleSubmenu(item.title)}
              >
                {item.icon}
                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                    {item.submenu && (
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          activeSubmenu === item.title && "transform rotate-180"
                        )}
                      />
                    )}
                  </div>
                )}
              </Link>
              {!isCollapsed && item.submenu && activeSubmenu === item.title && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.path}
                      to={subitem.path}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        location.pathname === subitem.path && "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      <div className="w-1 h-1 rounded-full bg-current" />
                      <span>{subitem.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center space-x-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/avatars/admin.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@hougenpros.com</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"
        )}
      >
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Welcome back, Admin</h1>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </Button>
              {isCollapsed && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/avatars/admin.png" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
