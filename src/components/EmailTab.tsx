import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2, 
  Search, 
  Plus, 
  RefreshCw, 
  LogOut, 
  LogIn,
  User,
  Clock,
  Paperclip,
  Star,
  Reply,
  Forward,
  MoreHorizontal,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { emailService, EmailMessage, EmailDraft, EmailTemplate } from '@/services/emailService';
import { supabase } from '@/lib/supabase';

interface Customer {
  id: string;
  name: string;
  email: string;
}

export default function EmailTab() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Compose email state
  const [composeEmail, setComposeEmail] = useState<EmailDraft>({
    subject: '',
    to: [],
    cc: [],
    bcc: [],
    body: '',
    customerId: undefined,
    projectId: undefined,
  });

  // Customer email state
  const [customerEmail, setCustomerEmail] = useState({
    subject: '',
    body: '',
    templateId: '',
  });

  useEffect(() => {
    checkAuthStatus();
    loadCustomers();
    loadTemplates();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadEmails();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuthStatus = () => {
    const status = emailService.getAuthStatus();
    setIsAuthenticated(status.isAuthenticated);
  };

  const handleGmailAuth = async () => {
    setIsLoading(true);
    try {
      const success = await emailService.authenticateGmail();
      if (success) {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Successfully connected to Gmail",
        });
        loadEmails();
      } else {
        toast({
          title: "Error",
          description: "Failed to connect to Gmail",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Gmail auth error:', error);
      
      let errorMessage = "Authentication failed";
      
      if (error.message.includes('credentials not configured')) {
        errorMessage = "Gmail OAuth not configured. Please set up your Google Cloud credentials.";
      } else if (error.message.includes('Popup blocked')) {
        errorMessage = "Popup blocked. Please allow popups for this site.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Gmail Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    emailService.signOut();
    setIsAuthenticated(false);
    setEmails([]);
    setSelectedEmail(null);
    toast({
      title: "Signed Out",
      description: "Successfully disconnected from Gmail",
    });
  };

  const loadEmails = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      let query = '';
      if (activeTab === 'inbox') {
        query = 'in:inbox';
      } else if (activeTab === 'sent') {
        query = 'in:sent';
      } else if (activeTab === 'drafts') {
        query = 'in:drafts';
      } else if (activeTab === 'trash') {
        query = 'in:trash';
      }

      if (searchQuery) {
        query += ` ${searchQuery}`;
      }

      const emailList = await emailService.getEmails(query, 50);
      setEmails(emailList);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateList = await emailService.getEmailTemplates();
      setTemplates(templateList);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleSendEmail = async () => {
    if (!composeEmail.to.length || !composeEmail.subject || !composeEmail.body) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await emailService.sendEmail(composeEmail);
      if (success) {
        toast({
          title: "Success",
          description: "Email sent successfully",
        });
        setShowComposeDialog(false);
        setComposeEmail({
          subject: '',
          to: [],
          cc: [],
          bcc: [],
          body: '',
        });
        loadEmails();
      } else {
        toast({
          title: "Error",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCustomerEmail = async () => {
    if (!selectedCustomer || !customerEmail.subject || !customerEmail.body) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await emailService.sendEmailToCustomer(
        selectedCustomer.id,
        customerEmail.subject,
        customerEmail.body
      );
      
      if (success) {
        toast({
          title: "Success",
          description: `Email sent to ${selectedCustomer.name}`,
        });
        setShowCustomerDialog(false);
        setCustomerEmail({ subject: '', body: '', templateId: '' });
        setSelectedCustomer(null);
      } else {
        toast({
          title: "Error",
          description: "Failed to send email",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCustomerEmail({
        subject: template.subject,
        body: template.body,
        templateId,
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getEmailIcon = (email: EmailMessage) => {
    if (email.hasAttachments) return <Paperclip className="h-4 w-4" />;
    if (!email.isRead) return <Mail className="h-4 w-4 text-blue-600" />;
    return <Mail className="h-4 w-4 text-gray-400" />;
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Integration
            </CardTitle>
            <CardDescription>
              Connect your Gmail account to manage emails directly from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Connect Gmail Account</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Sign in to your Gmail account to access your emails
                  </p>
                </div>
                <Button 
                  onClick={handleGmailAuth} 
                  disabled={isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Connect Gmail
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Email
          </h2>
          <p className="text-gray-600">Manage your emails and communicate with customers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadEmails} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setShowComposeDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Email Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === 'inbox' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('inbox')}
              >
                <Inbox className="h-4 w-4 mr-2" />
                Inbox
                <Badge variant="secondary" className="ml-auto">
                  {emails.filter(e => !e.isRead).length}
                </Badge>
              </Button>
              <Button
                variant={activeTab === 'sent' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('sent')}
              >
                <Send className="h-4 w-4 mr-2" />
                Sent
              </Button>
              <Button
                variant={activeTab === 'drafts' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('drafts')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Drafts
              </Button>
              <Button
                variant={activeTab === 'trash' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('trash')}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowCustomerDialog(true)}
              >
                <User className="h-4 w-4 mr-2" />
                Email Customer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Email List */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={loadEmails}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email List */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : emails.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <Mail className="h-8 w-8 mr-2" />
                  No emails found
                </div>
              ) : (
                <div className="divide-y">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                      } ${!email.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getEmailIcon(email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium truncate ${
                              !email.isRead ? 'text-gray-900' : 'text-gray-600'
                            }`}>
                              {email.from}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{formatDate(email.date)}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Reply className="h-3 w-3 mr-2" />
                                    Reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Forward className="h-3 w-3 mr-2" />
                                    Forward
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Archive className="h-3 w-3 mr-2" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className={`text-sm truncate ${
                            !email.isRead ? 'font-medium' : ''
                          }`}>
                            {email.subject}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {email.snippet}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEmail.subject}</DialogTitle>
              <DialogDescription>
                From: {selectedEmail.from} • To: {selectedEmail.to.join(', ')}
                {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                  <> • CC: {selectedEmail.cc.join(', ')}</>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  {selectedEmail.hasAttachments && (
                    <Badge variant="outline">
                      <Paperclip className="h-3 w-3 mr-1" />
                      Attachments
                    </Badge>
                  )}
                  <Button variant="outline" size="sm">
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-3 w-3 mr-1" />
                    Forward
                  </Button>
                </div>
              </div>
              <div className="prose max-w-none">
                {selectedEmail.htmlBody ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }} />
                ) : (
                  <pre className="whitespace-pre-wrap font-sans">{selectedEmail.body}</pre>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Compose Email Dialog */}
      <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To</label>
              <Input
                placeholder="recipient@example.com"
                value={composeEmail.to.join(', ')}
                onChange={(e) => setComposeEmail({
                  ...composeEmail,
                  to: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">CC</label>
              <Input
                placeholder="cc@example.com"
                value={composeEmail.cc?.join(', ') || ''}
                onChange={(e) => setComposeEmail({
                  ...composeEmail,
                  cc: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Subject"
                value={composeEmail.subject}
                onChange={(e) => setComposeEmail({
                  ...composeEmail,
                  subject: e.target.value
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Write your message..."
                value={composeEmail.body}
                onChange={(e) => setComposeEmail({
                  ...composeEmail,
                  body: e.target.value
                })}
                rows={10}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Email Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Customer</DialogTitle>
            <DialogDescription>
              Send an email to a customer directly from your dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer</label>
              <Select onValueChange={(customerId) => {
                const customer = customers.find(c => c.id === customerId);
                setSelectedCustomer(customer || null);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Template (Optional)</label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Subject"
                value={customerEmail.subject}
                onChange={(e) => setCustomerEmail({
                  ...customerEmail,
                  subject: e.target.value
                })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Write your message..."
                value={customerEmail.body}
                onChange={(e) => setCustomerEmail({
                  ...customerEmail,
                  body: e.target.value
                })}
                rows={10}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCustomerEmail} disabled={isLoading || !selectedCustomer}>
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send to Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 