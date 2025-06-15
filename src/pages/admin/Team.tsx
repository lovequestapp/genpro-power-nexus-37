import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Edit,
  Trash,
} from 'lucide-react';

type TeamMember = {
  id: string;
  name: string;
  role: 'admin' | 'technician' | 'support' | 'sales';
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'inactive' | 'on_leave';
  performance: number;
  joinDate: Date;
  assignedProjects: number;
  completedJobs: number;
};

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock team members data
  const teamMembers: TeamMember[] = [
    {
      id: 'TM001',
      name: 'Mike Johnson',
      role: 'technician',
      email: 'mike.j@hougenpros.com',
      phone: '(555) 123-4567',
      location: 'Houston, TX',
      status: 'active',
      performance: 4.8,
      joinDate: new Date('2023-01-15'),
      assignedProjects: 5,
      completedJobs: 128,
    },
    {
      id: 'TM002',
      name: 'Sarah Chen',
      role: 'admin',
      email: 'sarah.c@hougenpros.com',
      phone: '(555) 234-5678',
      location: 'Houston, TX',
      status: 'active',
      performance: 4.9,
      joinDate: new Date('2022-08-20'),
      assignedProjects: 0,
      completedJobs: 0,
    },
    {
      id: 'TM003',
      name: 'Alex Thompson',
      role: 'technician',
      email: 'alex.t@hougenpros.com',
      phone: '(555) 345-6789',
      location: 'Houston, TX',
      status: 'on_leave',
      performance: 4.7,
      joinDate: new Date('2023-03-10'),
      assignedProjects: 3,
      completedJobs: 95,
    },
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'destructive';
      case 'on_leave':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'technician':
        return 'secondary';
      case 'support':
        return 'outline';
      case 'sales':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members and their roles
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            {/* Add team member form will go here */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Star className="w-6 h-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <h3 className="text-2xl font-bold">{teamMembers.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Performance</p>
              <h3 className="text-2xl font-bold">4.8</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed Jobs</p>
              <h3 className="text-2xl font-bold">223</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Team Members Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/avatars/${member.id}.png`} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {member.location}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {member.performance}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{member.assignedProjects} assigned</p>
                    <p className="text-muted-foreground">
                      {member.completedJobs} completed
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
} 