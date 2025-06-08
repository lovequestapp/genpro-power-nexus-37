import React, { useEffect, useState } from 'react';
import { StaffMember } from '../../types';
import { supportService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, UserPlus, UserMinus, Clock } from 'lucide-react';

interface TicketTeamProps {
  ticketId: string;
  assignedTo?: string;
  onAssign: (staffId: string) => void;
  onUnassign: () => void;
}

export const TicketTeam: React.FC<TicketTeamProps> = ({
  ticketId,
  assignedTo,
  onAssign,
  onUnassign
}) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await supportService.getStaff();
        if (response.success) {
          setStaffMembers(response.data);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast.error('Failed to load staff members');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleAssign = async (staffId: string) => {
    try {
      const response = await supportService.assignTicket(ticketId, staffId);
      if (response.success) {
        onAssign(staffId);
        toast.success('Ticket assigned successfully');
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error('Failed to assign ticket');
    }
  };

  const handleUnassign = async () => {
    try {
      const response = await supportService.unassignTicket(ticketId);
      if (response.success) {
        onUnassign();
        toast.success('Ticket unassigned successfully');
      }
    } catch (error) {
      console.error('Error unassigning ticket:', error);
      toast.error('Failed to unassign ticket');
    }
  };

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-steel-300';
      default:
        return 'bg-steel-300';
    }
  };

  const getRoleBadge = (role: StaffMember['role']) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Admin</Badge>;
      case 'support':
        return <Badge variant="secondary">Support</Badge>;
      case 'agent':
        return <Badge variant="outline">Agent</Badge>;
      default:
        return <Badge variant="outline">Agent</Badge>;
    }
  };

  const formatLastActive = (date?: string) => {
    if (!date) return '';
    const lastActive = new Date(date);
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / 1000 / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <Card className="p-4 text-center text-steel-500">Loading staff members...</Card>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <Card className="p-4 text-center text-steel-500">No staff members available.</Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Team</h3>
          {assignedTo && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnassign}
              >
                <UserMinus className="h-4 w-4 mr-2" />
                Unassign
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {assignedTo ? (
            <div className="flex items-center justify-between p-3 bg-steel-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-steel-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-steel-500" />
                </div>
                <div>
                  <p className="font-medium">
                    {staffMembers.find(s => s.id === assignedTo)?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-steel-500">Assigned Agent</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnassign}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-steel-500">
              <User className="h-8 w-8 mx-auto mb-2" />
              <p>No one assigned</p>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-steel-500">Available Team Members</h4>
            <div className="space-y-2">
              {staffMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 hover:bg-steel-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(
                        member.status
                      )}`}
                    />
                    <span className="text-sm">{member.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(member.role)}
                    <div className="flex items-center gap-1 text-xs text-steel-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatLastActive(member.lastActive)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}; 