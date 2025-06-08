import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { Upload, Paperclip, X, Download, FileText, Image, File } from 'lucide-react';

interface TicketAttachmentsProps {
  ticket: Service;
  onAttachmentAdd?: (files: File[]) => void;
  onAttachmentDelete?: (attachmentId: string) => void;
  isAdmin?: boolean;
}

export function TicketAttachments({
  ticket,
  onAttachmentAdd,
  onAttachmentDelete,
  isAdmin = false,
}: TicketAttachmentsProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onAttachmentAdd) return;

    try {
      setIsUploading(true);
      await onAttachmentAdd(Array.from(e.target.files));
      toast({
        title: 'Success',
        description: 'Files uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload files',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!onAttachmentDelete) return;

    try {
      await onAttachmentDelete(attachmentId);
      toast({
        title: 'Success',
        description: 'File deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <File className="h-4 w-4 text-steel-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Attachments</h3>
          {isAdmin && (
            <div>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                id="ticket-attachments"
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('ticket-attachments')?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Add Files'}
              </Button>
            </div>
          )}
        </div>

        {ticket.attachments && ticket.attachments.length > 0 ? (
          <div className="space-y-2">
            {ticket.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-2 bg-steel-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(attachment.type)}
                  <div>
                    <p className="text-sm font-medium">{attachment.name}</p>
                    <p className="text-xs text-steel-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(attachment.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-steel-500">
            <Paperclip className="h-8 w-8 mx-auto mb-2" />
            <p>No attachments</p>
          </div>
        )}
      </div>
    </Card>
  );
} 