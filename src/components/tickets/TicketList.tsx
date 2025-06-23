import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  Calendar
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  customerName: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  date: string;
  assignedTo?: string;
  comments: any[];
  attachments: any[];
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'in_progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'resolved':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'closed':
      return <XCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export function TicketList({ tickets, onTicketSelect, selectedTicketId }: TicketListProps) {
  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedTicketId === ticket.id
              ? 'ring-2 ring-blue-500 bg-blue-50'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTicketSelect(ticket)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(ticket.status)}
                <h3 className="font-medium text-gray-900 truncate">
                  {ticket.title}
                </h3>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {ticket.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{ticket.customerName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                </div>
                {ticket.comments && ticket.comments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{ticket.comments.length} comments</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="flex gap-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
              
              {ticket.assignedTo && (
                <div className="text-xs text-gray-500">
                  Assigned
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
      
      {tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No tickets found</p>
          <p className="text-sm">Try adjusting your filters or create a new ticket</p>
        </div>
      )}
    </div>
  );
}
