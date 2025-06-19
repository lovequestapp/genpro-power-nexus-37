import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle, User, Calendar as CalendarIcon2 } from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { Milestone, ProjectProgress } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MilestoneManagerProps {
  projectId: string;
  projectName: string;
}

interface MilestoneFormData {
  title: string;
  description: string;
  due_date: string;
  assigned_to: string;
  priority: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export function MilestoneManager({ projectId, projectName }: MilestoneManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState<MilestoneFormData>({
    title: '',
    description: '',
    due_date: '',
    assigned_to: '',
    priority: 'medium',
    dependencies: []
  });
  const [technicians, setTechnicians] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMilestones();
    fetchTechnicians();
  }, [projectId]);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const [milestonesData, progressData] = await Promise.all([
        supabaseService.getMilestones(projectId),
        supabaseService.calculateProjectProgress(projectId)
      ]);
      
      setMilestones(milestonesData);
      setProgress(progressData);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: 'Error',
        description: 'Failed to load milestones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const staff = await supabaseService.getStaff();
      setTechnicians(staff);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMilestone) {
        await supabaseService.updateMilestone(editingMilestone.id, {
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          assigned_to: formData.assigned_to || undefined,
          priority: formData.priority,
          dependencies: formData.dependencies
        });
        
        toast({
          title: 'Success',
          description: 'Milestone updated successfully'
        });
      } else {
        await supabaseService.createMilestone({
          project_id: projectId,
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          assigned_to: formData.assigned_to || undefined,
          priority: formData.priority,
          dependencies: formData.dependencies
        });
        
        toast({
          title: 'Success',
          description: 'Milestone created successfully'
        });
      }
      
      resetForm();
      setIsDialogOpen(false);
      fetchMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to save milestone',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({
      title: milestone.title,
      description: milestone.description || '',
      due_date: milestone.due_date || '',
      assigned_to: milestone.assigned_to || '',
      priority: milestone.priority,
      dependencies: milestone.dependencies || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    
    try {
      await supabaseService.deleteMilestone(milestoneId);
      toast({
        title: 'Success',
        description: 'Milestone deleted successfully'
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone',
        variant: 'destructive'
      });
    }
  };

  const handleStatusUpdate = async (milestoneId: string, newStatus: Milestone['status']) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === 'completed') {
        updates.completed_date = new Date().toISOString();
        updates.progress_percentage = 100;
      } else if (newStatus === 'in_progress') {
        updates.progress_percentage = 50;
      } else if (newStatus === 'pending') {
        updates.progress_percentage = 0;
        updates.completed_date = null;
      }
      
      await supabaseService.updateMilestone(milestoneId, updates);
      toast({
        title: 'Success',
        description: 'Milestone status updated'
      });
      fetchMilestones();
    } catch (error) {
      console.error('Error updating milestone status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update milestone status',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      assigned_to: '',
      priority: 'medium',
      dependencies: []
    });
    setEditingMilestone(null);
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'delayed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
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
          <CardTitle>Milestones</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMilestone ? 'Edit Milestone' : 'Add Milestone'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Milestone title"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Milestone description"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <Select
                    value={formData.assigned_to}
                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMilestone ? 'Update' : 'Create'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {progress && (
          <div className="mt-4 p-4 bg-steel-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-steel-600">{progress.overall_progress}%</span>
            </div>
            <Progress value={progress.overall_progress} className="h-2" />
            <div className="flex justify-between text-xs text-steel-500 mt-2">
              <span>{progress.completed_milestones} completed</span>
              <span>{progress.in_progress_milestones} in progress</span>
              <span>{progress.delayed_milestones} delayed</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <CalendarIcon2 className="w-12 h-12 mx-auto mb-4 text-steel-300" />
              <p>No milestones yet</p>
              <p className="text-sm">Create your first milestone to start tracking progress</p>
            </div>
          ) : (
            milestones.map((milestone) => (
              <div key={milestone.id} className="p-4 border rounded-lg hover:bg-steel-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(milestone.status)}
                      <h4 className="font-medium text-steel-900">{milestone.title}</h4>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getPriorityColor(milestone.priority)}>
                        {milestone.priority}
                      </Badge>
                    </div>
                    
                    {milestone.description && (
                      <p className="text-sm text-steel-600 mb-2">{milestone.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-steel-500">
                      {milestone.due_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          <span>Due: {format(new Date(milestone.due_date), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      
                      {milestone.assigned_to && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>
                            {technicians.find(t => t.id === milestone.assigned_to)?.full_name || 'Unknown'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={milestone.status}
                      onValueChange={(value: Milestone['status']) => 
                        handleStatusUpdate(milestone.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(milestone)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(milestone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-steel-500">Progress</span>
                    <span className="font-medium">{milestone.progress_percentage}%</span>
                  </div>
                  <Progress value={milestone.progress_percentage} className="h-2" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 