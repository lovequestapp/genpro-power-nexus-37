import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import SEO from '../../components/SEO';

interface Project {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string | null;
  type: 'installation' | 'maintenance' | 'repair';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}

export default function CustomerProjects() {
  const { user } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['customer-projects', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customerId', user?.id)
        .order('startDate', { ascending: false });
      if (error) throw error;
      return data as Project[];
    },
  });

  if (isLoading) {
    return <div>Loading projects...</div>;
  }

  return (
    <>
      <SEO title="Customer Projects | HOU GEN PROS" description="Customer dashboard projects page." canonical="/customer/projects" pageType="website" keywords="customer, projects, dashboard" schema={null} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">View and track your projects</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project History</CardTitle>
            <CardDescription>All your projects and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{project.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === 'completed'
                              ? 'default'
                              : project.status === 'in-progress'
                              ? 'secondary'
                              : project.status === 'cancelled'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.priority === 'high'
                              ? 'destructive'
                              : project.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {project.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(project.startDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-muted-foreground py-4">No projects found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 