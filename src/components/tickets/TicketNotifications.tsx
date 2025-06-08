import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { Bell, BellOff, Check, X } from 'lucide-react';

interface TicketNotificationsProps {
  ticket: Service;
  onNotificationUpdate?: (enabled: boolean) => void;
  isAdmin?: boolean;
}

interface Notification {
  id: string;
  type: 'status_change' | 'comment' | 'assignment' | 'priority_change';
  message: string;
  timestamp: Date;
  read: boolean;
}

export function TicketNotifications({
  ticket,
  onNotificationUpdate,
  isAdmin = false,
}: TicketNotificationsProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications(ticket));
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleToggleNotifications = () => {
    if (!onNotificationUpdate) return;

    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onNotificationUpdate(newState);
    toast({
      title: 'Success',
      description: `Notifications ${newState ? 'enabled' : 'disabled'}`,
    });
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'status_change':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Status</Badge>;
      case 'comment':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Comment</Badge>;
      case 'assignment':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Assignment</Badge>;
      case 'priority_change':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Priority</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleNotifications}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 mr-2" />
              ) : (
                <BellOff className="h-4 w-4 mr-2" />
              )}
              {notificationsEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.read ? 'bg-steel-50' : 'bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getNotificationIcon(notification.type)}
                      <span className="text-sm font-medium">
                        {notification.message}
                      </span>
                    </div>
                    <p className="text-xs text-steel-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-steel-500">
              No notifications
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function generateNotifications(ticket: Service): Notification[] {
  const notifications: Notification[] = [];

  // Add status change notification
  if (ticket.status !== 'pending') {
    notifications.push({
      id: '1',
      type: 'status_change',
      message: `Ticket status changed to ${ticket.status}`,
      timestamp: new Date(ticket.date),
      read: false,
    });
  }

  // Add priority change notification
  if (ticket.priority) {
    notifications.push({
      id: '2',
      type: 'priority_change',
      message: `Priority set to ${ticket.priority}`,
      timestamp: new Date(ticket.date),
      read: false,
    });
  }

  // Add assignment notification
  if (ticket.assignedTo) {
    notifications.push({
      id: '3',
      type: 'assignment',
      message: `Assigned to ${ticket.assignedTo}`,
      timestamp: new Date(ticket.date),
      read: false,
    });
  }

  // Add comment notifications
  if (ticket.comments) {
    ticket.comments.forEach((comment, index) => {
      notifications.push({
        id: `4-${index}`,
        type: 'comment',
        message: `New comment from ${comment.author}`,
        timestamp: new Date(comment.date),
        read: false,
      });
    });
  }

  // Sort notifications by timestamp
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
} 