import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Eye, 
  Mail, 
  Calendar, 
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  BarChart3,
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  getFormSubmissions, 
  getFormSubmissionStats, 
  getFormAnalyticsStats,
  getFormDefinitions,
  updateFormSubmission,
  deleteFormSubmission 
} from '@/lib/formsService';
import type { 
  FormSubmission, 
  FormDefinition, 
  FormSubmissionStats, 
  FormAnalyticsStats,
  FormSubmissionFilters 
} from '@/types/forms';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function FormsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [stats, setStats] = useState<FormSubmissionStats | null>(null);
  const [analytics, setAnalytics] = useState<FormAnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FormSubmissionFilters>({});
  const [selectedForm, setSelectedForm] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [submissionsData, formsData, statsData, analyticsData] = await Promise.all([
        getFormSubmissions(filters),
        getFormDefinitions(),
        getFormSubmissionStats(),
        getFormAnalyticsStats()
      ]);

      setSubmissions(submissionsData);
      setForms(formsData);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading forms data:', error);
      toast({
        title: "Error",
        description: "Failed to load forms data",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleStatusChange = async (submissionId: string, newStatus: string) => {
    try {
      await updateFormSubmission(submissionId, { status: newStatus as any });
      await loadData();
      toast({
        title: "Success",
        description: "Submission status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await deleteFormSubmission(submissionId);
      await loadData();
      toast({
        title: "Success",
        description: "Submission deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="w-4 h-4" />;
      case 'read': return <Eye className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'archived': return <Archive className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderSubmissionCard = (submission: FormSubmission) => (
    <Card key={submission.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(submission.status)}>
              {getStatusIcon(submission.status)}
              <span className="ml-1">{submission.status.replace('_', ' ')}</span>
            </Badge>
            <span className="text-sm text-gray-500">
              {format(new Date(submission.created_at), 'MMM dd, yyyy HH:mm')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={submission.status}
              onValueChange={(value) => handleStatusChange(submission.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSubmission(submission.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900">
              {submission.form?.name || 'Unknown Form'}
            </h4>
            <p className="text-sm text-gray-500">
              Submitted by: {submission.data.name || submission.data.email || 'Anonymous'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(submission.data).slice(0, 6).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace('_', ' ')}
                </dt>
                <dd className="text-sm text-gray-900 mt-1">
                  {typeof value === 'string' && value.length > 100 
                    ? `${value.substring(0, 100)}...` 
                    : String(value)
                  }
                </dd>
              </div>
            ))}
          </div>

          {submission.metadata && (
            <div className="pt-3 border-t">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {submission.ip_address && (
                  <span>IP: {submission.ip_address}</span>
                )}
                {submission.referrer && (
                  <span>From: {submission.referrer}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_submissions || 0}</div>
          <p className="text-xs text-muted-foreground">
            {stats?.this_month.submissions || 0} this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.new_submissions || 0}</div>
          <p className="text-xs text-muted-foreground">
            Require attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.completed_submissions || 0}</div>
          <p className="text-xs text-muted-foreground">
            Successfully handled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics?.average_conversion_rate.toFixed(1) || '0'}%
          </div>
          <p className="text-xs text-muted-foreground">
            Average across all forms
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsChart = () => (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Form Performance</CardTitle>
        <CardDescription>Top performing forms by submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analytics?.top_performing_forms.map((form, index) => (
            <div key={form.form_id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{form.form_name}</p>
                  <p className="text-sm text-gray-500">
                    {form.conversion_rate.toFixed(1)}% conversion rate
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{form.submissions}</p>
                <p className="text-sm text-gray-500">submissions</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms & Submissions</h1>
          <p className="text-gray-600 mt-1">Manage form submissions and track performance</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {renderStatsCards()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="forms">Form Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Form Submissions</CardTitle>
                  <CardDescription>
                    View and manage all form submissions
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={selectedForm}
                    onValueChange={(value) => {
                      setSelectedForm(value);
                      setFilters(prev => ({
                        ...prev,
                        form_id: value === 'all' ? undefined : value
                      }));
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      {forms.map(form => (
                        <SelectItem key={form.id} value={form.id}>
                          {form.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search submissions..."
                    className="w-64"
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map(renderSubmissionCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                  <p className="text-gray-600">
                    {filters.search ? 'Try adjusting your search terms' : 'No form submissions yet'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {renderAnalyticsChart()}
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Trends</CardTitle>
              <CardDescription>Form performance over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.recent_trends.slice(0, 7).map((trend) => (
                  <div key={trend.date} className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {format(new Date(trend.date), 'MMM dd')}
                    </span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{trend.views} views</span>
                      <span>{trend.submissions} submissions</span>
                      <span className="text-green-600">
                        {trend.conversion_rate.toFixed(1)}% conversion
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Form Definitions</CardTitle>
                  <CardDescription>
                    Manage your form templates and configurations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Form
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forms.map(form => (
                  <Card key={form.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{form.name}</CardTitle>
                        <Badge variant={form.is_active ? "default" : "secondary"}>
                          {form.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardDescription>{form.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Fields:</span>
                          <span className="font-medium">{form.fields.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Slug:</span>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {form.slug}
                          </code>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 