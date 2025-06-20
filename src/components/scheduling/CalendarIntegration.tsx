import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Download, Upload, Settings, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getCalendarIntegrations, saveCalendarIntegration, syncCalendar, exportCalendar } from '@/lib/schedulingService';
import type { CalendarIntegration, CalendarExportOptions } from '@/types/scheduling';

interface CalendarIntegrationProps {
  onRefresh: () => void;
}

export function CalendarIntegration({ onRefresh }: CalendarIntegrationProps) {
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<CalendarIntegration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [exportOptions, setExportOptions] = useState<CalendarExportOptions>({
    format: 'ics',
    date_range: {
      start: new Date().toISOString().split('T')[0],
      end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    include_events: true,
    include_reminders: true,
    include_attachments: false
  });

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const data = await getCalendarIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
    setLoading(false);
  };

  const handleSaveIntegration = async (integration: CalendarIntegration) => {
    try {
      await saveCalendarIntegration(integration);
      setShowAddDialog(false);
      setEditingIntegration(null);
      loadIntegrations();
    } catch (error) {
      console.error('Error saving integration:', error);
      alert('Failed to save integration');
    }
  };

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId);
    try {
      await syncCalendar(integrationId);
      loadIntegrations();
    } catch (error) {
      console.error('Error syncing calendar:', error);
      alert('Failed to sync calendar');
    }
    setSyncing(null);
  };

  const handleExport = async () => {
    try {
      const data = await exportCalendar(exportOptions);
      
      // Create and download file
      const blob = new Blob([data], { 
        type: exportOptions.format === 'ics' ? 'text/calendar' : 
              exportOptions.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-export.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting calendar:', error);
      alert('Failed to export calendar');
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'google': return '🔵';
      case 'outlook': return '🔴';
      case 'apple': return '⚫';
      case 'ical': return '📅';
      default: return '📋';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'pending_sync': return 'bg-yellow-100 text-yellow-800';
      case 'sync_failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastSync = (lastSync: string | undefined) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar integrations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          {/* Integrations List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar Integrations</CardTitle>
                <Button onClick={() => setShowAddDialog(true)}>
                  Add Integration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map(integration => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getIntegrationIcon(integration.type)}</div>
                      
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-gray-500">
                          {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} Calendar
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          Last sync: {formatLastSync(integration.last_sync)}
                        </div>
                        <Badge className={getSyncStatusColor(integration.sync_status || 'local')}>
                          {integration.sync_status || 'local'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={(enabled) => 
                            handleSaveIntegration({ ...integration, enabled })
                          }
                        />
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                          disabled={syncing === integration.id}
                        >
                          {syncing === integration.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingIntegration(integration);
                            setShowAddDialog(true);
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {integrations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No calendar integrations configured
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Export Format</label>
                  <Select 
                    value={exportOptions.format} 
                    onValueChange={(value: any) => setExportOptions(prev => ({ ...prev, format: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ics">iCalendar (.ics)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      value={exportOptions.date_range.start}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        date_range: { ...prev.date_range, start: e.target.value }
                      }))}
                    />
                    <Input
                      type="date"
                      value={exportOptions.date_range.end}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        date_range: { ...prev.date_range, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_events"
                    checked={exportOptions.include_events}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, include_events: e.target.checked }))}
                  />
                  <label htmlFor="include_events" className="text-sm">Include events</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_reminders"
                    checked={exportOptions.include_reminders}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, include_reminders: e.target.checked }))}
                  />
                  <label htmlFor="include_reminders" className="text-sm">Include reminders</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="include_attachments"
                    checked={exportOptions.include_attachments}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, include_attachments: e.target.checked }))}
                  />
                  <label htmlFor="include_attachments" className="text-sm">Include attachments</label>
                </div>
              </div>
              
              <Button onClick={handleExport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Calendar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          {/* Import Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-600 mb-2">
                  Upload Calendar File
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Supported formats: .ics, .csv, .json
                </div>
                <Button variant="outline">
                  Choose File
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="font-medium mb-2">Import Options:</div>
                <ul className="space-y-1">
                  <li>• Events will be imported as new schedule events</li>
                  <li>• Duplicate events will be skipped</li>
                  <li>• Import will respect your current timezone</li>
                  <li>• Large files may take several minutes to process</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Integration Dialog */}
      {showAddDialog && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Edit Integration' : 'Add Integration'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Integration Name</label>
                <Input
                  value={editingIntegration?.name || ''}
                  onChange={(e) => setEditingIntegration(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  placeholder="Enter integration name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Calendar Type</label>
                <Select 
                  value={editingIntegration?.type || 'ical'} 
                  onValueChange={(value) => setEditingIntegration(prev => 
                    prev ? { ...prev, type: value as any } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Calendar</SelectItem>
                    <SelectItem value="outlook">Outlook Calendar</SelectItem>
                    <SelectItem value="apple">Apple Calendar</SelectItem>
                    <SelectItem value="ical">iCalendar (.ics)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Sync Direction</label>
                <Select 
                  value={editingIntegration?.sync_direction || 'bidirectional'} 
                  onValueChange={(value) => setEditingIntegration(prev => 
                    prev ? { ...prev, sync_direction: value as any } : null
                  )}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">Import Only</SelectItem>
                    <SelectItem value="export">Export Only</SelectItem>
                    <SelectItem value="bidirectional">Bidirectional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingIntegration?.enabled || false}
                  onCheckedChange={(enabled) => setEditingIntegration(prev => 
                    prev ? { ...prev, enabled } : null
                  )}
                />
                <label className="text-sm">Enable integration</label>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => editingIntegration && handleSaveIntegration(editingIntegration)}
                  disabled={!editingIntegration?.name}
                >
                  {editingIntegration ? 'Update' : 'Create'} Integration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 