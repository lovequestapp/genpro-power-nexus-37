import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  MessageSquare
} from 'lucide-react';

interface Ticket {
  id: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: string;
  createdAt: string;
}

interface TicketMetricsProps {
  tickets: Ticket[];
}

export function TicketMetrics({ tickets }: TicketMetricsProps) {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;
  
  const resolutionRate = totalTickets > 0 ? ((resolvedTickets + closedTickets) / totalTickets * 100).toFixed(1) : '0';
  const avgResponseTime = '2.5h'; // This would be calculated from actual data

  const metrics = [
    {
      title: 'Total Tickets',
      value: totalTickets,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Open',
      value: openTickets,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'In Progress',
      value: inProgressTickets,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Resolved',
      value: resolvedTickets,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Closed',
      value: closedTickets,
      icon: XCircle,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Resolution Rate',
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Priority Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Urgent</span>
                </div>
                <Badge variant="destructive">{urgentTickets}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">High</span>
                </div>
                <Badge variant="secondary">{highPriorityTickets}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Response Time</span>
                <span className="text-sm text-gray-600">{avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resolution Rate</span>
                <span className="text-sm text-gray-600">{resolutionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
