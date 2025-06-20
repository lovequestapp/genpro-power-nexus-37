
import { TicketListItem } from './TicketListItem';

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

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect: (ticket: Ticket) => void;
  selectedTicketId?: string;
}

export function TicketList({ tickets, onTicketSelect, selectedTicketId }: TicketListProps) {
  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <TicketListItem
          key={ticket.id}
          ticket={ticket}
          isSelected={selectedTicketId === ticket.id}
          onClick={() => onTicketSelect(ticket)}
        />
      ))}
    </div>
  );
}
