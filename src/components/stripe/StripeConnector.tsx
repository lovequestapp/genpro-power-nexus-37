
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
  Zap,
  Loader2
} from 'lucide-react';
import { StripeService } from '@/services/stripeService';
import { useToast } from '@/components/ui/use-toast';

interface StripeConnectorProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function StripeConnector({ onConnectionChange }: StripeConnectorProps) {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const account = await StripeService.getAccountStatus();
      if (account.charges_enabled) {
        setAccountData(account);
        setConnected(true);
        onConnectionChange?.(true);
        toast({
          title: "Connection Status",
          description: "Stripe account is connected and active",
        });
      } else {
        setConnected(false);
        onConnectionChange?.(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check connection';
      setError(errorMessage);
      setConnected(false);
      onConnectionChange?.(false);
      toast({
        title: "Connection Check Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initiateConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { url } = await StripeService.createConnectAccountLink();
      
      toast({
        title: "Redirecting to Stripe",
        description: "You'll be redirected to complete the connection process",
      });

      // Redirect to Stripe Connect onboarding
      window.location.href = url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Stripe';
      setError(errorMessage);
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setError(null);
    
    try {
      // Test multiple endpoints to verify connection
      await Promise.all([
        StripeService.getAccountStatus(),
        StripeService.getBalance(),
        StripeService.getPayments(1)
      ]);
      
      toast({
        title: "Connection Test Successful",
        description: "All Stripe API endpoints are responding correctly",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      toast({
        title: "Connection Test Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const disconnectAccount = async () => {
    if (!window.confirm('Are you sure you want to disconnect your Stripe account? This will disable payment processing.')) {
      return;
    }
    
    setLoading(true);
    try {
      await StripeService.disconnectAccount();
      setConnected(false);
      setAccountData(null);
      onConnectionChange?.(false);
      toast({
        title: "Account Disconnected",
        description: "Your Stripe account has been disconnected",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect account';
      setError(errorMessage);
      toast({
        title: "Disconnect Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !connected && !testing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Account ID</p>
            <p className="font-mono text-sm">{accountData?.id || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm">{accountData?.email || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-sm">{accountData?.country || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">
                {accountData?.charges_enabled ? 'Fully activated' : 'Setup required'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 flex-wrap gap-2">
          <Button variant="outline" onClick={checkConnection} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={testConnection} disabled={testing}>
            {testing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Test Connection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Stripe Dashboard
          </Button>
          <Button variant="destructive" onClick={disconnectAccount} disabled={loading}>
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
