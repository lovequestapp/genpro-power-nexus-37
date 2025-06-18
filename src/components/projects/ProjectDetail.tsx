
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, DollarSignIcon, UserIcon, ClockIcon } from 'lucide-react';
import type { Project } from '@/lib/supabase';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-steel-900 mb-2">{project.name}</h2>
        <p className="text-steel-600 mb-4">
          {project.description || 'No description provided'}
        </p>
        <Badge variant={getStatusBadgeVariant(project.status)} className="capitalize">
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Start Date</p>
              <p className="text-steel-900">{formatDate(project.start_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">End Date</p>
              <p className="text-steel-900">{formatDate(project.end_date)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <DollarSignIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Budget</p>
              <p className="text-steel-900 font-semibold">{formatCurrency(project.budget)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-steel-50 rounded-lg">
            <UserIcon className="w-5 h-5 text-steel-500" />
            <div>
              <p className="text-sm font-medium text-steel-700">Customer</p>
              <p className="text-steel-900">
                {project.customer_id ? `Customer ${project.customer_id.slice(0, 8)}...` : 'Not assigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Info */}
      {project.has_generator && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-steel-900 mb-2">Generator Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-steel-600">Generator ID:</span>
              <span className="ml-2 text-steel-900">
                {project.generator_id ? project.generator_id.slice(0, 8) + '...' : 'Not assigned'}
              </span>
            </div>
            <div>
              <span className="text-steel-600">Status:</span>
              <span className="ml-2 text-steel-900 capitalize">
                {project.generator_status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="pt-4 border-t border-steel-200">
        <div className="flex items-center gap-3 text-sm text-steel-500">
          <ClockIcon className="w-4 h-4" />
          <span>
            Created {formatDate(project.created_at)} • 
            Updated {formatDate(project.updated_at)}
          </span>
        </div>
        <p className="text-xs text-steel-400 mt-1">Project ID: {project.id}</p>
      </div>
    </div>
  );
}
