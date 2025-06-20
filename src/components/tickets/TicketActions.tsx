
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Archive, 
  Copy, 
  Send,
  Clock,
  Flag
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  status: string;
  priority: string;
}

interface TicketActionsProps {
  ticket: Ticket;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  onDuplicate?: () => void;
  onEscalate?: () => void;
}

export function TicketActions({ 
  ticket, 
  onEdit, 
  onDelete, 
  onArchive, 
  onDuplicate,
  onEscalate 
}: TicketActionsProps) {
  const { toast } = useToast();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const handleDelete = () => {
    if (!deleteReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for deleting this ticket',
        variant: 'destructive'
      });
      return;
    }
    
    onDelete?.();
    setIsDeleteModalOpen(false);
    setDeleteReason('');
    
    toast({
      title: 'Success',
      description: 'Ticket deleted successfully'
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/admin/support?ticket=${ticket.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Success',
      description: 'Ticket link copied to clipboard'
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Ticket
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleCopyLink}>
            <Send className="w-4 h-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onEscalate}>
            <Flag className="w-4 h-4 mr-2" />
            Escalate
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onArchive}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the ticket 
              "{ticket.title}" and all associated comments and attachments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Reason for deletion (required)
              </label>
              <Textarea
                placeholder="Please provide a reason for deleting this ticket..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={!deleteReason.trim()}
            >
              Delete Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
