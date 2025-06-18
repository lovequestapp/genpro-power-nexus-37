import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Tag, MessageSquare, AlertCircle } from 'lucide-react';

interface TicketActivityProps {
  ticket: Service;
}

interface Activity {
  id: string;
  type: 'status_change' | 'priority_change' | 'assignment' | 'comment' | 'creation';
  user: string;
  timestamp: Date;
  details: {
    from?: string;
    to?: string;
    message?: string;
  };
}

export function TicketActivity({ ticket }: TicketActivityProps) {
  const activities = generateActivities(ticket);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'status_change':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'priority_change':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'assignment':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'creation':
        return <Tag className="h-4 w-4 text-steel-500" />;
    }
  };

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'status_change':
        return `Changed status from ${activity.details.from} to ${activity.details.to}`;
      case 'priority_change':
        return `Changed priority from ${activity.details.from} to ${activity.details.to}`;
      case 'assignment':
        return `Assigned to ${activity.details.to}`;
      case 'comment':
        return activity.details.message;
      case 'creation':
        return 'Ticket created';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Activity History</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-steel-50 flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="w-0.5 h-full bg-steel-100" />
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-steel-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-steel-600">{getActivityMessage(activity)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function generateActivities(ticket: Service): Activity[] {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'creation',
      user: 'System',
      timestamp: new Date(ticket.date),
      details: {},
    },
  ];

  // Add status changes
  if (ticket.status !== 'open') {
    activities.push({
      id: '2',
      type: 'status_change',
      user: 'System',
      timestamp: new Date(ticket.date),
      details: {
        from: 'open',
        to: ticket.status,
      },
    });
  }

  // Add priority changes
  if (ticket.priority) {
    activities.push({
      id: '3',
      type: 'priority_change',
      user: 'System',
      timestamp: new Date(ticket.date),
      details: {
        from: 'medium',
        to: ticket.priority,
      },
    });
  }

  // Add assignment
  if (ticket.assignedTo) {
    activities.push({
      id: '4',
      type: 'assignment',
      user: 'System',
      timestamp: new Date(ticket.date),
      details: {
        to: ticket.assignedTo,
      },
    });
  }

  // Add comments
  if (ticket.comments) {
    ticket.comments.forEach((comment, index) => {
      activities.push({
        id: `5-${index}`,
        type: 'comment',
        user: comment.author,
        timestamp: new Date(comment.date),
        details: {
          message: comment.message,
        },
      });
    });
  }

  // Sort activities by timestamp
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
