
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase';
import { ProjectHeader } from './ProjectHeader';
import { ProjectFilters } from './ProjectFilters';
import { ProjectsList } from './ProjectsList';
import { ProjectForm } from './ProjectForm';
import { ProjectDetail } from './ProjectDetail';
import type { Project } from '@/lib/supabase';

type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';

const ProjectsPage: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Check authentication
  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Auth error:', error);
        toast({
          title: 'Authentication Error',
          description: 'Please log in to access projects.',
          variant: 'destructive'
        });
        return false;
      }
      
      if (!user) {
        toast({
          title: 'Not Authenticated',
          description: 'Please log in to access projects.',
          variant: 'destructive'
        });
        return false;
      }
      
      setUser(user);
      console.log('User authenticated:', user.id);
      return true;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  };

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase.from('projects').select('count', { count: 'exact' });
      if (error) {
        console.error('Supabase connection test failed:', error);
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to database. Please refresh the page.',
          variant: 'destructive'
        });
        return false;
      } else {
        console.log('Supabase connection successful. Project count:', data);
        return true;
      }
    } catch (error) {
      console.error('Supabase connection test error:', error);
      return false;
    }
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects...');
      
      // Check authentication first
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      // Test connection
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        setLoading(false);
        return;
      }
      
      const data = await supabaseService.getProjects();
      console.log('Projects fetched successfully:', data?.length || 0);
      setProjects(data || []);
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

    setFilteredProjects(filtered);
  }, [projects, status, search]);

  // Initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handlers
  const handleCreateNew = () => {
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
    setSelectedProject(project);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
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

        {/* Projects List */}
        <ProjectsList
          projects={filteredProjects}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onView={handleView}
          onEdit={handleEdit}
          loading={loading}
        />

        {/* Create/Edit Project Modal */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm
              project={editingProject}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>

        {/* Project Detail Drawer */}
        <Drawer open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DrawerContent className="max-w-4xl mx-auto">
            <DrawerHeader>
              <DrawerTitle>Project Details</DrawerTitle>
            </DrawerHeader>
            {selectedProject && <ProjectDetail project={selectedProject} />}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default ProjectsPage;
