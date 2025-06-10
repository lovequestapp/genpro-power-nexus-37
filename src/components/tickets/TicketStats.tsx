import { Card } from '@/components/ui/card';

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

interface TicketStatsProps {
  stats: Stats;
}

export function TicketStats({ stats }: TicketStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-steel-500">Total Tickets</h3>
        <p className="text-2xl font-bold">{stats.total}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-steel-500">Open</h3>
        <p className="text-2xl font-bold">{stats.open}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-steel-500">In Progress</h3>
        <p className="text-2xl font-bold">{stats.inProgress}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-steel-500">Resolved</h3>
        <p className="text-2xl font-bold">{stats.resolved}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-steel-500">Closed</h3>
        <p className="text-2xl font-bold">{stats.closed}</p>
      </Card>
    </div>
  );
} 