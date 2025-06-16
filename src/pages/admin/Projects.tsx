import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  WrenchIcon,
  ClockIcon,
  DollarSignIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileIcon,
} from 'lucide-react';
import { Project } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseService } from '@/services/supabase';
import { toast } from '@/components/ui/use-toast';
import type { Ticket } from '@/lib/supabase';

// Fix type and status enums for Ticket
const allowedTypes = ['feature', 'support', 'bug', 'other'] as const;
const allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const;

const Projects = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Ticket | null>(null);
  const [selectedProject, setSelectedProject] = useState<Ticket | null>(null);
  const [form, setForm] = useState<Omit<Ticket, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    description: '',
    status: 'open',
    priority: 'medium',
    type: 'feature',
    customer_id: '',
    assigned_to: '',
    due_date: null,
    resolution: null,
    metadata: null,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects (tickets)
  const { data: projects = [], isLoading } = useQuery<Ticket[]>({ queryKey: ['projects'], queryFn: () => supabaseService.getTickets() });

  // Add or update project
  const mutation = useMutation({
    mutationFn: async (project: Partial<Ticket>) => {
      if (project.id) {
        return supabaseService.updateTicket(project.id, project);
      } else {
        return supabaseService.createTicket(project as Omit<Ticket, 'id' | 'created_at' | 'updated_at'>);
      }
    },
    onSuccess: () => {
      toast({ title: 'Project saved!' });
      setModalOpen(false);
      setEditProject(null);
      setForm({
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
        type: 'feature',
        customer_id: '',
        assigned_to: '',
        due_date: null,
        resolution: null,
        metadata: null,
      });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => toast({ title: 'Error', description: error.message, variant: 'destructive' })
  });

  const filteredProjects = Array.isArray(projects) ? projects.filter((project) => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  }) : [];

  // Calculate project statistics
  const stats = {
    total: filteredProjects.length,
    inProgress: filteredProjects.filter(p => p.status === 'in_progress').length,
    completed: filteredProjects.filter(p => p.status === 'resolved').length,
    pending: filteredProjects.filter(p => p.status === 'open').length,
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-steel-900">
            Projects
          </h1>
          <p className="text-steel-700 mt-1">
            Manage installations, maintenance, and repairs
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <WrenchIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-steel-700">Total Projects</p>
              <h3 className="text-2xl font-bold text-steel-900">
                {stats.total}
              </h3>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-steel-700">In Progress</p>
              <h3 className="text-2xl font-bold text-steel-900">
                {stats.inProgress}
              </h3>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSignIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-steel-700">Total Revenue</p>
              <h3 className="text-2xl font-bold text-steel-900">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-steel-700">Completed</p>
              <h3 className="text-2xl font-bold text-steel-900">
                {stats.completed}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[240px]">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-steel-500" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="installation">Installation</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="inspection">Inspection</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Projects Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-steel-900">
                      {project.title}
                    </div>
                    <div className="text-sm text-steel-500">
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-steel-900">
                      {project.customerName}
                    </span>
                    <span className="text-sm text-steel-500">
                      ID: {project.customerId}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      project.status === 'completed'
                        ? 'default'
                        : project.status === 'in-progress'
                        ? 'secondary'
                        : project.status === 'pending'
                        ? 'outline'
                        : 'destructive'
                    }
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-32">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-steel-500">Progress</span>
                      <span className="font-medium text-steel-700">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-steel-400" />
                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex -space-x-2">
                    {project.assignedTechnicians.map((tech) => (
                      <div
                        key={tech.id}
                        className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-medium text-accent ring-2 ring-white"
                        title={tech.name}
                      >
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedProject(project)}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Update Progress</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  Project ID: {selectedProject.id}
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Project Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-steel-500">Status</span>
                          <Badge
                            variant={
                              selectedProject.status === 'completed'
                                ? 'default'
                                : selectedProject.status === 'in-progress'
                                ? 'secondary'
                                : selectedProject.status === 'pending'
                                ? 'outline'
                                : 'destructive'
                            }
                          >
                            {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-steel-500">Type</span>
                          <span>{selectedProject.type.charAt(0).toUpperCase() + selectedProject.type.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-steel-500">Start Date</span>
                          <span>{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-steel-500">Due Date</span>
                          <span>{new Date(selectedProject.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-semibold mb-2">Financial Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-steel-500">Budget</span>
                          <span>${selectedProject.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-steel-500">Cost</span>
                          <span>${selectedProject.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-steel-500">Profit</span>
                          <span>${selectedProject.profit.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Assigned Technicians</h3>
                    <div className="space-y-2">
                      {selectedProject.assignedTechnicians.map((tech) => (
                        <div key={tech.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-medium text-accent">
                              {tech.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{tech.name}</div>
                              <div className="text-sm text-steel-500">{tech.role}</div>
                            </div>
                          </div>
                          <Badge variant="outline">{tech.specializations.join(', ')}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Equipment Used</h3>
                    <div className="space-y-2">
                      {selectedProject.equipmentUsed.map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between">
                          <span>{equipment.name}</span>
                          <Badge variant="outline">{equipment.category}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="timeline" className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      {selectedProject.timeline.map((event) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <div className="w-0.5 h-full bg-steel-200" />
                          </div>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-steel-500">{event.timestamp}</div>
                            <div className="text-sm mt-1">{event.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="documents" className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-2">
                      {selectedProject.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileIcon className="w-4 h-4 text-steel-500" />
                            <span>{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="notes" className="space-y-4">
                  <Card className="p-4">
                    <div className="space-y-4">
                      {selectedProject.notes.map((note) => (
                        <div key={note.id} className="border-b border-steel-200 pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{note.author}</div>
                              <div className="text-sm text-steel-500">{note.timestamp}</div>
                            </div>
                          </div>
                          <div className="mt-2">{note.content}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects; 