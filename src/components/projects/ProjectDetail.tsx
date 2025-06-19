import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DollarSignIcon, UserIcon, ClockIcon, WrenchIcon, UsersIcon } from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { ProjectNotes } from './ProjectNotes';
import { ProjectAttachments } from './ProjectAttachments';
import { ProjectTimeline } from './ProjectTimeline';
import { MilestoneManager } from './MilestoneManager';
import { ProjectAuditTrail } from './ProjectAuditTrail';
import { StatusWorkflowManager } from './StatusWorkflowManager';
import type { Project, Customer, Generator, Profile } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface ProjectDetailProps {
  project: Project;
  onProjectUpdate?: (updatedProject: Project) => void;
}

export function ProjectDetail({ project, onProjectUpdate }: ProjectDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [generator, setGenerator] = useState<Generator | null>(null);
  const [technicians, setTechnicians] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState<Project>(project);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        setLoading(true);
        const promises = [];

        // Fetch customer if assigned
        if (project.customer_id) {
          promises.push(
            supabaseService.getCustomer(project.customer_id).catch(() => null)
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        // Fetch generator if assigned
        if (project.generator_id) {
          promises.push(
            supabaseService.getGenerator(project.generator_id).catch(() => null)
          );
        } else {
          promises.push(Promise.resolve(null));
        }

        // Fetch technicians if assigned
        if (project.assigned_to && project.assigned_to.length > 0) {
          promises.push(
            supabaseService.getStaff().then(staff => 
              staff?.filter(tech => project.assigned_to?.includes(tech.id)) || []
            ).catch(() => [])
          );
        } else {
          promises.push(Promise.resolve([]));
        }

        const [customerData, generatorData, techniciansData] = await Promise.all(promises);
        setCustomer(customerData);
        setGenerator(generatorData);
        setTechnicians(techniciansData);
      } catch (error) {
        console.error('Error fetching project details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedData();
  }, [project]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updatedProject = await supabaseService.updateProjectWithAudit(
        currentProject.id,
        { status: newStatus }
      );
      
      setCurrentProject(updatedProject);
      
      if (onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }
      
      toast({
        title: 'Success',
        description: 'Project status updated successfully'
      });
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'archived': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not set';
    return `$${Number(amount).toLocaleString()}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-steel-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-steel-900 mb-2">{currentProject.name}</h2>
        <p className="text-steel-600 mb-4">
          {currentProject.description || 'No description provided'}
        </p>
        <Badge variant={getStatusBadgeVariant(currentProject.status)} className="capitalize">
          {currentProject.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Start Date</p>
              <p className="text-steel-900">{formatDate(currentProject.start_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">End Date</p>
              <p className="text-steel-900">{formatDate(currentProject.end_date)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <DollarSignIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Budget</p>
              <p className="text-steel-900 font-semibold">{formatCurrency(currentProject.budget)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <UserIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Customer</p>
              <p className="text-steel-900">
                {customer ? (
                  <span>
                    {customer.name}
                    {customer.company && ` (${customer.company})`}
                  </span>
                ) : (
                  'Not assigned'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      {customer && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-steel-900 mb-3 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-steel-600">Name:</span>
              <span className="ml-2 text-steel-900 font-medium">{customer.name}</span>
            </div>
            {customer.company && (
              <div>
                <span className="text-steel-600">Company:</span>
                <span className="ml-2 text-steel-900">{customer.company}</span>
              </div>
            )}
            <div>
              <span className="text-steel-600">Email:</span>
              <span className="ml-2 text-steel-900">{customer.email}</span>
            </div>
            {customer.phone && (
              <div>
                <span className="text-steel-600">Phone:</span>
                <span className="ml-2 text-steel-900">{customer.phone}</span>
              </div>
            )}
            <div>
              <span className="text-steel-600">Type:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {customer.type}
              </Badge>
            </div>
            <div>
              <span className="text-steel-600">Status:</span>
              <Badge variant={customer.status === 'active' ? 'default' : 'destructive'} className="ml-2">
                {customer.status}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Generator Information */}
      {generator && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-steel-900 mb-3 flex items-center gap-2">
            <WrenchIcon className="w-4 h-4" />
            Generator Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-steel-600">Model:</span>
              <span className="ml-2 text-steel-900 font-medium">{generator.model}</span>
            </div>
            <div>
              <span className="text-steel-600">Serial Number:</span>
              <span className="ml-2 text-steel-900">{generator.serial_number}</span>
            </div>
            <div>
              <span className="text-steel-600">Power Output:</span>
              <span className="ml-2 text-steel-900">{generator.power_output}W</span>
            </div>
            <div>
              <span className="text-steel-600">Status:</span>
              <Badge variant="outline" className="ml-2 capitalize">
                {generator.status.replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <span className="text-steel-600">Fuel Type:</span>
              <span className="ml-2 text-steel-900 capitalize">
                {generator.fuel_type?.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-steel-600">Location:</span>
              <span className="ml-2 text-steel-900">{generator.location || 'Not specified'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Technicians */}
      {technicians.length > 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-steel-900 mb-3 flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Assigned Technicians ({technicians.length})
          </h3>
          <div className="space-y-2">
            {technicians.map((technician) => (
              <div key={technician.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div>
                  <span className="font-medium text-steel-900">{technician.full_name}</span>
                  <span className="text-sm text-steel-500 ml-2">({technician.role})</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {technician.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase 3 Features - Status Workflow */}
      <StatusWorkflowManager
        projectId={currentProject.id}
        currentStatus={currentProject.status}
        onStatusChange={handleStatusChange}
      />

      {/* Enhanced Tabs Section */}
      <Tabs defaultValue="milestones" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="milestones" className="mt-6">
          <MilestoneManager 
            projectId={currentProject.id} 
            projectName={currentProject.name} 
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline project={currentProject} />
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <ProjectAuditTrail 
            projectId={currentProject.id} 
            projectName={currentProject.name} 
          />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-6">
          <ProjectNotes projectId={currentProject.id} />
        </TabsContent>
        
        <TabsContent value="attachments" className="mt-6">
          <ProjectAttachments projectId={currentProject.id} />
        </TabsContent>
      </Tabs>

      {/* Timestamps */}
      <div className="pt-4 border-t border-steel-200">
        <div className="flex items-center gap-3 text-sm text-steel-500">
          <ClockIcon className="w-4 h-4" />
          <span>
            Created {formatDate(currentProject.created_at)} • 
            Updated {formatDate(currentProject.updated_at)}
          </span>
        </div>
        <p className="text-xs text-steel-400 mt-1">Project ID: {currentProject.id}</p>
      </div>
    </div>
  );
}
