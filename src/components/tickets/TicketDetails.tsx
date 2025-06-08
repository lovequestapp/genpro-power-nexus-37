import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Service } from '@/types';
import { Clock, Tag, User, AlertCircle, FileText, Calendar } from 'lucide-react';

interface TicketDetailsProps {
  ticket: Service;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
  onAssign?: (staffId: string) => void;
  isAdmin?: boolean;
}

export function TicketDetails({
  ticket,
  onStatusChange,
  onPriorityChange,
  onAssign,
  isAdmin = false,
}: TicketDetailsProps) {
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
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">{ticket.title}</h2>
              <p className="text-steel-500 mt-1">#{ticket.id}</p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-steel-500">
                <User className="h-4 w-4" />
                <span>Customer</span>
              </div>
              <p className="font-medium">{ticket.customerName}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-steel-500">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="font-medium">
                {new Date(ticket.date).toLocaleDateString()}
              </p>
            </div>

            {ticket.assignedTo && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-steel-500">
                  <User className="h-4 w-4" />
                  <span>Assigned To</span>
                </div>
                <p className="font-medium">{ticket.assignedTo}</p>
              </div>
            )}

            {ticket.estimatedTime && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-steel-500">
                  <Clock className="h-4 w-4" />
                  <span>Estimated Time</span>
                </div>
                <p className="font-medium">{ticket.estimatedTime}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-steel-500">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </div>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {ticket.tags && ticket.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-steel-500">
                <Tag className="h-4 w-4" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ticket.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {ticket.customFields && Object.keys(ticket.customFields).length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-steel-500">
                <AlertCircle className="h-4 w-4" />
                <span>Additional Information</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(ticket.customFields).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-steel-500">{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onStatusChange?.(ticket.status)}
              >
                Change Status
              </Button>
              <Button
                variant="outline"
                onClick={() => onPriorityChange?.(ticket.priority)}
              >
                Change Priority
              </Button>
              <Button
                variant="outline"
                onClick={() => onAssign?.(ticket.assignedTo || '')}
              >
                Assign Ticket
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 