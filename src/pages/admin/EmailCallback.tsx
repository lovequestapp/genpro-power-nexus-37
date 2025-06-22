import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { emailService } from '@/services/emailService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function EmailCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        window.opener?.postMessage({ type: 'GMAIL_AUTH_ERROR', error }, window.location.origin);
        window.close();
        return;
      }

      if (code) {
        try {
          const success = await emailService.handleAuthCallback(code);
          
          if (success) {
            window.opener?.postMessage({ 
              type: 'GMAIL_AUTH_SUCCESS',
              accessToken: localStorage.getItem('gmail_access_token'),
              refreshToken: localStorage.getItem('gmail_refresh_token')
            }, window.location.origin);
          } else {
            window.opener?.postMessage({ 
              type: 'GMAIL_AUTH_ERROR', 
              error: 'Failed to authenticate' 
            }, window.location.origin);
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          window.opener?.postMessage({ 
            type: 'GMAIL_AUTH_ERROR', 
            error: 'Authentication failed' 
          }, window.location.origin);
        }
        
        window.close();
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Connecting to Gmail...
            </h2>
            <p className="text-sm text-gray-600 text-center">
              Please wait while we complete the authentication process.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 