import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface TicketDetailsProps {
  ticket: Service;
  onStatusChange: (status: Service['status']) => void;
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

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">{ticket.title}</h2>
          <p className="text-steel-500 mt-2">{ticket.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-steel-500">Status</label>
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

          <div>
            <label className="text-sm font-medium text-steel-500">Assigned To</label>
            {ticket.assignedTo ? (
              <div className="flex items-center justify-between mt-2">
                <span>{staff.find(s => s.id === ticket.assignedTo)?.full_name || 'Unknown'}</span>
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

        <div>
          <h3 className="font-medium mb-4">Comments</h3>
          <div className="space-y-4">
            {ticket.comments.map(comment => (
              <div key={comment.id} className="bg-steel-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-steel-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
} 