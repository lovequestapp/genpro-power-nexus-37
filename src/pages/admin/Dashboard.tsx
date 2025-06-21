import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert as MuiAlert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid as MuiGrid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccountBalanceWallet,
  Assignment,
  Group,
  Settings as SettingsIcon,
  SupportAgent,
  Sync,
  Notifications,
  Person,
  Brightness4 as SunIcon,
  Brightness7 as MoonIcon,
  Download as DownloadIcon,
  Mail as MailIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as DollarSignIcon,
  Build as WrenchIcon,
  Inventory as PackageIcon,
  People as UsersIcon,
  CreditCard,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { supabaseService } from '@/services/supabase';
import { Generator, Customer, Service, Bill, Alert } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCircuitBackground from '@/components/AnimatedCircuitBackground';
import {
  CircleIcon,
  BarChart3Icon,
  CalendarIcon,
  AlertCircleIcon,
  ClipboardListIcon,
  TruckIcon,
  StarIcon,
  UserCheckIcon,
  MapPinIcon,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Calendar,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardStats, Project as DashboardProject } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { UserIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const sidebarItems = [
  { label: 'Overview', icon: AccountBalanceWallet },
  { label: 'Stripe', icon: CreditCard },
  { label: 'Projects', icon: Assignment },
  { label: 'Support', icon: SupportAgent },
  { label: 'Team', icon: Group },
  { label: 'Settings', icon: SettingsIcon },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  onClick?: () => void;
  clickable?: boolean;
}

interface LocalProject {
  id: string;
  title: string;
  customer: string;
  status: 'in-progress' | 'pending' | 'completed';
  progress: number;
  dueDate: string;
  address: string;
  technicians: string[];
}

const StatCard = ({ title, value, change, icon, trend, subtitle, onClick, clickable = false }: StatCardProps) => {
  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-steel-500 p-2 sm:p-3 rounded-lg bg-slate-50">{icon}</div>
        {typeof change !== 'undefined' && (
          <div
            className={`flex items-center ${
              trend === 'up'
                ? 'text-green-500'
                : trend === 'down'
                ? 'text-red-500'
                : 'text-steel-500'
            }`}
          >
            <span className="text-xs sm:text-sm font-medium">
              {change >= 0 ? '+' : ''}
              {change}%
            </span>
            {trend === 'up' ? (
              <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            ) : trend === 'down' ? (
              <TrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            ) : (
              <CircleIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-steel-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-xs sm:text-sm text-steel-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-steel-400">{subtitle}</p>
        )}
      </div>
    </>
  );

  if (clickable && onClick) {
    return (
      <Card 
        className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-lg border-none text-steel-900 hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-slate-50 relative group"
        onClick={onClick}
      >
        {cardContent}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-steel-400" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-lg border-none text-steel-900 hover:shadow-xl transition-shadow">
      {cardContent}
    </Card>
  );
};

const ProjectCard = ({ project }: { project: LocalProject }) => {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
  };

  return (
    <Card className="p-4 sm:p-6 lg:p-8 bg-white rounded-xl shadow-lg border-none text-steel-900 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-steel-900 text-sm sm:text-base truncate">
            {project.title}
          </h3>
          <p className="text-xs sm:text-sm text-steel-500 truncate">{project.customer}</p>
          <div className="flex items-center gap-1 text-xs text-steel-400 mt-1">
            <MapPinIcon className="w-3 h-3" />
            <span className="truncate">{project.address}</span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
            statusColors[project.status]
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-steel-500">Progress</span>
          <span className="font-medium text-steel-700">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm mt-3 sm:mt-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-steel-400" />
            <span className="text-steel-500">Due: {project.dueDate}</span>
          </div>
          <div className="flex -space-x-1 sm:-space-x-2">
            {project.technicians.slice(0, 3).map((tech, index) => (
              <div
                key={index}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent ring-2 ring-white"
                title={tech}
              >
                {tech.charAt(0)}
              </div>
            ))}
            {project.technicians.length > 3 && (
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 ring-2 ring-white">
                +{project.technicians.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Add new interfaces for HGP-specific features
interface HGPStats {
  totalGenerators: number;
  activeProjects: number;
  pendingMaintenance: number;
  revenueThisMonth: number;
  customerSatisfaction: number;
}

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock Stripe data
const stripeMock = {
  revenue: 154320,
  revenueChange: 8.2,
  revenueTrend: 'up',
  customers: 312,
  payouts: [
    { id: 'po_1', amount: 12000, date: '2024-07-10' },
    { id: 'po_2', amount: 8000, date: '2024-07-03' },
  ],
  transactions: [
    { id: 'txn_1', customer: 'Sarah Johnson', amount: 1200, status: 'succeeded', date: '2024-07-09' },
    { id: 'txn_2', customer: 'Michael Chen', amount: 3500, status: 'pending', date: '2024-07-08' },
    { id: 'txn_3', customer: 'Emily Rodriguez', amount: 2000, status: 'refunded', date: '2024-07-07' },
    { id: 'txn_4', customer: 'David Lee', amount: 500, status: 'succeeded', date: '2024-07-06' },
  ],
  refunds: 2,
  disputes: 1,
  revenueChart: [
    { date: 'Jun 10', revenue: 3200 },
    { date: 'Jun 15', revenue: 4200 },
    { date: 'Jun 20', revenue: 5100 },
    { date: 'Jun 25', revenue: 6100 },
    { date: 'Jul 1', revenue: 7200 },
    { date: 'Jul 5', revenue: 8300 },
    { date: 'Jul 10', revenue: 9000 },
  ],
};

function StripeCard({ title, value, icon, trend, change, subtitle, color }) {
  return (
    <div className={`rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg flex flex-col gap-2 min-w-[150px] sm:min-w-[180px] relative overflow-hidden`}> 
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${color}-100 to-${color}-200 shadow-lg`}>{icon}</div>
        <span className="text-sm sm:text-lg font-bold text-gray-900">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value}</span>
        {trend && (
          <span className={`flex items-center gap-1 text-xs sm:text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}{change}%</span>
        )}
      </div>
      {subtitle && <span className="text-xs text-gray-500 mt-1">{subtitle}</span>}
      <div className={`absolute right-0 bottom-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-${color}-200/30 to-transparent rounded-full blur-2xl`} />
    </div>
  );
}

function StripeDashboard() {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
      <StripeCard
        title="Total Revenue"
        value={`$${stripeMock.revenue.toLocaleString()}`}
        icon={<DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />}
        trend={stripeMock.revenueTrend}
        change={stripeMock.revenueChange}
        color="green"
        subtitle="Last 30 days"
      />
      <StripeCard
        title="Active Customers"
        value={stripeMock.customers}
        icon={<Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />}
        trend={null}
        change={null}
        color="blue"
        subtitle="All time"
      />
      <StripeCard
        title="Upcoming Payout"
        value={`$${stripeMock.payouts[0].amount.toLocaleString()}`}
        icon={<CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />}
        trend={null}
        change={null}
        color="purple"
        subtitle={`On ${stripeMock.payouts[0].date}`}
      />
      <StripeCard
        title="Refunds/Disputes"
        value={`${stripeMock.refunds} / ${stripeMock.disputes}`}
        icon={<AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />}
        trend={null}
        change={null}
        color="red"
        subtitle="This month"
      />
    </div>
  );
}

function StripeRevenueChart() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-6 sm:mb-10">
      <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" /> Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={200} className="sm:h-[220px]">
        <LineChart data={stripeMock.revenueChart}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StripeTransactions() {
  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-6 sm:mb-10">
      <h3 className="text-base sm:text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" /> Recent Transactions</h3>
      <div className="divide-y divide-gray-200">
        {stripeMock.transactions.map(txn => (
          <div key={txn.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2 sm:gap-0">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm truncate">{txn.customer}</div>
              <div className="text-xs text-gray-500">{txn.date}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-bold text-xs sm:text-sm ${txn.status === 'succeeded' ? 'text-green-600' : txn.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{txn.status}</span>
              <span className="font-semibold text-gray-900 text-sm">${txn.amount.toLocaleString()}</span>
              <button className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition-all flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard: Component rendering...');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("30");
  const [stats, setStats] = useState<DashboardStats>({
    revenue: { total: 0, change: 0, trend: 'neutral' },
    projects: { total: 0, active: 0, completed: 0, change: 0 },
    inventory: { total: 0, lowStock: 0, value: 0, change: 0 },
    leads: { total: 0, new: 0, converted: 0, change: 0 },
    technicians: { total: 0, available: 0, assigned: 0 },
    customerSatisfaction: { rating: 0, responses: 0, change: 0 }
  });
  const [recentProjects, setRecentProjects] = useState<LocalProject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  console.log('AdminDashboard: State initialized, loading =', loading);

  // Navigation handlers
  const navigateToProjects = () => {
    window.location.href = '/admin/projects';
  };

  const navigateToCustomers = () => {
    window.location.href = '/admin/customers';
  };

  const navigateToGenerators = () => {
    window.location.href = '/admin/generators';
  };

  const navigateToRevenue = () => {
    // For now, navigate to projects since revenue is calculated from projects
    window.location.href = '/admin/projects';
  };

  const navigateToProject = (projectId: string) => {
    window.location.href = `/admin/projects/${projectId}`;
  };

  // Fetch dashboard data
  useEffect(() => {
    console.log('AdminDashboard: useEffect running...');
    
    const fetchDashboardData = async () => {
      try {
        console.log('AdminDashboard: Fetching dashboard data...');
        
        // Fetch projects
        console.log('Fetching projects...');
        const projects = await supabaseService.getProjects();
        console.log('Projects fetched:', projects?.length || 0, projects);
        
        // Fetch customers
        console.log('Fetching customers...');
        const customers = await supabaseService.getCustomers();
        console.log('Customers fetched:', customers?.length || 0, customers);
        
        // Fetch generators
        console.log('Fetching generators...');
        const generators = await supabaseService.getGenerators();
        console.log('Generators fetched:', generators?.length || 0, generators);
        
        // Calculate stats
        const activeProjects = projects?.filter(p => p.status === 'in_progress').length || 0;
        const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
        const activeCustomers = customers?.filter(c => c.status === 'active').length || 0;
        
        console.log('Calculated stats:', {
          totalProjects: projects?.length || 0,
          activeProjects,
          completedProjects,
          totalCustomers: customers?.length || 0,
          activeCustomers,
          totalGenerators: generators?.length || 0
        });
        
        setStats({
          revenue: { 
            total: 154320, 
            change: 8.2, 
            trend: 'up' 
          },
          projects: { 
            total: projects?.length || 0, 
            active: activeProjects, 
            completed: completedProjects, 
            change: 12 
          },
          inventory: { 
            total: generators?.length || 0, 
            lowStock: 3, 
            value: 45000, 
            change: -2.1 
          },
          leads: { 
            total: customers?.length || 0, 
            new: 5, 
            converted: 3, 
            change: 15 
          },
          technicians: { 
            total: 8, 
            available: 5, 
            assigned: 3 
          },
          customerSatisfaction: { 
            rating: 4.8, 
            responses: 24, 
            change: 0.2 
          }
        });
        
        // Set recent projects
        const recent = await Promise.all(
          (projects?.slice(0, 5) || []).map(async (p) => {
            try {
              // Calculate real progress from milestones
              const progress = await supabaseService.calculateProjectProgress(p.id);
              
              // Map project status to LocalProject status
              let mappedStatus: 'in-progress' | 'pending' | 'completed';
              if (p.status === 'in_progress') mappedStatus = 'in-progress';
              else if (p.status === 'completed') mappedStatus = 'completed';
              else mappedStatus = 'pending';
              
              return {
                id: p.id,
                title: p.name,
                customer: p.owner_name || 'Unassigned',
                status: mappedStatus,
                progress: progress.overall_progress,
                dueDate: p.created_at || '2024-07-15',
                address: p.address || 'No address',
                technicians: p.technicians || []
              };
            } catch (error) {
              console.error('Error calculating progress for project:', p.id, error);
              // Fallback to status-based progress
              let fallbackProgress = 0;
              let mappedStatus: 'in-progress' | 'pending' | 'completed';
              
              if (p.status === 'completed') {
                fallbackProgress = 100;
                mappedStatus = 'completed';
              } else if (p.status === 'in_progress') {
                fallbackProgress = 50;
                mappedStatus = 'in-progress';
              } else {
                fallbackProgress = 10;
                mappedStatus = 'pending';
              }
              
              return {
                id: p.id,
                title: p.name,
                customer: p.owner_name || 'Unassigned',
                status: mappedStatus,
                progress: fallbackProgress,
                dueDate: p.created_at || '2024-07-15',
                address: p.address || 'No address',
                technicians: p.technicians || []
              };
            }
          })
        );
        
        setRecentProjects(recent);
        
        // Mock notifications
        setNotifications([
          {
            id: '1',
            type: 'info',
            message: 'New project "Generator Installation" has been assigned',
            timestamp: new Date(),
            read: false
          },
          {
            id: '2',
            type: 'warning',
            message: 'Maintenance due for Generator #G-001 in 3 days',
            timestamp: new Date(Date.now() - 3600000),
            read: false
          },
          {
            id: '3',
            type: 'success',
            message: 'Project "Emergency Backup System" completed successfully',
            timestamp: new Date(Date.now() - 7200000),
            read: true
          }
        ]);
        
        console.log('AdminDashboard: Data fetched successfully');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    console.log('AdminDashboard: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Loading Admin Dashboard...</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">Please wait while we load your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <ErrorIcon className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Error Loading Dashboard</h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

  console.log('AdminDashboard: Rendering main dashboard');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1 sm:mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <Button
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">↻</span>
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/projects/new"
              className="text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.total.toLocaleString()}`}
            change={stats.revenue.change}
            icon={<DollarSignIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
            trend={stats.revenue.trend}
            subtitle="This month"
            onClick={navigateToRevenue}
            clickable
          />
          <StatCard
            title="Active Projects"
            value={stats.projects.active}
            change={stats.projects.change}
            icon={<Assignment className="w-4 h-4 sm:w-6 sm:h-6" />}
            trend="up"
            subtitle={`${stats.projects.total} total`}
            onClick={navigateToProjects}
            clickable
          />
          <StatCard
            title="Customers"
            value={stats.leads.total}
            change={stats.leads.change}
            icon={<Group className="w-4 h-4 sm:w-6 sm:h-6" />}
            trend="up"
            subtitle={`${stats.leads.new} new this month`}
            onClick={navigateToCustomers}
            clickable
          />
          <StatCard
            title="Generators"
            value={stats.inventory.total}
            change={stats.inventory.change}
            icon={<WrenchIcon className="w-4 h-4 sm:w-6 sm:h-6" />}
            trend="neutral"
            subtitle={`${stats.inventory.lowStock} need maintenance`}
            onClick={navigateToGenerators}
            clickable
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <Card className="p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Revenue Trend</h3>
                <FormControl size="small" className="w-full sm:w-32">
                  <Select
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="7">7 days</MenuItem>
                    <MenuItem value="30">30 days</MenuItem>
                    <MenuItem value="90">90 days</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                <LineChart data={[
                  { date: 'Jun 10', revenue: 3200 },
                  { date: 'Jun 15', revenue: 4200 },
                  { date: 'Jun 20', revenue: 5100 },
                  { date: 'Jun 25', revenue: 6100 },
                  { date: 'Jul 1', revenue: 7200 },
                  { date: 'Jul 5', revenue: 8300 },
                  { date: 'Jul 10', revenue: 9000 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Recent Projects */}
          <div>
            <Card className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">Recent Projects</h3>
                <Button
                  variant="text"
                  size="small"
                  component={Link}
                  to="/admin/projects"
                  className="text-xs sm:text-sm"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors gap-2 sm:gap-0"
                    onClick={() => navigateToProject(project.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{project.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 truncate">{project.customer}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={project.progress} className="w-12 sm:w-16 h-2" />
                        <span className="text-xs text-slate-500">{project.progress}%</span>
                      </div>
                    </div>
                    <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Notifications and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Notifications */}
          <Card className="p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Recent Notifications</h3>
            <div className="space-y-2 sm:space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${
                  notification.read ? 'bg-slate-50' : 'bg-blue-50'
                }`}>
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-800">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {notification.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-3 sm:p-4 lg:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<AddIcon />}
                component={Link}
                to="/admin/projects/new"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New Project</span>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<Person />}
                component={Link}
                to="/admin/customers/new"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add Customer</span>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<WrenchIcon />}
                component={Link}
                to="/admin/generators/new"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Add Generator</span>
                <span className="sm:hidden">Add Generator</span>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<SettingsIcon />}
                component={Link}
                to="/admin/settings"
                className="text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
