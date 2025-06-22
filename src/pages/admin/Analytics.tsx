
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
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - In a real implementation, this would come from Google Analytics API
const mockAnalyticsData = {
  overview: {
    users: 8432,
    usersTrend: 12.5,
    sessions: 12847,
    sessionsTrend: 8.3,
    pageviews: 34521,
    pageviewsTrend: 15.2,
    bounceRate: 42.3,
    bounceRateTrend: -2.1,
    avgSessionDuration: 243,
    avgSessionDurationTrend: 5.7
  },
  realTime: {
    activeUsers: 23,
    pageviews: 45,
    topPages: [
      { page: '/', users: 8 },
      { page: '/services', users: 5 },
      { page: '/about', users: 4 },
      { page: '/contact', users: 3 },
      { page: '/products', users: 3 }
    ],
    topCountries: [
      { country: 'United States', users: 18 },
      { country: 'Canada', users: 3 },
      { country: 'United Kingdom', users: 2 }
    ]
  },
  traffic: [
    { date: '2024-01-01', users: 1200, sessions: 1800, pageviews: 4200 },
    { date: '2024-01-02', users: 1350, sessions: 2100, pageviews: 4800 },
    { date: '2024-01-03', users: 1100, sessions: 1650, pageviews: 3900 },
    { date: '2024-01-04', users: 1450, sessions: 2200, pageviews: 5200 },
    { date: '2024-01-05', users: 1600, sessions: 2400, pageviews: 5800 },
    { date: '2024-01-06', users: 1300, sessions: 1950, pageviews: 4600 },
    { date: '2024-01-07', users: 1750, sessions: 2650, pageviews: 6200 }
  ],
  demographics: {
    age: [
      { range: '18-24', percentage: 15, users: 1265 },
      { range: '25-34', percentage: 35, users: 2951 },
      { range: '35-44', percentage: 28, users: 2361 },
      { range: '45-54', percentage: 15, users: 1265 },
      { range: '55-64', percentage: 5, users: 422 },
      { range: '65+', percentage: 2, users: 169 }
    ],
    gender: [
      { name: 'Male', value: 60, users: 5059 },
      { name: 'Female', value: 38, users: 3204 },
      { name: 'Other', value: 2, users: 169 }
    ]
  },
  devices: [
    { name: 'Desktop', value: 45, users: 3794, color: '#8884d8' },
    { name: 'Mobile', value: 40, users: 3373, color: '#82ca9d' },
    { name: 'Tablet', value: 15, users: 1265, color: '#ffc658' }
  ],
  topPages: [
    { page: '/', pageviews: 8432, uniquePageviews: 6234, avgTimeOnPage: 185, bounceRate: 35.2 },
    { page: '/services', pageviews: 5621, uniquePageviews: 4876, avgTimeOnPage: 245, bounceRate: 28.9 },
    { page: '/about', pageviews: 3456, uniquePageviews: 3123, avgTimeOnPage: 195, bounceRate: 41.5 },
    { page: '/contact', pageviews: 2987, uniquePageviews: 2654, avgTimeOnPage: 320, bounceRate: 25.6 },
    { page: '/products', pageviews: 2543, uniquePageviews: 2287, avgTimeOnPage: 210, bounceRate: 38.7 }
  ],
  acquisitionChannels: [
    { source: 'Organic Search', users: 3794, percentage: 45, color: '#8884d8' },
    { source: 'Direct', users: 2530, percentage: 30, color: '#82ca9d' },
    { source: 'Social Media', users: 1265, percentage: 15, color: '#ffc658' },
    { source: 'Referral', users: 633, percentage: 7.5, color: '#ff7300' },
    { source: 'Email', users: 210, percentage: 2.5, color: '#00c49f' }
  ],
  conversions: {
    goals: [
      { name: 'Contact Form', completions: 234, conversionRate: 2.8, value: 11700 },
      { name: 'Phone Calls', completions: 156, conversionRate: 1.9, value: 15600 },
      { name: 'Quote Requests', completions: 89, conversionRate: 1.1, value: 22250 },
      { name: 'Service Bookings', completions: 45, conversionRate: 0.5, value: 13500 }
    ],
    ecommerce: {
      revenue: 62950,
      transactions: 89,
      avgOrderValue: 707.3,
      conversionRate: 1.1
    }
  }
};

const StatCard = ({ title, value, trend, icon, subtitle }: any) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function Analytics() {
  const [dateRange, setDateRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Google Analytics insights for hougenpros.com</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Users"
              value={mockAnalyticsData.overview.users.toLocaleString()}
              trend={mockAnalyticsData.overview.usersTrend}
              icon={<Users className="w-5 h-5 text-blue-600" />}
            />
            <StatCard
              title="Sessions"
              value={mockAnalyticsData.overview.sessions.toLocaleString()}
              trend={mockAnalyticsData.overview.sessionsTrend}
              icon={<Activity className="w-5 h-5 text-green-600" />}
            />
            <StatCard
              title="Pageviews"
              value={mockAnalyticsData.overview.pageviews.toLocaleString()}
              trend={mockAnalyticsData.overview.pageviewsTrend}
              icon={<Eye className="w-5 h-5 text-purple-600" />}
            />
            <StatCard
              title="Bounce Rate"
              value={`${mockAnalyticsData.overview.bounceRate}%`}
              trend={mockAnalyticsData.overview.bounceRateTrend}
              icon={<Target className="w-5 h-5 text-orange-600" />}
            />
            <StatCard
              title="Avg. Session Duration"
              value={formatDuration(mockAnalyticsData.overview.avgSessionDuration)}
              trend={mockAnalyticsData.overview.avgSessionDurationTrend}
              icon={<Clock className="w-5 h-5 text-red-600" />}
            />
          </div>

          {/* Traffic Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={mockAnalyticsData.traffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="sessions" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="pageviews" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Tab */}
        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Active Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {mockAnalyticsData.realTime.activeUsers}
                </div>
                <p className="text-sm text-muted-foreground">users on site now</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Active Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.realTime.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm truncate">{page.page}</span>
                      <Badge variant="secondary">{page.users}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.realTime.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{country.country}</span>
                      <Badge variant="outline">{country.users}</Badge>
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
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.demographics.age.map((age, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{age.range}</span>
                        <span>{age.percentage}%</span>
                      </div>
                      <Progress value={age.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.devices}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {mockAnalyticsData.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Acquisition Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockAnalyticsData.acquisitionChannels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Page</th>
                      <th className="text-right p-2">Pageviews</th>
                      <th className="text-right p-2">Unique Pageviews</th>
                      <th className="text-right p-2">Avg. Time on Page</th>
                      <th className="text-right p-2">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAnalyticsData.topPages.map((page, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{page.page}</td>
                        <td className="p-2 text-right">{page.pageviews.toLocaleString()}</td>
                        <td className="p-2 text-right">{page.uniquePageviews.toLocaleString()}</td>
                        <td className="p-2 text-right">{formatDuration(page.avgTimeOnPage)}</td>
                        <td className="p-2 text-right">{page.bounceRate}%</td>
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
            <Card>
              <CardHeader>
                <CardTitle>Goal Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.conversions.goals.map((goal, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{goal.name}</h4>
                        <Badge>{goal.conversionRate}%</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Completions</p>
                          <p className="font-semibold">{goal.completions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Value</p>
                          <p className="font-semibold">${goal.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>E-commerce Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${mockAnalyticsData.conversions.ecommerce.revenue.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold">{mockAnalyticsData.conversions.ecommerce.transactions}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                    <p className="text-2xl font-bold">${mockAnalyticsData.conversions.ecommerce.avgOrderValue}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">{mockAnalyticsData.conversions.ecommerce.conversionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
