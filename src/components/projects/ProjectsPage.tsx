import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectHeader } from './ProjectHeader';
import { ProjectFilters } from './ProjectFilters';
import { ProjectsList } from './ProjectsList';
import { ProjectForm } from './ProjectForm';
import type { Project } from '@/lib/supabase';

type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';

const ProjectsPage: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use AuthContext instead of local auth state
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      if (!loading) {  // Only set loading if we're not already loading
        setLoading(true);
      }
      console.log('Fetching projects...');
      
      // Call getProjects directly - it has its own connection test
      const data = await supabaseService.getProjects();
      
      console.log('Projects list updated:', {
        count: data?.length || 0,
        projects: data,
        timestamp: new Date().toISOString()
      });
      
      setProjects(data || []);
      
      // Log the current state after setting the data
      console.log('Current projects state:', {
        allProjects: data?.length || 0,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please refresh the page.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter projects
  useEffect(() => {
    console.log('Filtering projects:', {
      totalProjects: projects.length,
      status,
      search
    });
    
    let filtered = projects;

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(project => project.status === status);
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower))
      );
    }

    console.log('Filtered results:', {
      filteredCount: filtered.length,
      filters: { status, search },
      timestamp: new Date().toISOString()
    });

    setFilteredProjects(filtered);
  }, [projects, status, search]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handlers
  const handleCreateNew = () => {
    if (authLoading) {
      toast({
        title: 'Loading',
        description: 'Please wait while we verify your authentication...',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create projects.',
        variant: 'destructive'
      });
      return;
    }
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEdit = (project: Project) => {
    if (authLoading) {
      toast({
        title: 'Loading',
        description: 'Please wait while we verify your authentication...',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to edit projects.',
        variant: 'destructive'
      });
      return;
    }
    setEditingProject(project);
    setShowForm(true);
  };

  const handleView = (project: Project) => {
    navigate(`/admin/projects/${project.id}`);
  };

  const handleFormSuccess = async () => {
    console.log('Form success handler triggered');
    setShowForm(false);
    setEditingProject(null);
    
    // Add a small delay to ensure the server has processed the change
    console.log('Waiting for server processing...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fetch fresh data
    console.log('Fetching updated project list...');
    try {
      await fetchProjects();
      
      toast({
        title: 'Success',
        description: 'Project list has been updated'
      });
    } catch (error) {
      console.error('Error refreshing projects:', error);
      toast({
        title: 'Warning',
        description: 'Project was saved but the list may not be up to date. Please refresh the page.',
        variant: 'destructive'
      });
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredProjects.map(p => p.id) : []);
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    
    if (authLoading) {
      toast({
        title: 'Loading',
        description: 'Please wait while we verify your authentication...',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete projects.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      await Promise.all(selectedIds.map(id => supabaseService.deleteProject(id)));
      toast({ title: 'Success', description: 'Projects deleted successfully' });
      setSelectedIds([]);
      await fetchProjects();
    } catch (error: any) {
      console.error('Error deleting projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete projects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steel-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Show loading while auth is being checked */}
        {authLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-steel-600">Verifying authentication...</p>
            </div>
          </div>
        )}

        {/* Main content - only show when not loading auth */}
        {!authLoading && (
          <>
            {/* Header */}
            <ProjectHeader
              selectedCount={selectedIds.length}
              onCreateNew={handleCreateNew}
              onBulkDelete={handleBulkDelete}
              loading={loading}
            />

            {/* Filters */}
            <ProjectFilters
              status={status}
              search={search}
              onStatusChange={setStatus}
              onSearchChange={setSearch}
            />

            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-lg border p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
                  <p>Loading projects...</p>
                </div>
              </div>
            ) : (
              /* Projects List */
              <ProjectsList
                projects={filteredProjects}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onView={handleView}
                onEdit={handleEdit}
                loading={false}
              />
            )}

            {/* Create/Edit Project Modal */}
            <Dialog open={showForm} onOpenChange={(open) => !open && handleFormCancel()}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject ? 'Update the project details below.' : 'Fill in the project information to create a new project.'}
                  </DialogDescription>
                </DialogHeader>
                <ProjectForm
                  project={editingProject}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
