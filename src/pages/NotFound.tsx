import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div>
      <SEO 
        title="Page Not Found | 404 Error | HOU GEN PROS"
        description="Page not found. The page you're looking for doesn't exist. Return to HOU GEN PROS homepage for Houston generator services."
        keywords="404 error, page not found, Houston generator company"
        canonical="/404"
        pageType="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-steel-50 to-white">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-steel-800 mb-4">Page Not Found</h2>
          <p className="text-steel-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
