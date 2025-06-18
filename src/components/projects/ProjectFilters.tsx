
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

type ProjectStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'archived';

interface ProjectFiltersProps {
  status: ProjectStatus | 'all';
  search: string;
  onStatusChange: (status: ProjectStatus | 'all') => void;
  onSearchChange: (search: string) => void;
}

const STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Planned', value: 'planned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Archived', value: 'archived' },
] as const;

export function ProjectFilters({
  status,
  search,
  onStatusChange,
  onSearchChange
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-lg border">
      <Tabs value={status} onValueChange={onStatusChange} className="w-full md:w-auto">
        <TabsList className="grid w-full grid-cols-6 md:w-auto">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="text-xs md:text-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="relative w-full md:w-80">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
        <Input
          className="pl-10"
          placeholder="Search projects by name or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
