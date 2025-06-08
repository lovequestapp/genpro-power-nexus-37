import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { Tag, Plus, X } from 'lucide-react';

interface TicketTagsProps {
  ticket: Service;
  onTagsUpdate?: (tags: string[]) => void;
  onCategoryUpdate?: (category: string) => void;
  isAdmin?: boolean;
}

const CATEGORIES = [
  'Technical Support',
  'Billing',
  'Account',
  'Feature Request',
  'Bug Report',
  'General Inquiry',
];

export function TicketTags({
  ticket,
  onTagsUpdate,
  onCategoryUpdate,
  isAdmin = false,
}: TicketTagsProps) {
  const { toast } = useToast();
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddTag = () => {
    if (!newTag.trim() || !onTagsUpdate) return;

    const updatedTags = [...(ticket.tags || []), newTag.trim()];
    onTagsUpdate(updatedTags);
    setNewTag('');
    toast({
      title: 'Success',
      description: 'Tag added successfully',
    });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!onTagsUpdate) return;

    const updatedTags = (ticket.tags || []).filter((tag) => tag !== tagToRemove);
    onTagsUpdate(updatedTags);
    toast({
      title: 'Success',
      description: 'Tag removed successfully',
    });
  };

  const handleCategoryChange = (category: string) => {
    if (!onCategoryUpdate) return;

    onCategoryUpdate(category);
    toast({
      title: 'Success',
      description: 'Category updated successfully',
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Tags & Categories</h3>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-steel-500">Category</label>
            {isAdmin && isEditing ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={ticket.category === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="mt-2">
                <Badge variant="outline">{ticket.category || 'Uncategorized'}</Badge>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-steel-500">Tags</label>
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {ticket.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                    {isAdmin && isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {isAdmin && isEditing && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 