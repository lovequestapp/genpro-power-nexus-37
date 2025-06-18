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
} from '@mui/icons-material';
import { generatorService, customerService, supportService, billingService, alertService } from '@/services/api';
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
}

interface LocalProject {
  title: string;
  customer: string;
  status: 'in-progress' | 'pending' | 'completed';
  progress: number;
  dueDate: string;
  address: string;
  technicians: string[];
}

const StatCard = ({ title, value, change, icon, trend, subtitle }: StatCardProps) => {
  return (
    <Card className="p-8 bg-white rounded-xl shadow-lg border-none text-steel-900 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="text-steel-500">{icon}</div>
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
            <span className="text-sm font-medium">
              {change >= 0 ? '+' : ''}
              {change}%
            </span>
            {trend === 'up' ? (
              <TrendingUpIcon className="w-4 h-4 ml-1" />
            ) : trend === 'down' ? (
              <TrendingDownIcon className="w-4 h-4 ml-1" />
            ) : (
              <CircleIcon className="w-4 h-4 ml-1" />
            )}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-steel-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm text-steel-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-steel-400">{subtitle}</p>
        )}
      </div>
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
    <Card className="p-8 bg-white rounded-xl shadow-lg border-none text-steel-900 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-steel-900">
            {project.title}
          </h3>
          <p className="text-sm text-steel-500">{project.customer}</p>
          <div className="flex items-center gap-1 text-xs text-steel-400 mt-1">
            <MapPinIcon className="w-3 h-3" />
            {project.address}
          </div>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusColors[project.status]
          }`}
        >
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-steel-500">Progress</span>
          <span className="font-medium text-steel-700">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-2" />
        <div className="flex justify-between items-center text-sm mt-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-steel-400" />
            <span className="text-steel-500">Due: {project.dueDate}</span>
          </div>
          <div className="flex -space-x-2">
            {project.technicians.map((tech, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium text-accent ring-2 ring-white"
                title={tech}
              >
                {tech.charAt(0)}
              </div>
            ))}
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
    <div className={`rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg flex flex-col gap-2 min-w-[180px] relative overflow-hidden`}> 
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-3 rounded-full bg-gradient-to-br from-${color}-100 to-${color}-200 shadow-lg`}>{icon}</div>
        <span className="text-lg font-bold text-gray-900">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        {trend && (
          <span className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}{change}%</span>
        )}
      </div>
      {subtitle && <span className="text-xs text-gray-500 mt-1">{subtitle}</span>}
      <div className={`absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br from-${color}-200/30 to-transparent rounded-full blur-2xl`} />
    </div>
  );
}

function StripeDashboard() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StripeCard
        title="Total Revenue"
        value={`$${stripeMock.revenue.toLocaleString()}`}
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
        trend={stripeMock.revenueTrend}
        change={stripeMock.revenueChange}
        color="green"
        subtitle="Last 30 days"
      />
      <StripeCard
        title="Active Customers"
        value={stripeMock.customers}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        trend={null}
        change={null}
        color="blue"
        subtitle="All time"
      />
      <StripeCard
        title="Upcoming Payout"
        value={`$${stripeMock.payouts[0].amount.toLocaleString()}`}
        icon={<CreditCard className="w-6 h-6 text-purple-600" />}
        trend={null}
        change={null}
        color="purple"
        subtitle={`On ${stripeMock.payouts[0].date}`}
      />
      <StripeCard
        title="Refunds/Disputes"
        value={`${stripeMock.refunds} / ${stripeMock.disputes}`}
        icon={<AlertCircle className="w-6 h-6 text-red-600" />}
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
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-10">
      <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={stripeMock.revenueChart}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StripeTransactions() {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-10">
      <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /> Recent Transactions</h3>
      <div className="divide-y divide-gray-200">
        {stripeMock.transactions.map(txn => (
          <div key={txn.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-semibold text-gray-900">{txn.customer}</div>
              <div className="text-xs text-gray-500">{txn.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${txn.status === 'succeeded' ? 'text-green-600' : txn.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{txn.status}</span>
              <span className="font-semibold text-gray-900">${txn.amount.toLocaleString()}</span>
              <button className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition-all flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<Service[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Dialog states
  const [openGeneratorDialog, setOpenGeneratorDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);

  // Editing states
  const [editingGenerator, setEditingGenerator] = useState<Generator | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingTicket, setEditingTicket] = useState<Service | null>(null);

  const [darkMode, setDarkMode] = useState(false);
  const themeClass = darkMode ? 'dark' : 'light';

  const mockAlerts = [
    {
      id: 1,
      type: 'inventory',
      message: 'Low stock alert for Generac 22KW',
      severity: 'warning',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'maintenance',
      message: 'Scheduled maintenance due for 3 generators',
      severity: 'info',
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      type: 'service',
      message: 'New service request from John Smith',
      severity: 'info',
      timestamp: new Date().toISOString(),
    }
  ];

  const projects: LocalProject[] = [
    {
      title: 'Generac 22KW Installation',
      customer: 'John & Sarah Miller',
      status: 'in-progress',
      progress: 65,
      dueDate: 'Jun 15, 2024',
      address: '123 Main St, Houston, TX',
      technicians: ['Mike Johnson', 'David Chen'],
    },
    {
      title: 'Maintenance Check',
      customer: 'Robert Wilson',
      status: 'pending',
      progress: 0,
      dueDate: 'Jun 18, 2024',
      address: '456 Oak Ave, Houston, TX',
      technicians: ['Sarah Williams'],
    },
    {
      title: 'Emergency Repair',
      customer: 'Emily Thompson',
      status: 'completed',
      progress: 100,
      dueDate: 'Jun 10, 2024',
      address: '789 Pine St, Houston, TX',
      technicians: ['David Brown', 'Lisa Davis'],
    },
  ];

  const [hgpStats, setHGPStats] = useState<HGPStats>({
    totalGenerators: 0,
    activeProjects: 0,
    pendingMaintenance: 0,
    revenueThisMonth: 0,
    customerSatisfaction: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Enhanced error handling
  const handleError = useCallback((error: any) => {
    console.error('Dashboard Error:', error);
    setError(error.message || 'An unexpected error occurred');
    // Add error to notifications
    setNotifications(prev => [{
      id: Date.now().toString(),
      type: 'error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date(),
      read: false
    }, ...prev]);
  }, []);

  // Real-time data fetching with retry logic
  const fetchData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const [
        generatorsData,
        customersData,
        ticketsData,
        billsData,
        alertsData,
        statsData
      ] = await Promise.all([
        generatorService.getAll(),
        customerService.getAll(),
        supportService.getAll(),
        billingService.getAll(),
        alertService.getAll(),
        generatorService.getStatus('all') // Using existing getStatus method for stats
      ]);

      setGenerators(generatorsData.data);
      setCustomers(customersData.data);
      setTickets(ticketsData.data);
      setBills(billsData.data);
      setAlerts(alertsData.data);
      setHGPStats({
        totalGenerators: generatorsData.data.length,
        activeProjects: ticketsData.data.filter(t => t.status === 'in_progress').length,
        pendingMaintenance: generatorsData.data.filter(g => g.status === 'maintenance').length,
        revenueThisMonth: billsData.data.reduce((sum, bill) => sum + bill.amount, 0),
        customerSatisfaction: 95 // Placeholder - should be calculated from customer feedback
      });
      setError(null);
    } catch (error) {
      handleError(error);
      // Retry logic
      if (retryCount < 3) {
        setTimeout(() => fetchData(retryCount + 1), 5000);
      }
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enhanced save handlers with validation
  const handleSaveGenerator = async (generatorData: Partial<Generator>) => {
    try {
      // Validate required fields
      if (!generatorData.model || !generatorData.name) {
        throw new Error('Model and Name are required');
      }

      const savedGenerator = editingGenerator
        ? await generatorService.update(editingGenerator.id, generatorData)
        : await generatorService.create(generatorData as Omit<Generator, 'id'>);

      setGenerators(prev => 
        prev.map(g => g.id === savedGenerator.data.id ? savedGenerator.data : g)
      );
      setOpenGeneratorDialog(false);
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'success',
        message: 'Generator saved successfully',
        timestamp: new Date(),
        read: false
      }, ...prev]);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSaveCustomer = async () => {
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, {
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          address: editingCustomer.address,
          subscriptionStatus: editingCustomer.subscriptionStatus,
          serviceLevel: editingCustomer.serviceLevel,
          tickets: editingCustomer.tickets,
          type: editingCustomer.type,
          createdAt: editingCustomer.createdAt,
          updatedAt: editingCustomer.updatedAt,
          lastLogin: editingCustomer.lastLogin
        });
      } else {
        await customerService.create({
          name: editingCustomer.name,
          email: editingCustomer.email,
          phone: editingCustomer.phone,
          address: editingCustomer.address,
          subscriptionStatus: editingCustomer.subscriptionStatus,
          serviceLevel: editingCustomer.serviceLevel,
          tickets: [],
          type: editingCustomer.type,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }
      setOpenCustomerDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer');
    }
  };

  const handleSaveTicket = async () => {
    try {
      if (editingTicket) {
        await supportService.update(editingTicket.id, {
          customerId: editingTicket.customerId,
          type: editingTicket.type,
          status: editingTicket.status,
          priority: editingTicket.priority,
          description: editingTicket.description,
          assignedTo: editingTicket.assignedTo,
          attachments: editingTicket.attachments,
          createdAt: editingTicket.createdAt,
          updatedAt: editingTicket.updatedAt,
          title: editingTicket.title,
          customerName: editingTicket.customerName,
          comments: editingTicket.comments,
          date: editingTicket.date
        });
      } else {
        await supportService.create({
          customerId: editingTicket.customerId,
          type: editingTicket.type,
          status: editingTicket.status,
          priority: editingTicket.priority,
          description: editingTicket.description,
          assignedTo: editingTicket.assignedTo,
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: editingTicket.title,
          customerName: editingTicket.customerName,
          comments: [],
          date: new Date().toISOString()
        });
      }
      setOpenTicketDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ticket');
    }
  };

  const handleDeleteGenerator = async (id: string) => {
    try {
      await generatorService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete generator');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
    }
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await supportService.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$128,500',
      change: '+12.3%',
      icon: <DollarSignIcon className="w-6 h-6" />,
      trend: 'up' as const,
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      icon: <WrenchIcon className="w-6 h-6" />,
      trend: 'up' as const,
    },
    {
      title: 'Generator Stock',
      value: '156',
      change: '-5',
      icon: <PackageIcon className="w-6 h-6" />,
      trend: 'down' as const,
    },
    {
      title: 'New Leads',
      value: '38',
      change: '+8',
      icon: <UsersIcon className="w-6 h-6" />,
      trend: 'up' as const,
    },
  ];

  const recentProjects = projects.map((project, index) => ({
    id: index + 1,
    ...project,
    address: '123 Main St, Houston, TX',
    technicians: ['Mike Johnson', 'David Chen'],
  }));

  const upcomingAppointments = [
    {
      id: 1,
      type: 'Site Survey',
      customer: 'Michael Brown',
      address: '432 Cedar Lane, Houston, TX',
      time: '9:00 AM',
      date: 'Tomorrow',
    },
    {
      id: 2,
      type: 'Installation',
      customer: 'Lisa Anderson',
      address: '765 Birch Street, Houston, TX',
      time: '10:30 AM',
      date: 'Tomorrow',
    },
    {
      id: 3,
      type: 'Maintenance',
      customer: 'James Wilson',
      address: '321 Elm Road, Houston, TX',
      time: '2:00 PM',
      date: 'Jun 15',
    },
  ];

  const newClients = [
    {
      id: 1,
      name: 'Customer 1',
      type: 'commercial',
      status: 'inactive',
    },
    {
      id: 2,
      name: 'Customer 2',
      type: 'residential',
      status: 'active',
    },
    {
      id: 3,
      name: 'Customer 3',
      type: 'residential',
      status: 'inactive',
    },
    {
      id: 4,
      name: 'Customer 4',
      type: 'commercial',
      status: 'active',
    },
    {
      id: 5,
      name: 'Customer 5',
      type: 'residential',
      status: 'active',
    },
  ];

  const activeProjects = [
    {
      id: 1,
      title: 'Generac 22KW Installation',
      customer: 'John & Sarah Miller',
      progress: 65,
      status: 'in-progress',
      dueDate: 'Jun 15, 2024',
    },
    {
      id: 2,
      title: 'Maintenance Check',
      customer: 'Robert Wilson',
      progress: 0,
      status: 'pending',
      dueDate: 'Jun 18, 2024',
    },
    {
      id: 3,
      title: 'Emergency Repair',
      customer: 'Emily Thompson',
      progress: 100,
      status: 'completed',
      dueDate: 'Jun 10, 2024',
    },
  ];

  const supportTickets = {
    open: 12,
    inProgress: 8,
    resolved: 45,
    tickets: [
      {
        id: 1,
        title: 'Support Ticket #1',
        description: 'This is a billing support ticket with urgent priority.',
        priority: 'urgent',
        assignedTo: 'staff-8',
        dueDate: '6/6/2025',
      },
      {
        id: 2,
        title: 'Support Ticket #2',
        description: 'This is a general support ticket with low priority.',
        priority: 'low',
        assignedTo: 'staff-2',
        dueDate: '6/7/2025',
      },
      {
        id: 3,
        title: 'Support Ticket #3',
        description: 'This is a technical support ticket with urgent priority.',
        priority: 'urgent',
        assignedTo: 'staff-5',
        dueDate: '6/8/2025',
      },
    ],
  };

  return (
    <div className={`min-h-screen ${themeClass}`}>
      <AnimatedCircuitBackground />
      {/* Enhanced Header with Notifications */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-steel-900">HGP Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => fetchData()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDarkMode(!darkMode)}
            startIcon={darkMode ? <SunIcon /> : <MoonIcon />}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <StatCard
          title="Total Generators"
          value={hgpStats.totalGenerators}
          icon={<PackageIcon />}
          trend="up"
          change={5}
        />
        <StatCard
          title="Active Projects"
          value={hgpStats.activeProjects}
          icon={<Assignment />}
          trend="up"
          change={3}
        />
        <StatCard
          title="Pending Maintenance"
          value={hgpStats.pendingMaintenance}
          icon={<WrenchIcon />}
          trend="down"
          change={-2}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${hgpStats.revenueThisMonth.toLocaleString()}`}
          icon={<DollarSignIcon />}
          trend="up"
          change={8}
        />
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <MuiAlert severity="error" className="m-4">
          {error}
        </MuiAlert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <CircularProgress />
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen transition-all duration-300 ease-in-out bg-white lg:pl-0 pt-10">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-primary mb-8">Admin Dashboard</h1>
          {/* Dashboard Widgets Grid */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Business Overview</h1>
              <div className="flex items-center space-x-4">
                <Button variant="outlined">
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-steel-600 mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <div className={`flex items-center mt-2 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend === 'up' ? <TrendingUpIcon className="w-4 h-4 mr-1" /> : <TrendingDownIcon className="w-4 h-4 mr-1" />}
                        <span className="text-sm">{stat.change}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* New Clients Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-primary mb-4">New Clients</h3>
                    <Button variant="text" size="small">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {newClients.map((client) => (
                      <div key={client.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar />
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">{client.type}</p>
                          </div>
                        </div>
                        <Badge className={client.status === 'active' ? 'bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold shadow' : 'bg-steel-200 text-steel-600 px-3 py-1 rounded-full text-xs font-semibold'}>
                          {client.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Website Analytics Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">Website Analytics</h3>
                    <Button variant="text" size="small">Details</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Visitors</p>
                        <p className="text-2xl font-bold">2,847</p>
                        <p className="text-sm text-green-500">+12.5%</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">3.2%</p>
                        <p className="text-sm text-green-500">+0.8%</p>
                      </div>
                    </div>
                    <div className="h-[200px] bg-background/50 rounded-lg flex items-center justify-center">
                      {/* Placeholder for analytics chart */}
                      <p className="text-muted-foreground">Analytics Chart</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Templates Widget */}
                <Link to="/admin/invoice-templates" className="dashboard-widget card bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:bg-accent/10 transition">
                  <FileText className="w-8 h-8 text-accent mb-2" />
                  <span className="font-semibold text-lg mb-1">Invoice Templates</span>
                  {/* Optionally, show a count or quick action here */}
                  <span className="text-sm text-muted-foreground">Manage & create templates</span>
                </Link>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                {/* Active Projects Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">Active Projects</h3>
                    <Button variant="text" size="small">View All</Button>
                  </div>
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge variant={
                            project.status === 'completed' ? 'default' :
                            project.status === 'in-progress' ? 'secondary' :
                            'outline'
                          }>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{project.customer}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Due: {project.dueDate}</span>
                          <Badge variant="outline">M/D</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Management Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">Email Management</h3>
                    <Button variant="text" size="small">Compose</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Inbox</p>
                        <p className="text-2xl font-bold">24</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Sent</p>
                        <p className="text-2xl font-bold">156</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Drafts</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 bg-background/50 rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <MailIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Important Update</p>
                              <p className="text-sm text-muted-foreground">From: support@hougenpros.com</p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">2h ago</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Ticket Management Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">Support Tickets</h3>
                    <Button variant="text" size="small">New Ticket</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Open</p>
                        <p className="text-2xl font-bold">{supportTickets.open}</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold">{supportTickets.inProgress}</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Resolved</p>
                        <p className="text-2xl font-bold">{supportTickets.resolved}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {supportTickets.tickets.map((ticket) => (
                        <div key={ticket.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{ticket.title}</h4>
                            <Badge variant={ticket.priority === 'urgent' ? 'destructive' : 'secondary'}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Assigned to: {ticket.assignedTo}</span>
                            <span className="text-muted-foreground">{ticket.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invoicing Widget */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-none text-steel-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">Invoicing</h3>
                    <Button variant="text" size="small">Create Invoice</Button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Outstanding</p>
                        <p className="text-2xl font-bold">$45,230</p>
                        <p className="text-sm text-red-500">12 invoices</p>
                      </div>
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="text-2xl font-bold">$28,500</p>
                        <p className="text-sm text-green-500">+15.3%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {bills.slice(0, 3).map((bill) => (
                        <div key={bill.id} className="p-3 bg-background/50 rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">Invoice #{bill.id}</p>
                            <p className="text-sm text-muted-foreground">{bill.customerName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${bill.amount}</p>
                            <Badge variant={bill.status === 'paid' ? 'default' : bill.status === 'pending' ? 'secondary' : 'destructive'}>
                              {bill.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
