import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  ClipboardList,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
  Star,
  Phone,
  Mail,
  MapPin,
  Activity,
  Eye,
  Download,
  Filter,
  Search,
  Settings,
  Plus,
  ArrowRight,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { WeatherWidget } from '@/components/weather/WeatherWidget';
import SEO from '@/components/SEO';

// Mock data for demonstration
const dashboardStats = [
  {
    title: 'Total Customers',
    value: '1,234',
    change: '+12%',
    trend: 'up' as const,
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Active Projects',
    value: '89',
    change: '+5%',
    trend: 'up' as const,
    icon: ClipboardList,
    color: 'text-green-600'
  },
  {
    title: 'Inventory Items',
    value: '456',
    change: '-2%',
    trend: 'down' as const,
    icon: Package,
    color: 'text-orange-600'
  },
  {
    title: 'Monthly Revenue',
    value: '$78,542',
    change: '+18%',
    trend: 'up' as const,
    icon: DollarSign,
    color: 'text-purple-600'
  }
];

const recentProjects = [
  {
    id: 1,
    name: 'Commercial Generator Installation',
    customer: 'ABC Corp',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2024-01-15',
    progress: 65
  },
  {
    id: 2,
    name: 'Residential Backup System',
    customer: 'John Smith',
    status: 'Planning',
    priority: 'Medium',
    dueDate: '2024-01-20',
    progress: 25
  },
  {
    id: 3,
    name: 'Emergency Repair Service',
    customer: 'Houston Medical',
    status: 'Urgent',
    priority: 'Critical',
    dueDate: '2024-01-10',
    progress: 90
  }
];

const recentTickets = [
  {
    id: 1,
    title: 'Generator not starting',
    customer: 'Tech Solutions Inc',
    priority: 'High',
    status: 'Open',
    created: '2 hours ago'
  },
  {
    id: 2,
    title: 'Maintenance request',
    customer: 'Green Energy Co',
    priority: 'Medium',
    status: 'In Progress',
    created: '1 day ago'
  },
  {
    id: 3,
    title: 'Installation question',
    customer: 'Home Owner',
    priority: 'Low',
    status: 'Resolved',
    created: '3 days ago'
  }
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Site inspection at ABC Corp',
    time: '9:00 AM',
    type: 'Inspection',
    priority: 'High'
  },
  {
    id: 2,
    title: 'Generator maintenance check',
    time: '11:30 AM',
    type: 'Maintenance',
    priority: 'Medium'
  },
  {
    id: 3,
    title: 'Customer consultation call',
    time: '2:00 PM',
    type: 'Meeting',
    priority: 'Medium'
  },
  {
    id: 4,
    title: 'Parts delivery coordination',
    time: '4:15 PM',
    type: 'Logistics',
    priority: 'Low'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'resolved':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'planning':
      return 'bg-purple-100 text-purple-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'open':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function Dashboard() {
  return (
    <>
      <SEO 
        title="Admin Dashboard | HOU GEN PROS" 
        description="Comprehensive admin dashboard for managing customers, projects, inventory, and business operations." 
        canonical="/admin/dashboard" 
        pageType="website" 
        keywords="admin, dashboard, management, generator, houston" 
        schema={null} 
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Quick Action
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-slate-100 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Charts and Analytics */}
            <div className="xl:col-span-2 space-y-6">
              {/* Weather Widget */}
              <WeatherWidget />

              {/* Recent Projects */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Recent Projects
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <Badge variant="outline" className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{project.customer}</p>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <span className="text-sm text-gray-500">Due: {project.dueDate}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="revenue" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="revenue">Revenue</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                    </TabsList>
                    <TabsContent value="revenue" className="mt-4">
                      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
                        <div className="text-center">
                          <LineChart className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                          <h3 className="text-lg font-semibold mb-2">Revenue Analytics</h3>
                          <p className="text-gray-600">Monthly revenue: $78,542 (+18%)</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="projects" className="mt-4">
                      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
                        <div className="text-center">
                          <PieChart className="w-16 h-16 mx-auto mb-4 text-green-500" />
                          <h3 className="text-lg font-semibold mb-2">Project Distribution</h3>
                          <p className="text-gray-600">89 active projects across all categories</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="efficiency" className="mt-4">
                      <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                          <h3 className="text-lg font-semibold mb-2">Team Efficiency</h3>
                          <p className="text-gray-600">Average completion rate: 92%</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity and Tasks */}
            <div className="space-y-6">
              {/* Recent Tickets */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Support Tickets
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">{ticket.title}</h4>
                          <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{ticket.customer}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{ticket.created}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm">{task.title}</h4>
                            <span className="text-xs text-gray-500">{task.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {task.type}
                            </Badge>
                            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="h-16 flex-col">
                      <Users className="w-5 h-5 mb-1" />
                      <span className="text-xs">New Customer</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-16 flex-col">
                      <ClipboardList className="w-5 h-5 mb-1" />
                      <span className="text-xs">New Project</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-16 flex-col">
                      <Package className="w-5 h-5 mb-1" />
                      <span className="text-xs">Add Inventory</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-16 flex-col">
                      <Wrench className="w-5 h-5 mb-1" />
                      <span className="text-xs">Schedule Service</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Services</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Operational</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Systems</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-yellow-600">Scheduled</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">External APIs</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
