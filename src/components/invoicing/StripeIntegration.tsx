
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Globe, 
  Shield,
  Zap,
  Link as LinkIcon,
  Save,
  TestTube,
  Loader2
} from 'lucide-react';
import { StripeService } from '@/services/stripeService';
import { useToast } from '@/components/ui/use-toast';

interface StripeSettings {
  isConnected: boolean;
  testMode: boolean;
  publicKey: string;
  webhookEndpoint: string;
  currency: string;
  autoInvoicing: boolean;
  paymentMethods: string[];
  companyInfo: {
    name: string;
    address: string;
    taxId: string;
    email: string;
    phone: string;
  };
}

const initialSettings: StripeSettings = {
  isConnected: false,
  testMode: true,
  publicKey: '',
  webhookEndpoint: `${window.location.origin}/api/stripe/webhook`,
  currency: 'usd',
  autoInvoicing: true,
  paymentMethods: ['card', 'ach_debit', 'bank_transfer'],
  companyInfo: {
    name: 'Houston Generator Pros',
    address: '456 Generator Ave, Houston, TX 77001',
    taxId: '12-3456789',
    email: 'billing@houstongeneratorpros.com',
    phone: '+1 (713) 555-0123'
  }
};

export function StripeIntegration() {
  const [settings, setSettings] = useState<StripeSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const account = await StripeService.getAccountStatus();
      if (account.charges_enabled) {
        setConnectionStatus('connected');
        setSettings(prev => ({ ...prev, isConnected: true }));
      } else {
        setConnectionStatus('disconnected');
        setSettings(prev => ({ ...prev, isConnected: false }));
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      setSettings(prev => ({ ...prev, isConnected: false }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving settings - in a real app, this would save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings Saved",
        description: "Your Stripe integration settings have been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { url } = await StripeService.createConnectAccountLink();
      toast({
        title: "Redirecting to Stripe",
        description: "You'll be redirected to complete the connection process",
      });
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to initiate Stripe connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect from Stripe? This will disable payment processing.')) {
      return;
    }
    
    try {
      await StripeService.disconnectAccount();
      setSettings(prev => ({ ...prev, isConnected: false }));
      setConnectionStatus('disconnected');
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from Stripe",
      });
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from Stripe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await Promise.all([
        StripeService.getAccountStatus(),
        StripeService.getBalance(),
        StripeService.getPayments(1)
      ]);
      
      toast({
        title: "Connection Test Successful",
        description: "All Stripe API endpoints are responding correctly",
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Some Stripe API endpoints are not responding correctly",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleWebhookTest = async () => {
    try {
      // In a real implementation, this would test the webhook endpoint
      const response = await fetch(settings.webhookEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true })
      });
      
      if (response.ok) {
        toast({
          title: "Webhook Test Successful",
          description: "Your webhook endpoint is responding correctly",
        });
      } else {
        throw new Error('Webhook endpoint not responding');
      }
    } catch (error) {
      toast({
        title: "Webhook Test Failed",
        description: "Your webhook endpoint is not responding or not configured",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Integration</h1>
          <p className="text-gray-600 mt-1">Configure your Stripe payment processing</p>
        </div>
        <div className="flex items-center space-x-2">
          {connectionStatus === 'checking' ? (
            <Badge variant="secondary">
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Checking...
            </Badge>
          ) : connectionStatus === 'connected' ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              <AlertCircle className="w-4 h-4 mr-1" />
              Disconnected
            </Badge>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Stripe Connected</p>
                      <p className="text-sm text-green-700">Ready to process payments</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="testMode">Test Mode</Label>
                  <Switch
                    id="testMode"
                    checked={settings.testMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({ ...prev, testMode: checked }))
                    }
                  />
                </div>

                <div className="flex space-x-2 flex-wrap gap-2">
                  <Button variant="outline" onClick={handleTestConnection} disabled={isTesting} size="sm">
                    {isTesting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <TestTube className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  <Button variant="outline" onClick={handleDisconnect} size="sm">
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Not Connected</p>
                      <p className="text-sm text-red-700">Connect to Stripe to enable payments</p>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleConnect} disabled={isConnecting} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <LinkIcon className="w-4 h-4 mr-2" />
                  )}
                  {isConnecting ? 'Connecting...' : 'Connect to Stripe'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              API Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="publicKey">Publishable Key</Label>
              <Input
                id="publicKey"
                value={settings.publicKey}
                onChange={(e) => setSettings(prev => ({ ...prev, publicKey: e.target.value }))}
                placeholder="pk_test_..."
                type="password"
              />
            </div>

            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <select
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="usd">USD - US Dollar</option>
                <option value="eur">EUR - Euro</option>
                <option value="gbp">GBP - British Pound</option>
                <option value="cad">CAD - Canadian Dollar</option>
              </select>
            </div>

            <div>
              <Label htmlFor="webhookEndpoint">Webhook Endpoint</Label>
              <div className="flex space-x-2">
                <Input
                  id="webhookEndpoint"
                  value={settings.webhookEndpoint}
                  onChange={(e) => setSettings(prev => ({ ...prev, webhookEndpoint: e.target.value }))}
                  placeholder="https://your-domain.com/api/stripe/webhook"
                />
                <Button variant="outline" onClick={handleWebhookTest} size="sm">
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { id: 'card', name: 'Credit/Debit Cards', icon: CreditCard },
                { id: 'ach_debit', name: 'ACH Direct Debit', icon: Globe },
                { id: 'bank_transfer', name: 'Bank Transfer', icon: Shield }
              ].map((method) => (
                <div key={method.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <method.icon className="w-5 h-5 text-gray-600" />
                    <span>{method.name}</span>
                  </div>
                  <Switch
                    checked={settings.paymentMethods.includes(method.id)}
                    onCheckedChange={(checked) => {
                      setSettings(prev => ({
                        ...prev,
                        paymentMethods: checked
                          ? [...prev.paymentMethods, method.id]
                          : prev.paymentMethods.filter(pm => pm !== method.id)
                      }));
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Automation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoInvoicing">Auto-send Invoices</Label>
                <p className="text-sm text-gray-600">Automatically send invoices upon creation</p>
              </div>
              <Switch
                id="autoInvoicing"
                checked={settings.autoInvoicing}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoInvoicing: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyInfo.name}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  companyInfo: { ...prev.companyInfo, name: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                value={settings.companyInfo.taxId}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  companyInfo: { ...prev.companyInfo, taxId: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={settings.companyInfo.email}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  companyInfo: { ...prev.companyInfo, email: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                value={settings.companyInfo.phone}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  companyInfo: { ...prev.companyInfo, phone: e.target.value }
                }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              id="companyAddress"
              value={settings.companyInfo.address}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                companyInfo: { ...prev.companyInfo, address: e.target.value }
              }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
