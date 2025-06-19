import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Clock, 
  User, 
  Edit, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { ProjectAuditLog } from '@/types/dashboard';
import { format } from 'date-fns';

interface ProjectAuditTrailProps {
  projectId: string;
  projectName: string;
}

interface FilterOptions {
  action: string;
  user: string;
  dateRange: string;
  search: string;
}

export function ProjectAuditTrail({ projectId, projectName }: ProjectAuditTrailProps) {
  const [auditLogs, setAuditLogs] = useState<ProjectAuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ProjectAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    action: 'all',
    user: 'all',
    dateRange: 'all',
    search: ''
  });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchAuditLogs();
    fetchUsers();
  }, [projectId]);

  useEffect(() => {
    applyFilters();
  }, [auditLogs, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const logs = await supabaseService.getProjectAuditLog(projectId);
      setAuditLogs(logs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const staff = await supabaseService.getStaff();
      setUsers(staff);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditLogs];

    // Filter by action
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Filter by user
    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.user_id === filters.user);
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const logDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(log => {
            logDate.setTime(new Date(log.created_at).getTime());
            return logDate.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => new Date(log.created_at) >= weekAgo);
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => new Date(log.created_at) >= monthAgo);
          break;
      }
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchLower) ||
        log.field_name?.toLowerCase().includes(searchLower) ||
        log.old_value?.toLowerCase().includes(searchLower) ||
        log.new_value?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'field_updated':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'project_created':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'project_deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'milestone_completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'status_changed':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'field_updated':
        return 'border-blue-200 bg-blue-50';
      case 'project_created':
        return 'border-green-200 bg-green-50';
      case 'project_deleted':
        return 'border-red-200 bg-red-50';
      case 'milestone_completed':
        return 'border-green-200 bg-green-50';
      case 'status_changed':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'field_updated':
        return 'Field Updated';
      case 'project_created':
        return 'Project Created';
      case 'project_deleted':
        return 'Project Deleted';
      case 'milestone_completed':
        return 'Milestone Completed';
      case 'status_changed':
        return 'Status Changed';
      default:
        return action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getUserName = (userId: string | undefined) => {
    if (!userId) return 'System';
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : 'Unknown User';
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Field', 'Old Value', 'New Value'].join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        getActionLabel(log.action),
        getUserName(log.user_id),
        log.field_name || '',
        log.old_value || '',
        log.new_value || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${projectName}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit Trail</CardTitle>
          <Button variant="outline" size="sm" onClick={exportAuditLog}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search audit logs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.action}
            onValueChange={(value) => setFilters({ ...filters, action: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="field_updated">Field Updated</SelectItem>
              <SelectItem value="project_created">Project Created</SelectItem>
              <SelectItem value="status_changed">Status Changed</SelectItem>
              <SelectItem value="milestone_completed">Milestone Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.user}
            onValueChange={(value) => setFilters({ ...filters, user: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filters.dateRange}
            onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-steel-300" />
              <p>No audit logs found</p>
              <p className="text-sm">Project activity will appear here</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className={`relative flex gap-4 p-4 rounded-lg border ${getActionColor(log.action)}`}>
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-steel-200 flex items-center justify-center">
                  {getActionIcon(log.action)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-steel-900">{getActionLabel(log.action)}</h4>
                      {log.field_name && (
                        <p className="text-sm text-steel-600 mt-1">
                          Field: <span className="font-medium">{log.field_name}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-steel-500">
                      <span>{getRelativeTime(log.created_at)}</span>
                      <span>•</span>
                      <span>{format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>

                  {/* Change details */}
                  {(log.old_value || log.new_value) && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.old_value && (
                          <div>
                            <p className="text-xs font-medium text-steel-500 mb-1">Previous Value</p>
                            <p className="text-sm text-steel-700 bg-red-50 p-2 rounded">
                              {log.old_value}
                            </p>
                          </div>
                        )}
                        {log.new_value && (
                          <div>
                            <p className="text-xs font-medium text-steel-500 mb-1">New Value</p>
                            <p className="text-sm text-steel-700 bg-green-50 p-2 rounded">
                              {log.new_value}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User info */}
                  <div className="flex items-center gap-2 mt-3 text-xs text-steel-500">
                    <User className="w-3 h-3" />
                    <span>{getUserName(log.user_id)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Summary */}
        {filteredLogs.length > 0 && (
          <div className="mt-6 p-4 bg-steel-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-steel-600">
                Showing {filteredLogs.length} of {auditLogs.length} audit entries
              </span>
              <span className="text-steel-500">
                Last updated: {auditLogs.length > 0 ? getRelativeTime(auditLogs[0].created_at) : 'Never'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 