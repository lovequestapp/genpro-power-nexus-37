import { Service } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface TicketListProps {
  tickets: Service[];
  onTicketSelect: (ticket: Service) => void;
  selectedTicketId?: string;
}

export function TicketList({ tickets, onTicketSelect, selectedTicketId }: TicketListProps) {
  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedTicketId === ticket.id ? 'bg-steel-50' : 'hover:bg-steel-50'
          }`}
          onClick={() => onTicketSelect(ticket)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{ticket.title}</h3>
              <p className="text-sm text-steel-500 mt-1">{ticket.description}</p>
            </div>
            <Badge variant={getStatusVariant(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-steel-500">
            <span>#{ticket.id}</span>
            <span>•</span>
            <span>{ticket.customerName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function getStatusVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (status) {
    case 'open':
      return 'default';
    case 'in_progress':
      return 'secondary';
    case 'resolved':
      return 'outline';
    case 'closed':
      return 'destructive';
    default:
      return 'default';
  }
} 