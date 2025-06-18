import React, { useEffect, useMemo, useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { toast } from '@/components/ui/use-toast';
import { PlusIcon, MoreVerticalIcon, SearchIcon } from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import type { Database } from '@/lib/supabase';

type Project = Database['public']['Tables']['projects']['Row'] & {
  owner: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
};

// Define ProjectStatus and ProjectFormValues inline if not available in dashboard.ts
type ProjectStatus = Database['public']['Tables']['projects']['Row']['status'];
type ProjectFormValues = Database['public']['Tables']['projects']['Insert'];
type ProjectActivity = Database['public']['Tables']['project_notes']['Row'] & {
  actor: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
};
type ProjectComment = Database['public']['Tables']['project_comments']['Row'] & {
  author: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
};

// Statuses for filtering
const STATUS_TABS: { label: string; value: ProjectStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Archived', value: 'archived' },
];

// ErrorBoundary for catching runtime errors
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return <div className="p-4 text-red-600">Error: {this.state.error.message || String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

const ProjectsPage: React.FC = () => {
  // State
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // Fetch initial projects (fallback for SSR or first load)
  useEffect(() => {
    setLoading(true);
    supabaseService
      .getProjects()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesStatus = status === 'all' ? true : p.status === status;
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [projects, status, search]);

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    setLoading(true);
    try {
      await Promise.all(selectedIds.map(id => supabaseService.deleteProject(id)));
      toast({ title: 'Projects deleted' });
      setSelectedIds([]);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Table row selection
  const toggleSelect = (id: string) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  };

  // Quick actions
  const handleEdit = (project: Project) => {
    setEditProject(project);
    setShowForm(true);
  };
  const handleView = (project: Project) => setSelected(project);

  // Render
  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-steel-600">Manage all projects in real time.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        {/* Status Tabs & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Tabs value={status} onValueChange={v => setStatus(v as ProjectStatus | 'all') }>
            <TabsList>
              {STATUS_TABS.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
            <Input
              className="pl-10"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search projects"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex gap-2 items-center">
            <span>{selectedIds.length} selected</span>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={loading}>
              Delete
            </Button>
          </div>
        )}

        {/* Error/Loading */}
        {error && <div className="text-red-600">{error}</div>}
        {loading && <div>Loading...</div>}

        {/* Projects Table */}
        <Card className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={e => setSelectedIds(e.target.checked ? filtered.map(p => p.id) : [])}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(project => (
                <TableRow key={project.id} className={selectedIds.includes(project.id) ? 'bg-accent/10' : ''}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select project ${project.name}`}
                      checked={selectedIds.includes(project.id)}
                      onChange={() => toggleSelect(project.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <button
                      className="font-medium text-left hover:underline"
                      onClick={() => handleView(project)}
                    >
                      {project.name}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      project.status === 'completed' ? 'default' :
                      project.status === 'in_progress' ? 'secondary' :
                      project.status === 'archived' ? 'outline' :
                      project.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.owner?.full_name || '-'}</TableCell>
                  <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="icon" variant="ghost" aria-label="View" onClick={() => handleView(project)}>
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => handleEdit(project)}>
                        ✏️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-steel-500">No projects found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Project Form Modal */}
        <Dialog open={showForm} onOpenChange={v => { setShowForm(v); if (!v) setEditProject(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editProject ? 'Edit Project' : 'New Project'}</DialogTitle>
            </DialogHeader>
            <ProjectForm
              initial={editProject}
              onSuccess={() => { setShowForm(false); setEditProject(null); }}
            />
          </DialogContent>
        </Dialog>

        {/* Project Detail Drawer */}
        <Drawer open={!!selected} onOpenChange={v => { if (!v) setSelected(null); }}>
          <DrawerContent className="max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Project Details</DrawerTitle>
            </DrawerHeader>
            {selected && <ProjectDetail project={selected} />}
          </DrawerContent>
        </Drawer>
      </div>
    </ErrorBoundary>
  );
};

// --- ProjectForm ---
type ProjectFormProps = {
  initial?: Project | null;
  onSuccess: () => void;
};
const ProjectForm: React.FC<ProjectFormProps> = ({ initial, onSuccess }) => {
  const [values, setValues] = useState<ProjectFormValues>(initial ? {
    name: initial.name,
    description: initial.description,
    status: initial.status,
    owner_id: initial.owner_id,
  } : {
    name: '',
    description: '',
    status: 'in_progress' as const,
    owner_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initial) {
        await supabaseService.updateProject(initial.id, values);
        toast({ title: 'Project updated' });
      } else {
        await supabaseService.createProject(values);
        toast({ title: 'Project created' });
      }
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="w-full border rounded p-2"
          value={values.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          className="w-full border rounded p-2"
          value={values.status}
          onChange={handleChange}
        >
          <option value="in_progress">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="owner_id">Owner ID</label>
        <Input
          id="owner_id"
          name="owner_id"
          value={values.owner_id}
          onChange={handleChange}
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initial ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
};

// --- ProjectDetail ---
type ProjectDetailProps = { project: Project };
const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [activity, setActivity] = useState<ProjectActivity[]>([]);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabaseService.getProjectNotes(project.id),
      supabaseService.getProjectComments(project.id),
    ])
      .then(([a, c]) => {
        setActivity(a);
        setComments(c);
      })
      .finally(() => setLoading(false));
  }, [project.id]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">{project.name}</h2>
        <p className="text-steel-600 mb-2">{project.description}</p>
        <Badge variant={
          project.status === 'completed' ? 'default' :
          project.status === 'in_progress' ? 'secondary' :
          project.status === 'archived' ? 'outline' :
          project.status === 'cancelled' ? 'destructive' : 'secondary'
        }>
          {project.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Activity Feed</h3>
        <ul className="space-y-2">
          {activity.map(a => (
            <li key={a.id} className="text-sm text-steel-700">
              <span className="font-medium">{a.actor.full_name}</span> {a.action} <span className="text-steel-500">{new Date(a.timestamp).toLocaleString()}</span>
            </li>
          ))}
          {activity.length === 0 && <li className="text-steel-400">No activity yet.</li>}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-1">Comments</h3>
        <ul className="space-y-2">
          {comments.map(c => (
            <li key={c.id} className="text-sm">
              <span className="font-medium">{c.author.full_name}</span>: {c.content}
              <span className="ml-2 text-xs text-steel-400">{new Date(c.created_at).toLocaleString()}</span>
            </li>
          ))}
          {comments.length === 0 && <li className="text-steel-400">No comments yet.</li>}
        </ul>
      </div>
    </div>
  );
};

export default ProjectsPage; 