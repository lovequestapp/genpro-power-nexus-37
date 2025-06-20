
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw,
  Shield,
  CreditCard,
  Globe,
  Zap
} from 'lucide-react';
import { StripeService } from '@/services/stripeService';

interface StripeConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function StripeConnector({ onConnectionChange }: StripeConnectorProps) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const account = await StripeService.getAccountStatus();
      if (account.charges_enabled) {
        setAccountData(account);
        setConnected(true);
        onConnectionChange?.(true);
      } else {
        setConnected(false);
        onConnectionChange?.(false);
      }
    } catch (err) {
      setError('Not connected to Stripe');
      setConnected(false);
      onConnectionChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  const initiateConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { url } = await StripeService.createConnectAccountLink();
      
      // Redirect to Stripe Connect onboarding
      window.location.href = url;
    } catch (err) {
      setError('Failed to connect to Stripe. Please try again.');
      console.error('Stripe connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectAccount = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Stripe account?')) {
      return;
    }
    
    setLoading(true);
    try {
      await StripeService.disconnectAccount();
      setConnected(false);
      setAccountData(null);
      onConnectionChange?.(false);
    } catch (err) {
      setError('Failed to disconnect account');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !connected) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Checking Stripe connection...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Connect Your Stripe Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <p className="text-gray-600">
              Connect your Stripe account to start accepting payments and managing your business directly from this dashboard.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Secure</p>
                  <p className="text-sm text-blue-700">Bank-level security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Zap className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Fast Setup</p>
                  <p className="text-sm text-green-700">5-minute onboarding</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Globe className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Global</p>
                  <p className="text-sm text-purple-700">Worldwide payments</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={initiateConnection} 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect with Stripe
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              By connecting, you agree to Stripe's Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Stripe Account Connected
          </div>
          <Badge className="bg-green-100 text-green-800">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="font-mono text-sm">{accountData?.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm">{accountData?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-sm">{accountData?.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Fully activated</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={checkConnection} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Stripe Dashboard
          </Button>
          <Button variant="destructive" onClick={disconnectAccount}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
