import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabaseService } from '@/services/supabase';
import { MessageSquare, Plus, Edit, Trash2, User, Clock } from 'lucide-react';

interface ProjectNote {
  id: string;
  project_id: string;
  content: string;
  type: string;
  is_internal: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectNotesProps {
  projectId: string;
}

const noteTypes = [
  { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-800' },
  { value: 'technical', label: 'Technical', color: 'bg-orange-100 text-orange-800' },
  { value: 'customer', label: 'Customer', color: 'bg-green-100 text-green-800' },
  { value: 'internal', label: 'Internal', color: 'bg-purple-100 text-purple-800' },
];

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<ProjectNote | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    type: 'general',
    is_internal: false,
  });

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const notesData = await supabaseService.getProjectNotes(projectId);
      setNotes(notesData || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project notes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Note content is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        await supabaseService.updateProjectNote(editingNote.id, {
          content: formData.content,
          type: formData.type,
          is_internal: formData.is_internal,
        });
        toast({
          title: 'Success',
          description: 'Note updated successfully',
        });
      } else {
        // Create new note
        await supabaseService.createProjectNote(projectId, {
          content: formData.content,
          type: formData.type,
        });
        toast({
          title: 'Success',
          description: 'Note added successfully',
        });
      }

      setFormData({ content: '', type: 'general', is_internal: false });
      setEditingNote(null);
      setShowForm(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (note: ProjectNote) => {
    setEditingNote(note);
    setFormData({
      content: note.content,
      type: note.type,
      is_internal: note.is_internal,
    });
    setShowForm(true);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await supabaseService.deleteProjectNote(noteId);
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({ content: '', type: 'general', is_internal: false });
    setEditingNote(null);
    setShowForm(false);
  };

  const getNoteTypeColor = (type: string) => {
    const noteType = noteTypes.find(nt => nt.value === type);
    return noteType?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Project Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Project Notes ({notes.length})
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add/Edit Note Form */}
        {showForm && (
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-steel-700 mb-2 block">
                    Note Type
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {noteTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-steel-700 mb-2 block">
                    Content
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your note..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="internal"
                    checked={formData.is_internal}
                    onChange={(e) => setFormData({ ...formData, is_internal: e.target.checked })}
                    className="rounded border-steel-300"
                  />
                  <label htmlFor="internal" className="text-sm text-steel-600">
                    Internal note (not visible to customers)
                  </label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNote ? 'Update Note' : 'Add Note'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-steel-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-steel-300" />
              <p>No notes yet</p>
              <p className="text-sm">Add your first note to get started</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getNoteTypeColor(note.type)}>
                        {noteTypes.find(nt => nt.value === note.type)?.label || note.type}
                      </Badge>
                      {note.is_internal && (
                        <Badge variant="outline" className="text-xs">
                          Internal
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(note.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-steel-900 whitespace-pre-wrap mb-3">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-steel-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{note.author_id || 'System'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
} 