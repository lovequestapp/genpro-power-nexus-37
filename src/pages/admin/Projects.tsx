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

// Simulated data
const projects: Project[] = [
  {
    id: '1',
    title: 'Generac 22KW Installation',
    customerId: 'CUST001',
    customerName: 'John & Sarah Miller',
    status: 'in-progress',
    type: 'installation',
    progress: 65,
    startDate: '2024-06-10',
    dueDate: '2024-06-15',
    budget: 12500,
    cost: 8000,
    profit: 4500,
    assignedTechnicians: [
      {
        id: 'TECH001',
        name: 'Mike Johnson',
        email: 'mike@hougenpros.com',
        phone: '555-0101',
        role: 'lead',
        specializations: ['Installation', 'Repair'],
        availability: 'assigned',
        completedProjects: 156,
        rating: 4.9,
        certifications: [],
      },
      {
        id: 'TECH002',
        name: 'David Chen',
        email: 'david@hougenpros.com',
        phone: '555-0102',
        role: 'assistant',
        specializations: ['Installation'],
        availability: 'assigned',
        completedProjects: 89,
        rating: 4.7,
        certifications: [],
      },
    ],
    equipmentUsed: [
      {
        id: 'EQ001',
        name: 'Generac 22KW Generator',
        category: 'generator',
        model: '22KW',
        manufacturer: 'Generac',
        quantity: 1,
        minQuantity: 1,
        price: 8000,
        cost: 6000,
        location: 'Warehouse A',
        status: 'in-stock',
        lastRestocked: '2024-06-01',
        supplier: {
          id: 'SUP001',
          name: 'Generac Direct',
          contact: {
            name: 'John Smith',
            email: 'john@generac.com',
            phone: '555-0001',
          },
          address: '123 Generator St, Houston, TX',
          items: [],
          rating: 4.8,
          terms: 'Net 30',
          lastOrderDate: '2024-06-01',
          totalOrders: 45,
        },
      },
      {
        id: 'EQ002',
        name: 'Transfer Switch Kit',
        category: 'part',
        model: 'TS-200',
        manufacturer: 'Generac',
        quantity: 1,
        minQuantity: 2,
        price: 1200,
        cost: 900,
        location: 'Warehouse B',
        status: 'in-stock',
        lastRestocked: '2024-06-01',
        supplier: {
          id: 'SUP001',
          name: 'Generac Direct',
          contact: {
            name: 'John Smith',
            email: 'john@generac.com',
            phone: '555-0001',
          },
          address: '123 Generator St, Houston, TX',
          items: [],
          rating: 4.8,
          terms: 'Net 30',
          lastOrderDate: '2024-06-01',
          totalOrders: 45,
        },
      },
    ],
    notes: [
      {
        id: 'NOTE001',
        projectId: '1',
        author: 'Mike Johnson',
        content: 'Customer requested additional surge protection',
        timestamp: '2024-06-11T10:00:00Z',
        type: 'customer',
      },
    ],
    documents: [
      {
        id: 'DOC001',
        name: 'Installation Quote.pdf',
        type: 'contract',
        url: '#',
        uploadedBy: 'Mike Johnson',
        uploadDate: '2024-06-10',
        size: 1024,
        tags: ['quote', 'installation'],
      },
    ],
    permits: [
      {
        id: 'PERM001',
        projectId: '1',
        type: 'electrical',
        status: 'approved',
        submissionDate: '2024-06-01',
        approvalDate: '2024-06-05',
        expirationDate: '2024-12-05',
        authority: 'City of Houston',
        documents: [],
        notes: ['Standard electrical permit for residential installation'],
      },
    ],
    timeline: [
      {
        id: 'TIMELINE001',
        projectId: '1',
        type: 'milestone',
        title: 'Project Started',
        description: 'Initial site survey completed',
        timestamp: '2024-06-10T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'TIMELINE002',
        projectId: '1',
        type: 'milestone',
        title: 'Equipment Delivered',
        description: 'Generator and accessories arrived on site',
        timestamp: '2024-06-11T14:00:00Z',
        status: 'completed',
      },
    ],
  },
  {
    id: '2',
    title: 'Emergency Repair - Power Outage',
    customerId: 'CUST002',
    customerName: 'Robert Wilson',
    status: 'pending',
    type: 'repair',
    progress: 0,
    startDate: '2024-06-12',
    dueDate: '2024-06-13',
    budget: 3500,
    cost: 0,
    profit: 0,
    assignedTechnicians: [
      {
        id: 'TECH003',
        name: 'Alex Thompson',
        email: 'alex@hougenpros.com',
        phone: '555-0103',
        role: 'lead',
        specializations: ['Repair', 'Emergency'],
        availability: 'available',
        completedProjects: 112,
        rating: 4.8,
        certifications: [],
      },
    ],
    equipmentUsed: [],
    notes: [
      {
        id: 'NOTE002',
        projectId: '2',
        author: 'Alex Thompson',
        content: 'Customer reported complete power loss',
        timestamp: '2024-06-12T08:00:00Z',
        type: 'technical',
      },
    ],
    documents: [],
    permits: [],
    timeline: [
      {
        id: 'TIMELINE003',
        projectId: '2',
        type: 'milestone',
        title: 'Emergency Reported',
        description: 'Customer reported power outage',
        timestamp: '2024-06-12T08:00:00Z',
        status: 'pending',
      },
    ],
  },
  {
    id: '3',
    title: 'Annual Maintenance Check',
    customerId: 'CUST003',
    customerName: 'Emily Thompson',
    status: 'completed',
    type: 'maintenance',
    progress: 100,
    startDate: '2024-06-05',
    dueDate: '2024-06-05',
    budget: 1200,
    cost: 950,
    profit: 250,
    assignedTechnicians: [
      {
        id: 'TECH004',
        name: 'Chris Martinez',
        email: 'chris@hougenpros.com',
        phone: '555-0104',
        role: 'lead',
        specializations: ['Maintenance'],
        availability: 'available',
        completedProjects: 203,
        rating: 4.9,
        certifications: [],
      },
    ],
    equipmentUsed: [],
    notes: [
      {
        id: 'NOTE003',
        projectId: '3',
        author: 'Chris Martinez',
        content: 'All systems functioning properly',
        timestamp: '2024-06-05T15:00:00Z',
        type: 'technical',
      },
    ],
    documents: [
      {
        id: 'DOC002',
        name: 'Maintenance Report.pdf',
        type: 'manual',
        url: '#',
        uploadedBy: 'Chris Martinez',
        uploadDate: '2024-06-05',
        size: 2048,
        tags: ['maintenance', 'report'],
      },
    ],
    permits: [],
    timeline: [
      {
        id: 'TIMELINE004',
        projectId: '3',
        type: 'milestone',
        title: 'Maintenance Started',
        description: 'Annual maintenance check initiated',
        timestamp: '2024-06-05T09:00:00Z',
        status: 'completed',
      },
      {
        id: 'TIMELINE005',
        projectId: '3',
        type: 'milestone',
        title: 'Maintenance Completed',
        description: 'All systems checked and maintained',
        timestamp: '2024-06-05T15:00:00Z',
        status: 'completed',
      },
    ],
  },
];

const Projects = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // Calculate project statistics
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
    totalRevenue: projects.reduce((sum, p) => sum + p.budget, 0),
    totalProfit: projects.reduce((sum, p) => sum + p.profit, 0),
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
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                        View Details
                      </DropdownMenuItem>
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