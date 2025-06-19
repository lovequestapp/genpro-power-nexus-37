import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Settings,
  Bell,
  Shield
} from 'lucide-react';
import { supabaseService } from '@/services/supabase';
import { ProjectStatusRule } from '@/types/dashboard';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface StatusWorkflowManagerProps {
  projectId: string;
  currentStatus: string;
  onStatusChange: (newStatus: string) => Promise<void>;
}

interface StatusTransition {
  from: string;
  to: string;
  allowed: boolean;
  requiresApproval: boolean;
  rule?: ProjectStatusRule;
}

export function StatusWorkflowManager({ 
  projectId, 
  currentStatus, 
  onStatusChange 
}: StatusWorkflowManagerProps) {
  const [statusRules, setStatusRules] = useState<ProjectStatusRule[]>([]);
  const [availableTransitions, setAvailableTransitions] = useState<StatusTransition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<StatusTransition | null>(null);
  const [transitionNote, setTransitionNote] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [userRole, setUserRole] = useState<string>('staff');
  const { toast } = useToast();
  const { user } = useAuth();

  const statusOptions = [
    { value: 'planned', label: 'Planned', color: 'bg-gray-100 text-gray-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    { value: 'archived', label: 'Archived', color: 'bg-purple-100 text-purple-800' }
  ];

  useEffect(() => {
    fetchStatusRules();
    fetchUserRole();
  }, []);

  useEffect(() => {
    calculateAvailableTransitions();
  }, [statusRules, currentStatus, userRole]);

  const fetchStatusRules = async () => {
    try {
      setLoading(true);
      const rules = await supabaseService.getStatusRules();
      setStatusRules(rules);
    } catch (error) {
      console.error('Error fetching status rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load status workflow rules',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      if (user) {
        const profile = await supabaseService.getProfile(user.id);
        setUserRole(profile.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const calculateAvailableTransitions = () => {
    const transitions: StatusTransition[] = [];
    
    statusOptions.forEach(statusOption => {
      if (statusOption.value === currentStatus) return;
      
      const rule = statusRules.find(r => 
        r.from_status === currentStatus && r.to_status === statusOption.value
      );
      
      const allowed = rule ? rule.allowed_roles.includes(userRole) : false;
      
      transitions.push({
        from: currentStatus,
        to: statusOption.value,
        allowed,
        requiresApproval: rule?.requires_approval || false,
        rule
      });
    });
    
    setAvailableTransitions(transitions);
  };

  const handleStatusTransition = async (transition: StatusTransition) => {
    try {
      // Validate the transition
      await supabaseService.validateStatusTransition(
        transition.from,
        transition.to,
        userRole
      );
      
      setSelectedTransition(transition);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Status transition validation failed:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Invalid status transition',
        variant: 'destructive'
      });
    }
  };

  const confirmStatusTransition = async () => {
    if (!selectedTransition) return;
    
    try {
      // Log the status change to audit trail
      await supabaseService.logProjectAction(projectId, {
        action: 'status_changed',
        field_name: 'status',
        old_value: selectedTransition.from,
        new_value: selectedTransition.to,
        metadata: {
          note: transitionNote,
          requires_approval: selectedTransition.requiresApproval,
          rule_id: selectedTransition.rule?.id
        }
      });
      
      // Update the project status
      await onStatusChange(selectedTransition.to);
      
      // Send notification if enabled
      if (sendNotification && selectedTransition.rule?.notification_template) {
        await sendStatusNotification(selectedTransition);
      }
      
      toast({
        title: 'Success',
        description: `Project status changed to ${selectedTransition.to.replace('_', ' ')}`
      });
      
      setIsDialogOpen(false);
      setSelectedTransition(null);
      setTransitionNote('');
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project status',
        variant: 'destructive'
      });
    }
  };

  const sendStatusNotification = async (transition: StatusTransition) => {
    try {
      // This would integrate with your notification system
      // For now, we'll just log it
      console.log('Sending status notification:', {
        projectId,
        fromStatus: transition.from,
        toStatus: transition.to,
        template: transition.rule?.notification_template,
        note: transitionNote
      });
      
      // In a real implementation, you would:
      // 1. Send email notifications
      // 2. Send in-app notifications
      // 3. Send SMS if configured
      // 4. Update notification preferences
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'archived':
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Workflow</CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Status Workflow
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-4 bg-steel-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(currentStatus)}
              <div>
                <p className="text-sm font-medium text-steel-700">Current Status</p>
                <Badge className={getStatusColor(currentStatus)}>
                  {currentStatus.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Available Transitions */}
          <div>
            <h4 className="font-medium text-steel-900 mb-3">Available Status Changes</h4>
            <div className="space-y-3">
              {availableTransitions.map((transition) => (
                <div
                  key={transition.to}
                  className={`p-4 border rounded-lg ${
                    transition.allowed 
                      ? 'border-steel-200 bg-white hover:bg-steel-50' 
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(transition.from)}>
                          {transition.from.replace('_', ' ')}
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-steel-400" />
                        <Badge className={getStatusColor(transition.to)}>
                          {transition.to.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      {transition.requiresApproval && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Requires Approval
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {transition.allowed ? (
                        <Button
                          size="sm"
                          onClick={() => handleStatusTransition(transition)}
                          variant={transition.requiresApproval ? "outline" : "default"}
                        >
                          {transition.requiresApproval ? 'Request' : 'Change'}
                        </Button>
                      ) : (
                        <div className="text-xs text-steel-500">
                          Not allowed for {userRole}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {transition.rule?.notification_template && (
                    <p className="text-xs text-steel-500 mt-2">
                      Notification: {transition.rule.notification_template}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Workflow Rules Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Workflow Rules</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Status changes are validated against workflow rules</p>
              <p>• Some transitions require approval from administrators</p>
              <p>• All changes are logged in the audit trail</p>
              <p>• Notifications are sent to relevant team members</p>
            </div>
          </div>
        </div>
        
        {/* Status Transition Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </DialogHeader>
            
            {selectedTransition && (
              <div className="space-y-4">
                <div className="p-4 bg-steel-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(selectedTransition.from)}>
                      {selectedTransition.from.replace('_', ' ')}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-steel-400" />
                    <Badge className={getStatusColor(selectedTransition.to)}>
                      {selectedTransition.to.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  {selectedTransition.requiresApproval && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>This change requires approval</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Change Note (Optional)</label>
                  <Textarea
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    placeholder="Explain why this status change is needed..."
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send-notification"
                    checked={sendNotification}
                    onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                  />
                  <label htmlFor="send-notification" className="text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Send notification to team members
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={confirmStatusTransition}
                    className="flex-1"
                    disabled={selectedTransition.requiresApproval}
                  >
                    {selectedTransition.requiresApproval ? 'Request Approval' : 'Confirm Change'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 