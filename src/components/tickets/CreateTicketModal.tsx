
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supportService } from '@/services/api';
import { Service, StaffMember } from '@/types';
import { Upload, Paperclip, AlertCircle, Clock, UserPlus, Tag } from 'lucide-react';

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
  customerId?: string;
  generatorId?: string;
}

export function CreateTicketModal({
  open,
  onOpenChange,
  onTicketCreated,
  customerId,
  generatorId,
}: CreateTicketModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [ticketData, setTicketData] = useState({
    type: 'general',
    priority: 'medium',
    title: '',
    description: '',
    customerId: customerId || '',
    generatorId: generatorId || '',
    category: 'technical',
    estimatedTime: '',
    assignedTo: '',
    tags: [] as string[],
    customFields: {} as Record<string, string>,
  });

  useEffect(() => {
    // Load staff members - mock data since getStaff doesn't exist in the service
    setStaffMembers([
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'technician', status: 'active', assignedTickets: [], lastActive: '', department: 'field_service', expertise: [] },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'support', status: 'active', assignedTickets: [], lastActive: '', department: 'customer_support', expertise: [] }
    ]);
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Create the service object instead of FormData
      const serviceData = {
        title: ticketData.title,
        description: ticketData.description,
        status: 'open' as const,
        priority: ticketData.priority as 'low' | 'medium' | 'high' | 'urgent',
        type: ticketData.type as 'technical' | 'billing' | 'general',
        customerId: ticketData.customerId,
        customerName: 'Customer Name', // This should come from actual customer data
        assignedTo: ticketData.assignedTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        date: new Date().toISOString(),
        comments: [],
        attachments: []
      };

      await supportService.create(serviceData);
      toast({
        title: 'Success',
        description: 'Ticket created successfully',
      });
      onTicketCreated();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create ticket',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new support ticket
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={ticketData.type}
                  onValueChange={(value) => setTicketData({ ...ticketData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="installation">Installation</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={ticketData.priority}
                  onValueChange={(value) => setTicketData({ ...ticketData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Brief description of the issue"
                value={ticketData.title}
                onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Detailed description of the issue..."
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                rows={5}
              />
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border-2 border-dashed border-steel-200 rounded-lg p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-steel-400" />
                  <div className="text-sm text-steel-500">
                    Drag and drop files here, or click to select files
                  </div>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Select Files
                  </Button>
                </div>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-steel-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-steel-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assignment" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assigned To</Label>
                <Select
                  value={ticketData.assignedTo}
                  onValueChange={(value) => setTicketData({ ...ticketData, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {staffMembers.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estimated Time</Label>
                <Input
                  type="text"
                  placeholder="e.g., 2 hours"
                  value={ticketData.estimatedTime}
                  onChange={(e) => setTicketData({ ...ticketData, estimatedTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {ticketData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() =>
                        setTicketData({
                          ...ticketData,
                          tags: ticketData.tags.filter((_, i) => i !== index),
                        })
                      }
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      setTicketData({
                        ...ticketData,
                        tags: [...ticketData.tags, e.currentTarget.value],
                      });
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={ticketData.category}
                onValueChange={(value) => setTicketData({ ...ticketData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Fields</Label>
              <div className="space-y-2">
                {Object.entries(ticketData.customFields).map(([key, value], index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Field name"
                      value={key}
                      onChange={(e) => {
                        const newFields = { ...ticketData.customFields };
                        delete newFields[key];
                        newFields[e.target.value] = value;
                        setTicketData({ ...ticketData, customFields: newFields });
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={value}
                      onChange={(e) =>
                        setTicketData({
                          ...ticketData,
                          customFields: { ...ticketData.customFields, [key]: e.target.value },
                        })
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newFields = { ...ticketData.customFields };
                        delete newFields[key];
                        setTicketData({ ...ticketData, customFields: newFields });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setTicketData({
                      ...ticketData,
                      customFields: { ...ticketData.customFields, '': '' },
                    })
                  }
                >
                  Add Custom Field
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Ticket'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
