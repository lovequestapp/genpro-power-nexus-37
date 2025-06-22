import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash,
  Clock,
  UserPlus,
  Users,
  Activity,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Square,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Types
interface TeamMember {
  id: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone_number?: string;
  role: 'admin' | 'technician' | 'support' | 'sales' | 'manager';
  status: 'pending' | 'active' | 'inactive' | 'on_leave';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  internal_notes?: string;
}

interface TimeEntry {
  id: number;
  team_member_id: string;
  project_id?: string;
  start_time: string;
  end_time?: string;
  notes?: string;
  created_at: string;
}

interface Schedule {
  id: string;
  team_member_id: string;
  date: string;
  start_time: string;
  end_time: string;
  project_id?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTimeTrackingDialogOpen, setIsTimeTrackingDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTimeEntry, setActiveTimeEntry] = useState<TimeEntry | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'technician' as TeamMember['role'],
    status: 'pending' as TeamMember['status'],
    internal_notes: '',
  });

  const [timeEntryData, setTimeEntryData] = useState({
    project_id: '',
    notes: '',
  });

  const [scheduleData, setScheduleData] = useState({
    date: '',
    start_time: '',
    end_time: '',
    project_id: '',
    notes: '',
  });

  const { toast } = useToast();

  // Load data
  useEffect(() => {
    loadTeamMembers();
    loadTimeEntries();
    loadSchedules();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive',
      });
    }
  };

  const loadTimeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error loading time entries:', error);
    }
  };

  const loadSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const addTeamMember = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setTeamMembers([data, ...teamMembers]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Team member added successfully',
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add team member',
        variant: 'destructive',
      });
    }
  };

  const updateTeamMember = async () => {
    if (!selectedMember) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(formData)
        .eq('id', selectedMember.id)
        .select()
        .single();

      if (error) throw error;

      setTeamMembers(teamMembers.map(member => 
        member.id === selectedMember.id ? data : member
      ));
      setIsEditDialogOpen(false);
      setSelectedMember(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Team member updated successfully',
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team member',
        variant: 'destructive',
      });
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTeamMembers(teamMembers.filter(member => member.id !== id));
      toast({
        title: 'Success',
        description: 'Team member deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete team member',
        variant: 'destructive',
      });
    }
  };

  // Time Tracking
  const startTimeTracking = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          team_member_id: memberId,
          start_time: new Date().toISOString(),
          notes: timeEntryData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      setActiveTimeEntry(data);
      setTimeEntries([data, ...timeEntries]);
      setIsTimeTrackingDialogOpen(false);
      toast({
        title: 'Time tracking started',
        description: 'Clock in successful',
      });
    } catch (error) {
      console.error('Error starting time tracking:', error);
      toast({
        title: 'Error',
        description: 'Failed to start time tracking',
        variant: 'destructive',
      });
    }
  };

  const stopTimeTracking = async () => {
    if (!activeTimeEntry) return;

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .update({
          end_time: new Date().toISOString(),
        })
        .eq('id', activeTimeEntry.id)
        .select()
        .single();

      if (error) throw error;

      setTimeEntries(timeEntries.map(entry => 
        entry.id === activeTimeEntry.id ? data : entry
      ));
      setActiveTimeEntry(null);
      toast({
        title: 'Time tracking stopped',
        description: 'Clock out successful',
      });
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop time tracking',
        variant: 'destructive',
      });
    }
  };

  // Scheduling
  const addSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert([{
          team_member_id: selectedMember?.id,
          date: scheduleData.date,
          start_time: scheduleData.start_time,
          end_time: scheduleData.end_time,
          project_id: scheduleData.project_id || null,
          notes: scheduleData.notes,
          status: 'scheduled',
        }])
        .select()
        .single();

      if (error) throw error;

      setSchedules([...schedules, data]);
      setIsScheduleDialogOpen(false);
      resetScheduleForm();
      toast({
        title: 'Success',
        description: 'Schedule added successfully',
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to add schedule',
        variant: 'destructive',
      });
    }
  };

  // Internal Notes
  const updateInternalNotes = async () => {
    if (!selectedMember) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({
          internal_notes: formData.internal_notes,
        })
        .eq('id', selectedMember.id)
        .select()
        .single();

      if (error) throw error;

      setTeamMembers(teamMembers.map(member => 
        member.id === selectedMember.id ? data : member
      ));
      setIsNotesDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Internal notes updated successfully',
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive',
      });
    }
  };

  // Utility functions
  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone_number: '',
      role: 'technician',
      status: 'pending',
      internal_notes: '',
    });
  };

  const resetScheduleForm = () => {
    setScheduleData({
      date: '',
      start_time: '',
      end_time: '',
      project_id: '',
      notes: '',
    });
  };

  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      full_name: member.full_name,
      email: member.email,
      phone_number: member.phone_number || '',
      role: member.role,
      status: member.status,
      internal_notes: member.internal_notes || '',
    });
    setIsEditDialogOpen(true);
  };

  const openNotesDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      ...formData,
      internal_notes: member.internal_notes || '',
    });
    setIsNotesDialogOpen(true);
  };

  const openScheduleDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setIsScheduleDialogOpen(true);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      case 'technician':
        return 'outline';
      case 'support':
        return 'outline';
      case 'sales':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'on_leave':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members, time tracking, and schedules
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: TeamMember['role']) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: TeamMember['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTeamMember}>Add Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {teamMembers.filter(m => m.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Time Entries</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {timeEntries.filter(entry => !entry.end_time).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently clocked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedules.filter(s => s.date === format(new Date(), 'yyyy-MM-dd')).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Members</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting activation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="time">Time Tracking</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.full_name}</p>
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
                        {member.phone_number && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-4 h-4" />
                            {member.phone_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(member.status)}
                        <Badge variant={getStatusBadgeVariant(member.status)}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(member.created_at), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openNotesDialog(member)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {member.full_name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTeamMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Time Tracking Tab */}
        <TabsContent value="time" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Time Tracking</h3>
            <Dialog open={isTimeTrackingDialogOpen} onOpenChange={setIsTimeTrackingDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Clock className="w-4 h-4 mr-2" />
                  Start Time Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Time Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member">Team Member</Label>
                    <Select onValueChange={(value) => setTimeEntryData({ ...timeEntryData, project_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      value={timeEntryData.notes}
                      onChange={(e) => setTimeEntryData({ ...timeEntryData, notes: e.target.value })}
                      placeholder="Enter notes for this time entry"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTimeTrackingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => startTimeTracking(timeEntryData.project_id)}>
                    Start Tracking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry) => {
                  const startTime = new Date(entry.start_time);
                  const endTime = entry.end_time ? new Date(entry.end_time) : null;
                  const duration = endTime 
                    ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) * 10) / 10
                    : Math.round((new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60) * 10) / 10;

                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {teamMembers.find(m => m.id === entry.team_member_id)?.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {format(startTime, 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {endTime ? format(endTime, 'MMM dd, yyyy HH:mm') : 'Active'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={endTime ? 'secondary' : 'default'}>
                          {duration}h
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {!endTime && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => stopTimeTracking()}
                          >
                            <Square className="w-4 h-4 mr-1" />
                            Stop
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Schedule Management</h3>
            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Schedule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member">Team Member</Label>
                    <Select onValueChange={(value) => setScheduleData({ ...scheduleData, project_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      value={scheduleData.date}
                      onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        type="time"
                        value={scheduleData.start_time}
                        onChange={(e) => setScheduleData({ ...scheduleData, start_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        type="time"
                        value={scheduleData.end_time}
                        onChange={(e) => setScheduleData({ ...scheduleData, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      value={scheduleData.notes}
                      onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                      placeholder="Enter schedule notes"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addSchedule}>Add Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {teamMembers.find(m => m.id === schedule.team_member_id)?.full_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(schedule.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {schedule.start_time} - {schedule.end_time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {schedule.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {schedule.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Internal Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <h3 className="text-lg font-semibold">Internal Notes</h3>
          <div className="grid gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {member.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{member.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Internal Notes</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openNotesDialog(member)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-md min-h-[60px]">
                      {member.internal_notes ? (
                        <p className="text-sm whitespace-pre-wrap">{member.internal_notes}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No internal notes yet.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Team Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_full_name">Full Name</Label>
              <Input
                id="edit_full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_phone_number">Phone Number</Label>
              <Input
                id="edit_phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit_role">Role</Label>
              <Select value={formData.role} onValueChange={(value: TeamMember['role']) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_status">Status</Label>
              <Select value={formData.status} onValueChange={(value: TeamMember['status']) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateTeamMember}>Update Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Internal Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Internal Notes - {selectedMember?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="internal_notes">Notes</Label>
              <Textarea
                id="internal_notes"
                value={formData.internal_notes}
                onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                placeholder="Enter internal notes about this team member..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateInternalNotes}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 