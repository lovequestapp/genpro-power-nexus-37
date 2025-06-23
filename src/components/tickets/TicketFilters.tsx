import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface TicketFiltersProps {
  onFilterChange: (filters: any) => void;
  onSortChange: (sort: string) => void;
  onSearch: (search: string) => void;
}

export function TicketFilters({ onFilterChange, onSortChange, onSearch }: TicketFiltersProps) {
  const [filters, setFilters] = React.useState({
    status: 'all',
    priority: 'all',
    type: 'all',
    search: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    onSearch(value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      priority: 'all',
      type: 'all',
      search: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onSearch('');
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.type !== 'all' || 
                          filters.search !== '';

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at_desc">Newest First</SelectItem>
                <SelectItem value="created_at_asc">Oldest First</SelectItem>
                <SelectItem value="priority_desc">Priority (High-Low)</SelectItem>
                <SelectItem value="priority_asc">Priority (Low-High)</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.status !== 'all' && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Status: {filters.status}
              </span>
            )}
            {filters.priority !== 'all' && (
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Priority: {filters.priority}
              </span>
            )}
            {filters.type !== 'all' && (
              <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                Type: {filters.type}
              </span>
            )}
            {filters.search && (
              <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Search: "{filters.search}"
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 