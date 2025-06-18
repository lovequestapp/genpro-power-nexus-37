
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/supabase';

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
};

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'planned',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    budget: project?.budget ? String(project.budget) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    setLoading(true);
    
    try {
      console.log('Starting project save process...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Unable to verify user authentication');
      }
      
      if (!user) {
        throw new Error('You must be logged in to create projects');
      }

      console.log('Current user:', user.id);

      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget: formData.budget ? Number(formData.budget) : null,
        owner_id: user.id, // This is required by the database
      };

      console.log('Project data to save:', projectData);

      let result;
      if (project) {
        // Update existing project
        console.log('Updating project with ID:', project.id);
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id)
          .select()
          .single();
      } else {
        // Create new project
        console.log('Creating new project...');
        result = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Project saved successfully:', data);
      toast({ 
        title: 'Success', 
        description: project ? 'Project updated successfully' : 'Project created successfully'
      });
      
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

        <div>
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value)}
            disabled={loading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
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

        <div>
          <Label htmlFor="budget" className="text-sm font-medium">
            Budget ($)
          </Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={formData.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            placeholder="0.00"
            className="mt-1"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-orange-600 hover:bg-orange-700"
        >
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}
