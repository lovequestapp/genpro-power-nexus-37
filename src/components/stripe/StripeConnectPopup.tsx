
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { StripeService } from '@/services/stripeService';

interface StripeConnectPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectionSuccess: () => void;
}

export function StripeConnectPopup({ open, onOpenChange, onConnectionSuccess }: StripeConnectPopupProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'initial' | 'connecting' | 'success'>('initial');

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setStep('connecting');

    try {
      const { url } = await StripeService.createConnectAccountLink();
      
      // Open Stripe Connect in a popup window
      const popup = window.open(
        url,
        'stripe-connect',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Poll for popup closure or success
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if connection was successful
          checkConnectionStatus();
        }
      }, 1000);

      // Also listen for messages from the popup
      window.addEventListener('message', (event) => {
        if (event.data.type === 'stripe-connect-success') {
          clearInterval(checkClosed);
          popup.close();
          setStep('success');
          setTimeout(() => {
            onConnectionSuccess();
            onOpenChange(false);
          }, 2000);
        }
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Stripe');
      setStep('initial');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const account = await StripeService.getAccountStatus();
      if (account.charges_enabled) {
        setStep('success');
        setTimeout(() => {
          onConnectionSuccess();
          onOpenChange(false);
        }, 2000);
      } else {
        setError('Connection was not completed. Please try again.');
        setStep('initial');
      }
    } catch (err) {
      setError('Failed to verify connection status.');
      setStep('initial');
    }
  };

  useEffect(() => {
    if (!open) {
      setStep('initial');
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {step === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <ExternalLink className="w-5 h-5 mr-2" />
            )}
            {step === 'success' ? 'Successfully Connected!' : 'Connect to Stripe'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 'initial' && (
            <>
              <p className="text-sm text-gray-600">
                Connect your Stripe account to start accepting payments and managing your business.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Secure OAuth connection
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  No sensitive data stored locally
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Full control over permissions
                </div>
              </div>

              <Button 
                onClick={handleConnect} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Connect with Stripe
              </Button>
            </>
          )}

          {step === 'connecting' && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-sm text-gray-600">
                Complete the connection in the popup window...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <p className="text-lg font-medium text-green-600 mb-2">
                Connected Successfully!
              </p>
              <p className="text-sm text-gray-600">
                Your Stripe account is now connected and ready to use.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
