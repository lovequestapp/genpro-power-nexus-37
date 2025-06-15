import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DashboardStats } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { UserIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { label: 'Overview', icon: AccountBalanceWallet },
  { label: 'QuickBooks', icon: Sync },
  { label: 'Projects', icon: Assignment },
  { label: 'Support', icon: SupportAgent },
  { label: 'Team', icon: Group },
  { label: 'Settings', icon: SettingsIcon },
];

const mockQuickBooks = {
  balances: [
    { name: 'Bank Account', amount: '$24,500.00', type: 'bank' },
    { name: 'Credit Card', amount: '-$2,300.00', type: 'credit' },
  ],
  invoices: [
    { id: 'INV-1001', customer: 'Acme Corp', amount: '$1,200.00', status: 'Overdue' },
    { id: 'INV-1002', customer: 'Beta LLC', amount: '$3,500.00', status: 'Open' },
    { id: 'INV-1003', customer: 'Gamma Inc', amount: '$2,000.00', status: 'Paid' },
  ],
  transactions: [
    { date: '2024-07-01', desc: 'Payment from Acme Corp', amount: '+$1,200.00' },
    { date: '2024-06-28', desc: 'Office Supplies', amount: '-$150.00' },
    { date: '2024-06-27', desc: 'Payment to Vendor', amount: '-$2,000.00' },
  ],
  syncStatus: 'Last synced 2 hours ago',
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

interface Project {
  title: string;
  customer: string;
  status: 'in-progress' | 'pending' | 'completed';
  progress: number;
  dueDate: string;
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

const ProjectCard = ({ project }: { project: Project }) => {
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

  const projects: Project[] = [
    {
      title: 'Generac 22KW Installation',
      customer: 'John & Sarah Miller',
      status: 'in-progress',
      progress: 65,
      dueDate: 'Jun 15, 2024',
    },
    {
      title: 'Maintenance Check',
      customer: 'Robert Wilson',
      status: 'pending',
      progress: 0,
      dueDate: 'Jun 18, 2024',
    },
    {
      title: 'Emergency Repair',
      customer: 'Emily Thompson',
      status: 'completed',
      progress: 100,
      dueDate: 'Jun 10, 2024',
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        generatorsRes,
        customersRes,
        ticketsRes,
        billsRes,
        alertsRes
      ] = await Promise.all([
        generatorService.getAll(),
        customerService.getAll(),
        supportService.getAll(),
        billingService.getAll(),
        alertService.getAll()
      ]);

      setGenerators(generatorsRes.data);
      setCustomers(customersRes.data);
      setTickets(ticketsRes.data);
      setBills(billsRes.data);
      setAlerts(alertsRes.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGenerator = async () => {
    try {
      if (editingGenerator) {
        await generatorService.update(editingGenerator.id, {
          name: editingGenerator.name,
          model: editingGenerator.model,
          type: editingGenerator.type,
          status: editingGenerator.status,
          location: editingGenerator.location,
          lastMaintenance: editingGenerator.lastMaintenance,
          nextMaintenance: editingGenerator.nextMaintenance,
          readings: editingGenerator.readings,
          powerRating: editingGenerator.powerRating,
          fuelType: editingGenerator.fuelType,
          runtime: editingGenerator.runtime,
          installationDate: editingGenerator.installationDate,
          warrantyExpiry: editingGenerator.warrantyExpiry
        });
      } else {
        await generatorService.create({
          name: editingGenerator.name,
          model: editingGenerator.model,
          type: editingGenerator.type,
          status: editingGenerator.status,
          location: editingGenerator.location,
          lastMaintenance: editingGenerator.lastMaintenance,
          nextMaintenance: editingGenerator.nextMaintenance,
          readings: [],
          powerRating: editingGenerator.powerRating,
          fuelType: editingGenerator.fuelType,
          runtime: editingGenerator.runtime,
          installationDate: editingGenerator.installationDate,
          warrantyExpiry: editingGenerator.warrantyExpiry
        });
      }
      setOpenGeneratorDialog(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save generator');
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
          comments: editingTicket.comments
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
          comments: []
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
    <div className="min-h-screen bg-white">
      <AnimatedCircuitBackground />
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