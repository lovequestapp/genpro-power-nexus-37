
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  TestTube
} from 'lucide-react';

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
  isConnected: true,
  testMode: true,
  publicKey: 'pk_test_51234567890...',
  webhookEndpoint: 'https://your-domain.com/api/stripe/webhook',
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

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving Stripe settings:', settings);
    setIsSaving(false);
  };

  const handleConnect = () => {
    console.log('Connecting to Stripe...');
    // API integration point for Stripe Connect
  };

  const handleDisconnect = () => {
    console.log('Disconnecting from Stripe...');
    setSettings(prev => ({ ...prev, isConnected: false }));
  };

  const handleTestConnection = () => {
    console.log('Testing Stripe connection...');
    // API integration point
  };

  const handleWebhookTest = () => {
    console.log('Testing webhook endpoint...');
    // API integration point
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
          {settings.isConnected ? (
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
            <Save className="w-4 h-4 mr-2" />
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

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleTestConnection} className="flex-1">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button variant="outline" onClick={handleDisconnect}>
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
                
                <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect to Stripe
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
                <Button variant="outline" onClick={handleWebhookTest}>
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
