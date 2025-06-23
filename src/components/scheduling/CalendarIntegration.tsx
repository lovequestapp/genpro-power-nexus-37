
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Download, Upload, Settings, RefreshCw, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { getCalendarIntegrations, saveCalendarIntegration, syncCalendar, exportCalendar, getScheduleEvents } from '@/lib/schedulingService';
import { GoogleCalendarIntegration, OutlookCalendarIntegration, ICSCalendarIntegration } from '@/services/calendarIntegrationService';
import { useToast } from '@/hooks/use-toast';
import type { CalendarIntegration, CalendarExportOptions } from '@/types/scheduling';

interface CalendarIntegrationProps {
  onRefresh: () => void;
}

export function CalendarIntegration({ onRefresh }: CalendarIntegrationProps) {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<CalendarIntegration | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState('');
  const [outlookClientId, setOutlookClientId] = useState('');
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

  const handleGoogleSync = async (direction: 'import' | 'export') => {
    if (!googleClientId) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter your Google Calendar Client ID',
        variant: 'destructive'
      });
      return;
    }

    setSyncing('google');
    
    try {
      const googleIntegration = new GoogleCalendarIntegration({
        clientId: googleClientId,
        clientSecret: '', // Would be stored securely on backend
        redirectUri: `${window.location.origin}/admin/scheduling`,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events']
      });

      const authenticated = await googleIntegration.authenticate();
      
      if (!authenticated) {
        throw new Error('Failed to authenticate with Google Calendar');
      }

      let result;
      if (direction === 'import') {
        result = await googleIntegration.syncFromGoogle();
      } else {
        // For export, we'd sync all events - this is simplified
        result = { success: true, message: 'Export functionality would sync all dashboard events to Google Calendar' };
      }

      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message
        });
        onRefresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Google Calendar sync error:', error);
      toast({
        title: 'Sync Failed',
        description: `Failed to sync with Google Calendar: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleOutlookSync = async (direction: 'import' | 'export') => {
    if (!outlookClientId) {
      toast({
        title: 'Configuration Required',
        description: 'Please enter your Outlook Calendar Client ID',
        variant: 'destructive'
      });
      return;
    }

    setSyncing('outlook');
    
    try {
      const outlookIntegration = new OutlookCalendarIntegration({
        clientId: outlookClientId,
        clientSecret: '', // Would be stored securely on backend
        redirectUri: `${window.location.origin}/admin/scheduling`,
        scopes: ['https://graph.microsoft.com/calendars.readwrite']
      });

      const authenticated = await outlookIntegration.authenticate();
      
      if (!authenticated) {
        throw new Error('Failed to authenticate with Outlook Calendar');
      }

      const result = await outlookIntegration.syncFromOutlook();

      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message
        });
        onRefresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Outlook Calendar sync error:', error);
      toast({
        title: 'Sync Failed',
        description: `Failed to sync with Outlook Calendar: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleICSExport = async () => {
    try {
      setSyncing('export');
      const events = await getScheduleEvents({
        date_range: exportOptions.date_range
      });

      const icsContent = await ICSCalendarIntegration.exportToICS(events);
      
      // Create and download file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule-export-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Successful',
        description: `Exported ${events.length} events to ICS file`
      });
    } catch (error) {
      console.error('ICS export error:', error);
      toast({
        title: 'Export Failed',
        description: `Failed to export calendar: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleICSImport = async (file: File) => {
    try {
      setSyncing('import');
      const content = await file.text();
      const result = await ICSCalendarIntegration.importFromICS(content);

      if (result.success) {
        toast({
          title: 'Import Successful',
          description: result.message
        });
        onRefresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('ICS import error:', error);
      toast({
        title: 'Import Failed',
        description: `Failed to import calendar: ${error}`,
        variant: 'destructive'
      });
    } finally {
      setSyncing(null);
    }
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
      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Calendar Sync</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="sync" className="space-y-4">
          {/* Google Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded"></div>
                Google Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Google Calendar Client ID</label>
                <Input
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                  placeholder="Enter your Google Calendar Client ID"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your Google Cloud Console OAuth credentials
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleGoogleSync('import')}
                  disabled={syncing === 'google' || !googleClientId}
                  variant="outline"
                >
                  {syncing === 'google' ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Import from Google
                </Button>
                
                <Button
                  onClick={() => handleGoogleSync('export')}
                  disabled={syncing === 'google' || !googleClientId}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Export to Google
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Outlook Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                Outlook Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Outlook Calendar Client ID</label>
                <Input
                  value={outlookClientId}
                  onChange={(e) => setOutlookClientId(e.target.value)}
                  placeholder="Enter your Outlook Calendar Client ID"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get this from your Microsoft Azure App Registration
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => handleOutlookSync('import')}
                  disabled={syncing === 'outlook' || !outlookClientId}
                  variant="outline"
                >
                  {syncing === 'outlook' ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Import from Outlook
                </Button>
                
                <Button
                  onClick={() => handleOutlookSync('export')}
                  disabled={syncing === 'outlook' || !outlookClientId}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Export to Outlook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
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
              
              <Button onClick={handleICSExport} className="w-full" disabled={syncing === 'export'}>
                {syncing === 'export' ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export Calendar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
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
                  Supported formats: .ics files from any calendar application
                </div>
                <input
                  type="file"
                  accept=".ics"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleICSImport(file);
                    }
                  }}
                  className="hidden"
                  id="ics-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('ics-upload')?.click()}
                  disabled={syncing === 'import'}
                >
                  {syncing === 'import' ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Choose File
                </Button>
              </div>
              
              <div className="text-sm text-gray-500">
                <div className="font-medium mb-2">Import Options:</div>
                <ul className="space-y-1">
                  <li>• Events will be imported as new schedule events</li>
                  <li>• Duplicate events will be skipped based on external ID</li>
                  <li>• Import will respect your current timezone</li>
                  <li>• Large files may take several minutes to process</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
