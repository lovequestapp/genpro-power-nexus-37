
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Calendar,
  Eye,
  Target,
  MapPin,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Enhanced mock data with real-looking patterns
const generateAnalyticsData = () => ({
  overview: {
    users: 12847,
    usersTrend: 8.3,
    sessions: 18642,
    sessionsTrend: 12.7,
    pageviews: 45231,
    pageviewsTrend: 15.8,
    bounceRate: 38.4,
    bounceRateTrend: -3.2,
    avgSessionDuration: 247,
    avgSessionDurationTrend: 6.1,
    conversionRate: 2.8,
    conversionRateTrend: 0.4
  },
  realTime: {
    activeUsers: 47,
    pageviews: 89,
    topPages: [
      { page: '/', users: 18, title: 'Homepage' },
      { page: '/services', users: 12, title: 'Services' },
      { page: '/about', users: 8, title: 'About Us' },
      { page: '/contact', users: 5, title: 'Contact' },
      { page: '/products', users: 4, title: 'Products' }
    ],
    topCountries: [
      { country: 'United States', users: 28, flag: '🇺🇸' },
      { country: 'Canada', users: 8, flag: '🇨🇦' },
      { country: 'United Kingdom', users: 6, flag: '🇬🇧' },
      { country: 'Australia', users: 3, flag: '🇦🇺' },
      { country: 'Germany', users: 2, flag: '🇩🇪' }
    ],
    activeDevices: {
      desktop: 65,
      mobile: 30,
      tablet: 5
    }
  },
  traffic: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const baseUsers = 1200 + Math.random() * 800;
    return {
      date: date.toISOString().split('T')[0],
      users: Math.round(baseUsers),
      sessions: Math.round(baseUsers * 1.4),
      pageviews: Math.round(baseUsers * 3.2),
      bounceRate: Math.round(35 + Math.random() * 15)
    };
  }),
  demographics: {
    age: [
      { range: '18-24', percentage: 18, users: 2312, color: '#8884d8' },
      { range: '25-34', percentage: 32, users: 4111, color: '#82ca9d' },
      { range: '35-44', percentage: 25, users: 3212, color: '#ffc658' },
      { range: '45-54', percentage: 16, users: 2056, color: '#ff7300' },
      { range: '55-64', percentage: 7, users: 899, color: '#00c49f' },
      { range: '65+', percentage: 2, users: 257, color: '#8dd1e1' }
    ],
    gender: [
      { name: 'Male', value: 58, users: 7451, color: '#3b82f6' },
      { name: 'Female', value: 40, users: 5139, color: '#ec4899' },
      { name: 'Other', value: 2, users: 257, color: '#10b981' }
    ],
    interests: [
      { category: 'Technology', percentage: 28, users: 3597 },
      { category: 'Business', percentage: 22, users: 2826 },
      { category: 'Home & Garden', percentage: 18, users: 2312 },
      { category: 'Automotive', percentage: 15, users: 1927 },
      { category: 'Sports', percentage: 10, users: 1285 },
      { category: 'Travel', percentage: 7, users: 900 }
    ]
  },
  devices: [
    { name: 'Desktop', value: 52, users: 6680, sessions: 9354, color: '#3b82f6' },
    { name: 'Mobile', value: 38, users: 4882, sessions: 6784, color: '#10b981' },
    { name: 'Tablet', value: 10, users: 1285, sessions: 1504, color: '#f59e0b' }
  ],
  topPages: [
    { 
      page: '/', 
      pageviews: 12847, 
      uniquePageviews: 9234, 
      avgTimeOnPage: 185, 
      bounceRate: 32.1,
      exitRate: 28.4,
      title: 'Homepage'
    },
    { 
      page: '/services', 
      pageviews: 8621, 
      uniquePageviews: 7234, 
      avgTimeOnPage: 267, 
      bounceRate: 24.8,
      exitRate: 31.2,
      title: 'Services'
    },
    { 
      page: '/about', 
      pageviews: 5456, 
      uniquePageviews: 4823, 
      avgTimeOnPage: 195, 
      bounceRate: 41.5,
      exitRate: 38.7,
      title: 'About Us'
    },
    { 
      page: '/contact', 
      pageviews: 4987, 
      uniquePageviews: 4234, 
      avgTimeOnPage: 145, 
      bounceRate: 52.6,
      exitRate: 67.8,
      title: 'Contact'
    },
    { 
      page: '/products', 
      pageviews: 3543, 
      uniquePageviews: 3102, 
      avgTimeOnPage: 210, 
      bounceRate: 35.7,
      exitRate: 29.3,
      title: 'Products'
    }
  ],
  acquisitionChannels: [
    { source: 'Organic Search', users: 6680, percentage: 52, sessions: 9354, color: '#3b82f6', newUsers: 4012 },
    { source: 'Direct', users: 3856, percentage: 30, sessions: 5184, color: '#10b981', newUsers: 1928 },
    { source: 'Social Media', users: 1285, percentage: 10, sessions: 1798, color: '#f59e0b', newUsers: 899 },
    { source: 'Referral', users: 771, percentage: 6, sessions: 1079, color: '#ef4444', newUsers: 540 },
    { source: 'Email', users: 257, percentage: 2, sessions: 360, color: '#8b5cf6', newUsers: 128 }
  ],
  conversions: {
    goals: [
      { 
        name: 'Contact Form Submission', 
        completions: 347, 
        conversionRate: 2.7, 
        value: 17350,
        trend: 12.5 
      },
      { 
        name: 'Phone Call Clicks', 
        completions: 234, 
        conversionRate: 1.8, 
        value: 23400,
        trend: 8.3 
      },
      { 
        name: 'Quote Requests', 
        completions: 156, 
        conversionRate: 1.2, 
        value: 39000,
        trend: -2.1 
      },
      { 
        name: 'Service Bookings', 
        completions: 89, 
        conversionRate: 0.7, 
        value: 26700,
        trend: 15.7 
      }
    ],
    ecommerce: {
      revenue: 106450,
      transactions: 156,
      avgOrderValue: 682.37,
      conversionRate: 1.2,
      revenuePerUser: 8.29
    },
    funnelData: [
      { step: 'Homepage Visit', users: 12847, percentage: 100 },
      { step: 'Services Page', users: 8621, percentage: 67.1 },
      { step: 'Contact Page', users: 4987, percentage: 38.8 },
      { step: 'Form Started', users: 1847, percentage: 14.4 },
      { step: 'Form Completed', users: 347, percentage: 2.7 }
    ]
  },
  timeMetrics: {
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      users: Math.round(200 + Math.sin(hour * Math.PI / 12) * 150 + Math.random() * 100),
      sessions: Math.round(280 + Math.sin(hour * Math.PI / 12) * 200 + Math.random() * 140)
    })),
    weeklyData: [
      { day: 'Mon', users: 1847, sessions: 2584 },
      { day: 'Tue', users: 2156, sessions: 3019 },
      { day: 'Wed', users: 2340, sessions: 3276 },
      { day: 'Thu', users: 2198, sessions: 3077 },
      { day: 'Fri', users: 1923, sessions: 2692 },
      { day: 'Sat', users: 1456, sessions: 2038 },
      { day: 'Sun', users: 927, sessions: 1298 }
    ]
  }
});

const StatCard = ({ title, value, trend, icon, subtitle, className = "", trendLabel }: any) => (
  <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            {React.cloneElement(icon, { className: 'w-6 h-6 text-blue-600' })}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend > 0 
              ? 'bg-emerald-50 text-emerald-700' 
              : trend < 0 
                ? 'bg-red-50 text-red-700'
                : 'bg-gray-50 text-gray-700'
          }`}>
            {trend > 0 ? (
              <ArrowUp className="w-3 h-3" />
            ) : trend < 0 ? (
              <ArrowDown className="w-3 h-3" />
            ) : null}
            <span>{Math.abs(trend)}%</span>
            {trendLabel && <span className="ml-1">{trendLabel}</span>}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const MetricCard = ({ title, value, change, changeType = 'positive', icon, className = "" }: any) => (
  <div className={`bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 rounded-lg bg-blue-50">
        {React.cloneElement(icon, { className: 'w-5 h-5 text-blue-600' })}
      </div>
      <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
        changeType === 'positive' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
      }`}>
        {changeType === 'positive' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <div className="space-y-1">
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  </div>
);

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(generateAnalyticsData());

  // Fetch real customer and project data
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(generateAnalyticsData());
      setIsLoading(false);
    }, 1500);
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights for hougenpros.com</p>
              <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                <span>Last updated: {new Date().toLocaleString()}</span>
                <span>•</span>
                <span>Property: G-G94FNY0874</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={isLoading} className="border-gray-200">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" className="border-gray-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-6 bg-transparent">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Overview</TabsTrigger>
              <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Real-time</TabsTrigger>
              <TabsTrigger value="audience" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Audience</TabsTrigger>
              <TabsTrigger value="acquisition" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Acquisition</TabsTrigger>
              <TabsTrigger value="behavior" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Behavior</TabsTrigger>
              <TabsTrigger value="conversions" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Conversions</TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <StatCard
                title="Total Users"
                value={analyticsData.overview.users.toLocaleString()}
                trend={analyticsData.overview.usersTrend}
                icon={<Users />}
                trendLabel="vs last period"
              />
              <StatCard
                title="Sessions"
                value={analyticsData.overview.sessions.toLocaleString()}
                trend={analyticsData.overview.sessionsTrend}
                icon={<Activity />}
                trendLabel="vs last period"
              />
              <StatCard
                title="Pageviews"
                value={analyticsData.overview.pageviews.toLocaleString()}
                trend={analyticsData.overview.pageviewsTrend}
                icon={<Eye />}
                trendLabel="vs last period"
              />
              <StatCard
                title="Bounce Rate"
                value={`${analyticsData.overview.bounceRate}%`}
                trend={analyticsData.overview.bounceRateTrend}
                icon={<Target />}
                trendLabel="vs last period"
              />
              <StatCard
                title="Avg. Session Duration"
                value={formatDuration(analyticsData.overview.avgSessionDuration)}
                trend={analyticsData.overview.avgSessionDurationTrend}
                icon={<Clock />}
                trendLabel="vs last period"
              />
              <StatCard
                title="Conversion Rate"
                value={`${analyticsData.overview.conversionRate}%`}
                trend={analyticsData.overview.conversionRateTrend}
                icon={<Target />}
                trendLabel="vs last period"
              />
            </div>

            {/* Traffic Overview Chart */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={analyticsData.traffic}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={customTooltip} />
                    <Legend />
                    <Area type="monotone" dataKey="pageviews" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="Pageviews" />
                    <Area type="monotone" dataKey="sessions" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Sessions" />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} name="Users" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Time-based Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Hourly Traffic Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={analyticsData.timeMetrics.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={11} />
                      <Tooltip content={customTooltip} />
                      <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.timeMetrics.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={11} />
                      <Tooltip content={customTooltip} />
                      <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Active Users */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3 text-lg">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-900">Active Users</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {analyticsData.realTime.activeUsers}
                  </div>
                  <p className="text-sm text-gray-600">users on site now</p>
                  <div className="mt-4 text-xs text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Active Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Desktop</span>
                      </div>
                      <span className="font-medium text-gray-900">{analyticsData.realTime.activeDevices.desktop}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">Mobile</span>
                      </div>
                      <span className="font-medium text-gray-900">{analyticsData.realTime.activeDevices.mobile}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">Tablet</span>
                      </div>
                      <span className="font-medium text-gray-900">{analyticsData.realTime.activeDevices.tablet}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Active Pages */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Top Active Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.realTime.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                          <p className="text-xs text-gray-500 truncate">{page.page}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700">
                          {page.users}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Top Countries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.realTime.topCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm text-gray-700 truncate">{country.country}</span>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {country.users}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Audience Tab */}
          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.age.map((age, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700">{age.range}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{age.users.toLocaleString()} users</span>
                            <span className="font-medium text-gray-900">{age.percentage}%</span>
                          </div>
                        </div>
                        <Progress value={age.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gender Distribution */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.demographics.gender}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {analyticsData.demographics.gender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Device Types */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Device Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                          <div>
                            <p className="font-medium text-gray-900">{device.name}</p>
                            <p className="text-sm text-gray-500">{device.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{device.value}%</p>
                          <p className="text-sm text-gray-500">{device.sessions.toLocaleString()} sessions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">User Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.demographics.interests.map((interest, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-gray-700">{interest.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{interest.users.toLocaleString()} users</span>
                            <span className="font-medium text-gray-900">{interest.percentage}%</span>
                          </div>
                        </div>
                        <Progress value={interest.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Acquisition Tab */}
          <TabsContent value="acquisition" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={analyticsData.acquisitionChannels} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                      <YAxis dataKey="source" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                      <Tooltip content={customTooltip} />
                      <Bar dataKey="users" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Channel Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.acquisitionChannels.map((channel, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">{channel.source}</h4>
                          <Badge className="bg-blue-50 text-blue-700">{channel.percentage}%</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Users</p>
                            <p className="font-semibold text-gray-900">{channel.users.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Sessions</p>
                            <p className="font-semibold text-gray-900">{channel.sessions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">New Users</p>
                            <p className="font-semibold text-gray-900">{channel.newUsers.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Top Pages Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-900">Page</th>
                        <th className="text-right p-3 font-semibold text-gray-900">Pageviews</th>
                        <th className="text-right p-3 font-semibold text-gray-900">Unique Views</th>
                        <th className="text-right p-3 font-semibold text-gray-900">Avg. Time</th>
                        <th className="text-right p-3 font-semibold text-gray-900">Bounce Rate</th>
                        <th className="text-right p-3 font-semibold text-gray-900">Exit Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.topPages.map((page, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-900">{page.title}</p>
                              <p className="text-sm text-gray-500">{page.page}</p>
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium text-gray-900">{page.pageviews.toLocaleString()}</td>
                          <td className="p-3 text-right text-gray-700">{page.uniquePageviews.toLocaleString()}</td>
                          <td className="p-3 text-right text-gray-700">{formatDuration(page.avgTimeOnPage)}</td>
                          <td className="p-3 text-right text-gray-700">{page.bounceRate}%</td>
                          <td className="p-3 text-right text-gray-700">{page.exitRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Goal Conversions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Goal Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.conversions.goals.map((goal, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-900">{goal.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-50 text-blue-700">{goal.conversionRate}%</Badge>
                            <Badge className={`${goal.trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                              {goal.trend > 0 ? '+' : ''}{goal.trend}%
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Completions</p>
                            <p className="font-semibold text-gray-900">{goal.completions}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Value</p>
                            <p className="font-semibold text-gray-900">{formatCurrency(goal.value)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* E-commerce Overview */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">E-commerce Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.conversions.ecommerce.revenue)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Transactions</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.conversions.ecommerce.transactions}</p>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Conversion Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.conversions.ecommerce.conversionRate}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Avg. Order Value</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(analyticsData.conversions.ecommerce.avgOrderValue)}</p>
                      </div>
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <p className="text-sm text-gray-600">Revenue Per User</p>
                        <p className="text-xl font-bold text-gray-900">{formatCurrency(analyticsData.conversions.ecommerce.revenuePerUser)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.conversions.funnelData.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{step.step}</h4>
                            <p className="text-sm text-gray-600">{step.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">{step.percentage}%</p>
                          {index > 0 && (
                            <p className="text-sm text-gray-500">
                              {((step.users / analyticsData.conversions.funnelData[index - 1].users) * 100).toFixed(1)}% of previous
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={step.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
