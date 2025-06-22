import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  AlertCircle,
  MapPin,
  User,
  Settings,
  MessageSquare,
  Activity,
  CreditCard,
  Archive,
  Trash2,
  Edit,
  Plus,
  Eye,
  File,
  Users,
  Download,
  Upload,
  Send,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import type { Customer, Project } from '@/lib/supabase';
import type { Invoice } from '@/types/billing';

interface CustomerFormData {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  company?: string | null;
  status: 'active' | 'inactive';
  type: 'residential' | 'commercial';
  notes?: string | null;
}

interface ScheduleFormData {
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  type: 'maintenance' | 'installation' | 'repair' | 'inspection';
}

interface NoteFormData {
  content: string;
  type: 'general' | 'billing' | 'support' | 'project';
}

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  
  // Form states
  const [editForm, setEditForm] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    status: 'active',
    type: 'residential',
    notes: ''
  });
  
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    type: 'maintenance'
  });
  
  const [noteForm, setNoteForm] = useState<NoteFormData>({
    content: '',
    type: 'general'
  });

  // Fetch customer data
  const { data: customer, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Customer;
    },
    enabled: !!id
  });

  // Fetch customer projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['customer-projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!id
  });

  // Fetch customer invoices
  const { data: invoices = [], isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['customer-invoices', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', id)
        .order('issue_date', { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!id
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (formData: CustomerFormData) => {
      if (!id) throw new Error('Customer ID not found');
      return await supabaseService.updateCustomer(id, formData);
    },
    onSuccess: () => {
      toast({ title: 'Customer updated successfully!' });
      setEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating customer', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return await supabaseService.createProject(projectData);
    },
    onSuccess: () => {
      toast({ title: 'Project created successfully!' });
      setNewProjectModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['customer-projects', id] });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating project', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });

  // Handle edit customer
  const handleEditCustomer = () => {
    if (customer) {
      setEditForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        company: customer.company || '',
        status: customer.status,
        type: customer.type,
        notes: customer.notes || ''
      });
      setEditModalOpen(true);
    }
  };

  // Handle save customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerMutation.mutate(editForm);
  };

  // Handle create new project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData = {
      name: (e.target as any).projectName.value,
      description: (e.target as any).projectDescription.value,
      customer_id: id,
      status: 'in_progress',
      budget: parseFloat((e.target as any).projectBudget.value) || 0
    };
    createProjectMutation.mutate(projectData);
  };

  // Handle schedule appointment
  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Appointment scheduled successfully!' });
    setScheduleModalOpen(false);
    setScheduleForm({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      type: 'maintenance'
    });
  };

  // Handle upload file
  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'File uploaded successfully!' });
    setUploadModalOpen(false);
  };

  // Handle add note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Note added successfully!' });
    setNoteModalOpen(false);
    setNoteForm({ content: '', type: 'general' });
  };

  // Handle contact customer
  const handleContactCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    
    toast({ 
      title: 'Message sent successfully!',
      description: `Subject: ${subject}`
    });
    setContactModalOpen(false);
  };

  if (isLoadingCustomer) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-steel-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-steel-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Customer Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-steel-600">The customer you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/admin/customers')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      case 'overdue':
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Calculate stats
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const outstandingAmount = invoices.filter(i => i.status !== 'paid').reduce((sum, inv) => sum + (inv.balance_due || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-steel-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/admin/customers')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-steel-900">{customer.name}</h1>
                <p className="text-steel-600">
                  {customer.company && `${customer.company} • `}
                  Customer since {format(new Date(customer.created_at), 'MMM yyyy')}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleEditCustomer}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => setContactModalOpen(true)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button variant="outline" size="sm" onClick={() => setNewProjectModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-steel-900">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-600">Active Projects</p>
                  <p className="text-2xl font-bold text-steel-900">
                    {activeProjects}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-600">Outstanding</p>
                  <p className="text-2xl font-bold text-steel-900">
                    {formatCurrency(outstandingAmount)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-600">Total Projects</p>
                  <p className="text-2xl font-bold text-steel-900">
                    {projects.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-steel-500" />
                    <span className="text-steel-900">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-steel-500" />
                    <span className="text-steel-900">{customer.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-steel-500" />
                    <span className="text-steel-900">{customer.address || 'Not provided'}</span>
                  </div>
                  {customer.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-steel-500" />
                      <span className="text-steel-900">{customer.company}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={customer.type === 'commercial' ? 'default' : 'secondary'}>
                      {customer.type}
                    </Badge>
                    <Badge variant={customer.status === 'active' ? 'default' : 'destructive'}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-steel-500" />
                    <span className="text-steel-900">
                      Customer since {format(new Date(customer.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-steel-500" />
                    <span className="text-steel-900">
                      Last updated {format(new Date(customer.updated_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {customer.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-steel-600">{customer.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-steel-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-steel-500" />
                          <div>
                            <p className="font-medium text-steel-900">{project.name}</p>
                            <p className="text-sm text-steel-600">
                              {format(new Date(project.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
              <Button onClick={() => setNewProjectModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            {isLoadingProjects ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-steel-600">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <Badge variant={getStatusBadgeVariant(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardDescription>
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-steel-600">Created</span>
                          <span className="text-steel-900">
                            {format(new Date(project.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        {project.budget && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-steel-600">Budget</span>
                            <span className="text-steel-900 font-medium">
                              {formatCurrency(project.budget)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/admin/projects/${project.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-steel-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-steel-900 mb-2">No Projects Yet</h3>
                  <p className="text-steel-600 mb-4">This customer hasn't had any projects yet.</p>
                  <Button onClick={() => setNewProjectModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Billing & Invoices</h2>
              <Button onClick={() => navigate('/admin/billing')}>
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>

            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-steel-600">Total Invoices</p>
                    <p className="text-2xl font-bold text-steel-900">{invoices.length}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-steel-600">Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter(i => i.status === 'paid').length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-steel-600">Outstanding</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(outstandingAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-steel-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-steel-900">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoices Table */}
            {isLoadingInvoices ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-steel-600">Loading invoices...</p>
              </div>
            ) : invoices.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(invoice.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-steel-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-steel-900 mb-2">No Invoices Yet</h3>
                  <p className="text-steel-600 mb-4">This customer hasn't been invoiced yet.</p>
                  <Button onClick={() => navigate('/admin/billing')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Invoice
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Schedule & Appointments</h2>
              <Button onClick={() => setScheduleModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>

            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-steel-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-steel-900 mb-2">No Scheduled Appointments</h3>
                <p className="text-steel-600 mb-4">This customer has no upcoming appointments.</p>
                <Button onClick={() => setScheduleModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Files & Attachments</h2>
              <Button onClick={() => setUploadModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            <Card>
              <CardContent className="text-center py-8">
                <File className="w-12 h-12 text-steel-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-steel-900 mb-2">No Files Uploaded</h3>
                <p className="text-steel-600 mb-4">This customer has no uploaded files yet.</p>
                <Button onClick={() => setUploadModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First File
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notes & Comments</h2>
              <Button onClick={() => setNoteModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>

            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-steel-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-steel-900 mb-2">No Notes Yet</h3>
                <p className="text-steel-600 mb-4">No notes have been added for this customer.</p>
                <Button onClick={() => setNoteModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Note
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Customer Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <Input 
                    value={editForm.name} 
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <Input 
                    type="email"
                    value={editForm.email} 
                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={editForm.phone || ''} 
                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value || null }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input 
                    value={editForm.company || ''} 
                    onChange={e => setEditForm(f => ({ ...f, company: e.target.value || null }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={editForm.type}
                    onChange={e => setEditForm(f => ({ ...f, type: e.target.value as 'residential' | 'commercial' }))}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={editForm.status}
                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value as 'active' | 'inactive' }))}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Textarea 
                  value={editForm.address || ''} 
                  onChange={e => setEditForm(f => ({ ...f, address: e.target.value || null }))}
                  rows={2}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  value={editForm.notes || ''} 
                  onChange={e => setEditForm(f => ({ ...f, notes: e.target.value || null }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateCustomerMutation.isPending}>
                  {updateCustomerMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Contact Customer Modal */}
        <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Contact Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContactCustomer} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input name="subject" required />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea name="message" rows={4} required />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setContactModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* New Project Modal */}
        <Dialog open={newProjectModalOpen} onOpenChange={setNewProjectModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name *</label>
                <Input name="projectName" required />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea name="projectDescription" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Budget</label>
                <Input name="projectBudget" type="number" step="0.01" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNewProjectModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createProjectMutation.isPending}>
                  {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Schedule Appointment Modal */}
        <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleScheduleAppointment} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input 
                  value={scheduleForm.title}
                  onChange={e => setScheduleForm(f => ({ ...f, title: e.target.value }))}
                  required 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={scheduleForm.description}
                  onChange={e => setScheduleForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Time *</label>
                  <Input 
                    type="datetime-local"
                    value={scheduleForm.start_time}
                    onChange={e => setScheduleForm(f => ({ ...f, start_time: e.target.value }))}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Time *</label>
                  <Input 
                    type="datetime-local"
                    value={scheduleForm.end_time}
                    onChange={e => setScheduleForm(f => ({ ...f, end_time: e.target.value }))}
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={scheduleForm.type}
                  onChange={e => setScheduleForm(f => ({ ...f, type: e.target.value as any }))}
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="installation">Installation</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Schedule Appointment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Upload File Modal */}
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload File</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUploadFile} className="space-y-4">
              <div>
                <label className="text-sm font-medium">File</label>
                <Input type="file" required />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Note Modal */}
        <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={noteForm.type}
                  onChange={e => setNoteForm(f => ({ ...f, type: e.target.value as any }))}
                >
                  <option value="general">General</option>
                  <option value="billing">Billing</option>
                  <option value="support">Support</option>
                  <option value="project">Project</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Note *</label>
                <Textarea 
                  value={noteForm.content}
                  onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))}
                  rows={4}
                  required 
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setNoteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 