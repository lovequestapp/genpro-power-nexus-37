import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertCircle, CheckCircle, Users, MessageSquare } from 'lucide-react';

interface TicketMetricsProps {
  tickets: Service[];
}

export function TicketMetrics({ tickets }: TicketMetricsProps) {
  const metrics = calculateMetrics(tickets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Response Time</h3>
            <Clock className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>First Response</span>
                <span>{metrics.firstResponseTime}</span>
              </div>
              <Progress value={metrics.firstResponseTimeScore} className="bg-blue-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Resolution Time</span>
                <span>{metrics.resolutionTime}</span>
              </div>
              <Progress value={metrics.resolutionTimeScore} className="bg-green-100" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Customer Satisfaction</h3>
            <MessageSquare className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Response Rate</span>
                <span>{metrics.responseRate}%</span>
              </div>
              <Progress value={metrics.responseRate} className="bg-blue-100" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Resolution Rate</span>
                <span>{metrics.resolutionRate}%</span>
              </div>
              <Progress value={metrics.resolutionRate} className="bg-green-100" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-steel-500">Team Performance</h3>
            <Users className="h-4 w-4 text-steel-400" />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Active Tickets</span>
                <span>{metrics.activeTickets}</span>
              </div>
              <Progress
                value={(metrics.activeTickets / metrics.totalTickets) * 100}
                className="bg-orange-100"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Avg. Tickets per Agent</span>
                <span>{metrics.ticketsPerAgent}</span>
              </div>
              <Progress
                value={(metrics.ticketsPerAgent / 10) * 100}
                className="bg-purple-100"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface Metrics {
  firstResponseTime: string;
  firstResponseTimeScore: number;
  resolutionTime: string;
  resolutionTimeScore: number;
  responseRate: number;
  resolutionRate: number;
  activeTickets: number;
  totalTickets: number;
  ticketsPerAgent: number;
}

function calculateMetrics(tickets: Service[]): Metrics {
  // This is a placeholder implementation
  // In a real application, you would calculate actual metrics based on ticket data
  return {
    firstResponseTime: '2h 30m',
    firstResponseTimeScore: 75,
    resolutionTime: '1d 5h',
    resolutionTimeScore: 65,
    responseRate: 85,
    resolutionRate: 70,
    activeTickets: tickets.filter((t) => t.status === 'pending' || t.status === 'in_progress').length,
    totalTickets: tickets.length,
    ticketsPerAgent: Math.round(tickets.length / 3), // Assuming 3 agents
  };
} 