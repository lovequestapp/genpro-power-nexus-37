
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Clock, User, AlertCircle } from 'lucide-react';

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
}

interface TicketListItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

export function TicketListItem({ ticket, isSelected, onClick }: TicketListItemProps) {
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
    <Card 
      className={`p-4 cursor-pointer transition-colors hover:bg-accent/50 ${
        isSelected ? 'ring-2 ring-primary bg-accent/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-sm line-clamp-2">{ticket.title}</h3>
          <div className="flex gap-1">
            <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {ticket.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{ticket.customerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {ticket.assignedTo && (
          <div className="flex items-center gap-1 text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>Assigned to: {ticket.assignedTo}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
