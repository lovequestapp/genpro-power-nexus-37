
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface ProjectHeaderProps {
  selectedCount: number;
  onCreateNew: () => void;
  onBulkDelete: () => void;
  loading?: boolean;
}

export function ProjectHeader({
  selectedCount,
  onCreateNew,
  onBulkDelete,
  loading = false
}: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-steel-900">Projects</h1>
          <p className="text-steel-600 mt-1">Manage and track all your projects</p>
        </div>
        <Button onClick={onCreateNew} className="bg-orange-600 hover:bg-orange-700">
          <PlusIcon className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <span className="text-sm font-medium text-steel-700">
            {selectedCount} project{selectedCount === 1 ? '' : 's'} selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={onBulkDelete}
            disabled={loading}
            className="ml-auto"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
}
