import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Project, Customer, Generator, Profile } from '@/lib/supabase';

interface ProjectFormProps {
  project?: Project | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type ProjectFormData = {
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
  start_date: string;
  end_date: string;
  budget: string;
  customer_id: string;
  generator_id: string;
  assigned_to: string[];
};

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'in_progress',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    budget: project?.budget ? String(project.budget) : '',
    customer_id: project?.customer_id || '',
    generator_id: project?.generator_id || '',
    assigned_to: project?.assigned_to || [],
  });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [technicians, setTechnicians] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Use AuthContext instead of fetching user separately
  const { user } = useAuth();

  // Fetch customers, generators, and technicians
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        console.log('ProjectForm: Fetching customers...');
        const customersData = await supabaseService.getCustomers();
        console.log('ProjectForm: Customers fetched:', customersData?.length || 0);
        setCustomers(customersData || []);

        console.log('ProjectForm: Fetching generators...');
        const generatorsData = await supabaseService.getGenerators();
        console.log('ProjectForm: Generators fetched:', generatorsData?.length || 0);
        setGenerators(generatorsData || []);

        console.log('ProjectForm: Fetching technicians...');
        const techniciansData = await supabaseService.getStaff();
        console.log('ProjectForm: Technicians fetched:', techniciansData?.length || 0);
        setTechnicians(techniciansData || []);
      } catch (error) {
        console.error('Error fetching form data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load form data. Please refresh the page.',
          variant: 'destructive'
        });
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof ProjectFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTechnicianToggle = (technicianId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(technicianId)
        ? prev.assigned_to.filter(id => id !== technicianId)
        : [...prev.assigned_to, technicianId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ 
        title: 'Error', 
        description: 'Project name is required', 
        variant: 'destructive' 
      });
      return;
    }

    if (!user) {
      toast({ 
        title: 'Authentication Error', 
        description: 'You must be logged in to create projects', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    
    try {
      console.log('Starting project save process...');
      
      console.log('Current user:', user.id);

      const projectData: {
        name: string;
        description: string | null;
        status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';
        start_date: string | null;
        end_date: string | null;
        budget: number | null;
        customer_id: string | null;
        generator_id: string | null;
        has_generator: boolean;
        generator_status: 'none' | 'pending' | 'installed' | 'maintenance';
        assigned_to: string[] | null;
      } = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget: formData.budget ? Number(formData.budget) : null,
        customer_id: formData.customer_id || null,
        generator_id: formData.generator_id || null,
        has_generator: !!formData.generator_id,
        generator_status: formData.generator_id ? 'pending' : 'none',
        assigned_to: formData.assigned_to.length > 0 ? formData.assigned_to : null,
      };

      console.log('Project data to save:', projectData);

      let result;
      if (project) {
        // Update existing project
        console.log('Updating project with ID:', project.id);
        result = await supabaseService.updateProject(project.id, projectData);
      } else {
        // Create new project
        console.log('Creating new project...');
        result = await supabaseService.createProject(projectData, user?.id);
      }

      console.log('Project saved successfully:', result);
      
      // Show success message
      toast({ 
        title: 'Success', 
        description: project ? 'Project updated successfully' : 'Project created successfully'
      });
      
      // Small delay to ensure the server has processed the change
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call onSuccess to trigger refresh
      onSuccess();
    } catch (error: any) {
      console.error('Error saving project:', error);
      
      let errorMessage = 'Failed to save project. Please try again.';
      
      if (error?.message?.includes('permission')) {
        errorMessage = 'You do not have permission to create projects. Please contact an administrator.';
      } else if (error?.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error?.message?.includes('auth')) {
        errorMessage = 'Authentication error. Please log in and try again.';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add status options
  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'archived', label: 'Archived' }
  ];

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-steel-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Project Name *
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter project name"
            required
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter project description"
            rows={3}
            className="mt-1"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange('status', value as typeof formData.status)}
              disabled={loading}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget" className="text-sm font-medium">
              Budget
            </Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="Enter budget amount"
              className="mt-1"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date" className="text-sm font-medium">
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleChange('start_date', e.target.value)}
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="end_date" className="text-sm font-medium">
              End Date
            </Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleChange('end_date', e.target.value)}
              className="mt-1"
              disabled={loading}
            />
          </div>
        </div>

        {/* Customer Assignment */}
        <div>
          <Label htmlFor="customer_id" className="text-sm font-medium">
            Customer
          </Label>
          <Select 
            value={formData.customer_id || "unassigned"} 
            onValueChange={(value) => handleChange('customer_id', value === "unassigned" ? "" : value)}
            disabled={loading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">No customer assigned</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} {customer.company && `(${customer.company})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generator Assignment */}
        <div>
          <Label htmlFor="generator_id" className="text-sm font-medium">
            Generator
          </Label>
          <Select 
            value={formData.generator_id || "unassigned"} 
            onValueChange={(value) => handleChange('generator_id', value === "unassigned" ? "" : value)}
            disabled={loading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a generator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">No generator assigned</SelectItem>
              {generators
                .filter(gen => gen.status === 'available' || gen.id === formData.generator_id)
                .map((generator) => (
                  <SelectItem key={generator.id} value={generator.id}>
                    {generator.model} - {generator.serial_number} ({generator.status})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Technician Assignment */}
        <div>
          <Label className="text-sm font-medium">
            Assigned Technicians
          </Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
            {technicians.length === 0 ? (
              <p className="text-sm text-steel-500">No technicians available</p>
            ) : (
              technicians.map((technician) => (
                <label key={technician.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assigned_to.includes(technician.id)}
                    onChange={() => handleTechnicianToggle(technician.id)}
                    disabled={loading}
                    className="rounded border-steel-300"
                  />
                  <span className="text-sm">
                    {technician.full_name} ({technician.role})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
        </Button>
      </div>
    </form>
  );
}
