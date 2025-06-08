import { Service } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { TicketFilters, TicketFiltersProps } from './TicketFilters';
import { Clock, User, Tag } from 'lucide-react';

interface TicketListProps {
  tickets: Service[];
  selectedTicketId?: string;
  onSelectTicket: (ticket: Service) => void;
}

export function TicketList({ tickets, selectedTicketId, onSelectTicket }: TicketListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="font-medium">My Tickets</h3>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedTicketId === ticket.id
                  ? 'border-accent bg-accent/5'
                  : 'border-steel-200 hover:bg-steel-50'
              }`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{ticket.title}</h4>
                  <p className="text-sm text-steel-500 mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
                <Badge
                  variant={
                    ticket.status === 'closed'
                      ? 'default'
                      : ticket.status === 'in_progress'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {ticket.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {ticket.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    ticket.priority === 'high' || ticket.priority === 'urgent'
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {ticket.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
} 