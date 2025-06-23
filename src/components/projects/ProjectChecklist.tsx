
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  FileText, 
  AlertTriangle, 
  Save,
  Download,
  RefreshCw
} from 'lucide-react';
import { checklistService } from '@/services/checklistService';
import { useToast } from '@/hooks/use-toast';
import type { ProjectChecklist, ChecklistItem } from '@/types/checklist';

interface ProjectChecklistProps {
  projectId: string;
  projectName: string;
}

export function ProjectChecklist({ projectId, projectName }: ProjectChecklistProps) {
  const [checklist, setChecklist] = useState<ProjectChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadChecklist();
  }, [projectId]);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const data = await checklistService.getProjectChecklist(projectId);
      setChecklist(data);
    } catch (error) {
      console.error('Error loading checklist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load checklist',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = async (item: ChecklistItem) => {
    try {
      setSaving(item.id);
      const updatedItem = await checklistService.updateChecklistItem(item.id, {
        is_verified: !item.is_verified,
        notes: tempNotes[item.id] || item.notes
      });

      // Update local state
      if (checklist) {
        setChecklist({
          ...checklist,
          items: checklist.items?.map(i => 
            i.id === item.id ? updatedItem : i
          ) || []
        });
      }

      toast({
        title: 'Success',
        description: `Item ${updatedItem.is_verified ? 'verified' : 'unverified'}`,
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const handleNotesUpdate = async (item: ChecklistItem) => {
    try {
      setSaving(item.id);
      const updatedItem = await checklistService.updateChecklistItem(item.id, {
        is_verified: item.is_verified,
        notes: tempNotes[item.id] || item.notes
      });

      // Update local state
      if (checklist) {
        setChecklist({
          ...checklist,
          items: checklist.items?.map(i => 
            i.id === item.id ? updatedItem : i
          ) || []
        });
      }

      setEditingNotes(null);
      setTempNotes(prev => {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      });

      toast({
        title: 'Success',
        description: 'Notes updated successfully',
      });
    } catch (error) {
      console.error('Error updating notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notes',
        variant: 'destructive'
      });
    } finally {
      setSaving(null);
    }
  };

  const exportChecklist = () => {
    if (!checklist?.items) return;

    const content = [
      `Generator Placement Checklist - ${projectName}`,
      `Generated on: ${new Date().toLocaleDateString()}`,
      '',
      ...checklist.items.map((item, index) => {
        const status = item.is_verified ? '✓' : '✗';
        return [
          `${index + 1}. ${item.rule_name} ${status}`,
          `   Requirement: ${item.requirement}`,
          item.notes ? `   Notes: ${item.notes}` : '',
          ''
        ].filter(Boolean).join('\n');
      })
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Loading checklist...
        </CardContent>
      </Card>
    );
  }

  if (!checklist?.items) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-steel-600">No checklist found for this project</p>
          <Button onClick={loadChecklist} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const completionPercentage = checklistService.getCompletionPercentage(checklist.items);
  const completedCount = checklist.items.filter(item => item.is_verified).length;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generator Placement Checklist
              </CardTitle>
              <p className="text-sm text-steel-600 mt-1">
                Verify all placement requirements before installation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportChecklist}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={loadChecklist}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Progress: {completedCount} of {checklist.items.length} items completed
              </span>
              <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
                {completionPercentage}%
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.items.map((item, index) => (
          <Card key={item.id} className={`transition-colors ${
            item.is_verified ? 'bg-green-50 border-green-200' : 'bg-white'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center pt-1">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={item.is_verified}
                    onCheckedChange={() => handleItemToggle(item)}
                    disabled={saving === item.id}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-steel-500">
                      {index + 1}.
                    </span>
                    <h4 className={`font-medium ${
                      item.is_verified ? 'text-green-800' : 'text-steel-900'
                    }`}>
                      {item.rule_name}
                    </h4>
                    {item.is_verified && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                  </div>
                  
                  <p className="text-sm text-steel-600 pl-6">
                    <strong>Requirement:</strong> {item.requirement}
                  </p>

                  {/* Notes Section */}
                  <div className="pl-6">
                    {editingNotes === item.id ? (
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add notes about this requirement..."
                          value={tempNotes[item.id] || item.notes || ''}
                          onChange={(e) => setTempNotes(prev => ({
                            ...prev,
                            [item.id]: e.target.value
                          }))}
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleNotesUpdate(item)}
                            disabled={saving === item.id}
                          >
                            {saving === item.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <Save className="w-3 h-3 mr-1" />
                            )}
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingNotes(null);
                              setTempNotes(prev => {
                                const updated = { ...prev };
                                delete updated[item.id];
                                return updated;
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {item.notes ? (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <strong>Notes:</strong> {item.notes}
                          </div>
                        ) : (
                          <p className="text-xs text-steel-400 italic">No notes</p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-6 px-2 text-xs"
                          onClick={() => {
                            setEditingNotes(item.id);
                            setTempNotes(prev => ({
                              ...prev,
                              [item.id]: item.notes || ''
                            }));
                          }}
                        >
                          {item.notes ? 'Edit Notes' : 'Add Notes'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Verification Info */}
                  {item.is_verified && item.verified_at && (
                    <p className="text-xs text-green-600 pl-6">
                      ✓ Verified on {new Date(item.verified_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Checklist Summary</h4>
              <p className="text-sm text-steel-600">
                {completionPercentage === 100 ? (
                  <span className="text-green-600">
                    ✓ All requirements verified - Ready for installation
                  </span>
                ) : (
                  `${checklist.items.length - completedCount} items remaining`
                )}
              </p>
            </div>
            {completionPercentage === 100 && (
              <Badge className="bg-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Complete
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
