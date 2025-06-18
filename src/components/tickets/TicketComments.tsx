
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supportService } from '@/services/api';
import { Service } from '@/types';
import { Upload, Paperclip, X, Download } from 'lucide-react';

interface TicketCommentsProps {
  ticket: Service;
  onCommentAdded: () => void;
  currentUser: string;
}

export function TicketComments({ ticket, onCommentAdded, currentUser }: TicketCommentsProps) {
  const { toast } = useToast();
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() && attachments.length === 0) return;

    try {
      setLoading(true);
      await supportService.addComment(ticket.id, newComment);
      setNewComment('');
      setAttachments([]);
      onCommentAdded();
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment',
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

  const downloadAttachment = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {ticket.comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-4 rounded-lg ${
              comment.author === currentUser
                ? 'bg-accent/10 ml-4'
                : 'bg-steel-50 mr-4'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.author}</p>
                <p className="text-sm text-steel-500">
                  {new Date(comment.date).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{comment.content || comment.message}</p>
            
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {comment.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 bg-white rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-steel-500" />
                      <span className="text-sm">{attachment.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadAttachment(attachment.url, attachment.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
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
                id="comment-file-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('comment-file-upload')?.click()}
              >
                Select Files
              </Button>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-steel-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-steel-500" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(file.size / 1024).toFixed(1)} KB
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading || (!newComment.trim() && attachments.length === 0)}>
            {loading ? 'Sending...' : 'Send Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
} 
