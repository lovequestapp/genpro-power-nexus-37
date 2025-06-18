
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon, EditIcon, EyeIcon } from 'lucide-react';
import type { Project } from '@/lib/supabase';

interface ProjectsListProps {
  projects: Project[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  loading?: boolean;
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'default';
    case 'in_progress': return 'secondary';
    case 'planned': return 'outline';
    case 'archived': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'secondary';
  }
};

const formatCurrency = (amount: number | null) => {
  if (!amount) return '-';
  return `$${Number(amount).toLocaleString()}`;
};

const formatDate = (date: string | null) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
};

export function ProjectsList({
  projects,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onView,
  onEdit,
  loading = false
}: ProjectsListProps) {
  const allSelected = selectedIds.length === projects.length && projects.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-steel-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                aria-label="Select all projects"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-steel-300"
              />
            </TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow 
              key={project.id} 
              className={`transition-colors hover:bg-steel-50 ${
                selectedIds.includes(project.id) ? 'bg-orange-50' : ''
              }`}
            >
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Select project ${project.name}`}
                  checked={selectedIds.includes(project.id)}
                  onChange={() => onToggleSelect(project.id)}
                  className="rounded border-steel-300"
                />
              </TableCell>
              <TableCell>
                <div>
                  <button
                    className="font-medium text-steel-900 hover:text-orange-600 transition-colors text-left"
                    onClick={() => onView(project)}
                  >
                    {project.name}
                  </button>
                  {project.description && (
                    <p className="text-sm text-steel-500 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(project.status)} className="capitalize">
                  {project.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-steel-600">
                  {project.owner_id ? `Owner ${project.owner_id.slice(0, 8)}...` : 'Not assigned'}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-medium text-steel-900">
                  {formatCurrency(project.budget)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-steel-600">
                  {formatDate(project.start_date)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-steel-600">
                  {formatDate(project.created_at)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onView(project)}
                    className="h-8 w-8 p-0"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(project)}
                    className="h-8 w-8 p-0"
                  >
                    <EditIcon className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="text-center">
                  <p className="text-steel-500 mb-4">No projects found</p>
                  <p className="text-sm text-steel-400">Start by creating your first project</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
