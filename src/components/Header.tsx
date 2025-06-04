
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-steel-200/60 transition-all duration-300">
      <div className="container mx-auto container-padding py-4">
        <div className="flex items-center justify-between">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="w-12 h-12 accent-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-white font-bold text-xl tracking-tight">HGP</span>
              </div>
              <div className="absolute inset-0 w-12 h-12 accent-gradient rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary tracking-tight">HOU GEN PROS</span>
              <span className="text-xs text-steel-500 font-medium tracking-widest uppercase">Premium Power Solutions</span>
            </div>
          </Link>

          {/* Premium Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/services', label: 'Services' },
              { to: '/industries', label: 'Industries' },
              { to: '/emergency', label: 'Emergency' },
              { to: '/about', label: 'About' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-steel-700 hover:text-primary font-medium transition-all duration-300 rounded-lg hover:bg-steel-50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-orange-600 transition-all duration-300 group-hover:w-3/4 transform -translate-x-1/2"></span>
              </Link>
            ))}
          </nav>

          {/* Premium CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-steel-300 text-steel-700 hover:bg-steel-50 hover:border-steel-400 transition-all duration-300 font-medium"
            >
              <Phone className="w-4 h-4 mr-2" />
              (832) 555-POWER
            </Button>
            <Button 
              className="accent-gradient text-white hover:shadow-glow transition-all duration-300 font-semibold px-6"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-3 text-steel-700 hover:text-primary transition-colors duration-300 hover:bg-steel-50 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 border-t border-steel-200/60">
            <nav className="flex flex-col space-y-2 mt-6">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/services', label: 'Services' },
                { to: '/industries', label: 'Industries' },
                { to: '/emergency', label: 'Emergency' },
                { to: '/about', label: 'About' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-steel-700 hover:text-primary font-medium transition-colors duration-300 py-3 px-2 rounded-lg hover:bg-steel-50"
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-4 pt-6 border-t border-steel-200/60">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-center border-steel-300 text-steel-700 hover:bg-steel-50 font-medium"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (832) 555-POWER
                </Button>
                <Button 
                  className="accent-gradient text-white justify-center font-semibold shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Get Quote
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
