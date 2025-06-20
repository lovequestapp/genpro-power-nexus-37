
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { Send, Calendar, User, Tag, Clock } from 'lucide-react';
import { TicketActions } from './TicketActions';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  customerName: string;
  createdAt: string;
  assignedTo?: string;
  comments: any[];
}

interface TicketDetailsProps {
  ticket: Ticket;
  onStatusChange: (status: Ticket['status']) => void;
  onAssign: (staffId: string) => void;
  onUnassign: () => void;
  onAddComment: (content: string) => void;
  staff: { id: string; full_name: string }[];
}

export function TicketDetails({
  ticket,
  onStatusChange,
  onAssign,
  onUnassign,
  onAddComment,
  staff
}: TicketDetailsProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">{ticket.title}</h2>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
            <Badge variant="outline">{ticket.type}</Badge>
          </div>
        </div>
        <TicketActions ticket={ticket} />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="font-medium">Description</h3>
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4" />
            <span>Customer: {ticket.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Created: {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4" />
            <span>ID: #{ticket.id.slice(0, 8)}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>Assigned to: {staff.find(s => s.id === ticket.assignedTo)?.full_name || 'Unknown'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={ticket.status} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Assigned To</label>
          {ticket.assignedTo ? (
            <div className="flex items-center justify-between">
              <span className="text-sm">{staff.find(s => s.id === ticket.assignedTo)?.full_name || 'Unknown'}</span>
              <Button variant="outline" size="sm" onClick={onUnassign}>
                Unassign
              </Button>
            </div>
          ) : (
            <Select onValueChange={onAssign}>
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {staff.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Comments</h3>
        
        {ticket.comments.length > 0 ? (
          <div className="space-y-3">
            {ticket.comments.map((comment, index) => (
              <div key={index} className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{comment.author || 'System'}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt || comment.date), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{comment.content || comment.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No comments yet</p>
        )}

        {/* Add Comment */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={!newComment.trim()}
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        </div>
      </div>
    </div>
  );
}
