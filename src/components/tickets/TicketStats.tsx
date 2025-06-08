import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface TicketStatsProps {
  tickets: Service[];
}

export function TicketStats({ tickets }: TicketStatsProps) {
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter((t) => t.status === 'pending').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;
  const closedTickets = tickets.filter((t) => t.status === 'closed').length;

  const urgentTickets = tickets.filter((t) => t.priority === 'urgent').length;
  const highPriorityTickets = tickets.filter((t) => t.priority === 'high').length;
  const mediumPriorityTickets = tickets.filter((t) => t.priority === 'medium').length;
  const lowPriorityTickets = tickets.filter((t) => t.priority === 'low').length;

  const averageResponseTime = calculateAverageResponseTime(tickets);
  const resolutionRate = calculateResolutionRate(tickets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Total Tickets</h3>
            <AlertCircle className="h-4 w-4 text-steel-400" />
          </div>
          <p className="text-2xl font-semibold">{totalTickets}</p>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Pending</span>
              <span>{pendingTickets}</span>
            </div>
            <Progress value={(pendingTickets / totalTickets) * 100} />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Priority Distribution</h3>
            <AlertCircle className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Urgent</span>
              <span>{urgentTickets}</span>
            </div>
            <Progress value={(urgentTickets / totalTickets) * 100} className="bg-red-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>High</span>
              <span>{highPriorityTickets}</span>
            </div>
            <Progress value={(highPriorityTickets / totalTickets) * 100} className="bg-orange-100" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Status Overview</h3>
            <CheckCircle className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>In Progress</span>
              <span>{inProgressTickets}</span>
            </div>
            <Progress value={(inProgressTickets / totalTickets) * 100} className="bg-blue-100" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Resolved</span>
              <span>{resolvedTickets}</span>
            </div>
            <Progress value={(resolvedTickets / totalTickets) * 100} className="bg-green-100" />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Performance Metrics</h3>
            <Clock className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg. Response Time</span>
                <span>{averageResponseTime}</span>
              </div>
              <Progress value={75} className="bg-blue-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Resolution Rate</span>
                <span>{resolutionRate}%</span>
              </div>
              <Progress value={resolutionRate} className="bg-green-100" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function calculateAverageResponseTime(tickets: Service[]): string {
  // This is a placeholder implementation
  // In a real application, you would calculate the actual average response time
  return '2h 30m';
}

function calculateResolutionRate(tickets: Service[]): number {
  const resolvedAndClosed = tickets.filter(
    (t) => t.status === 'resolved' || t.status === 'closed'
  ).length;
  return Math.round((resolvedAndClosed / tickets.length) * 100) || 0;
} 