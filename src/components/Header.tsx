
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-steel-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HGP</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">HOU GEN PROS</span>
              <span className="text-xs text-steel-500 font-medium">PREMIUM POWER SOLUTIONS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-steel-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-steel-700 hover:text-primary font-medium transition-colors">
              Products
            </Link>
            <Link to="/services" className="text-steel-700 hover:text-primary font-medium transition-colors">
              Services
            </Link>
            <Link to="/industries" className="text-steel-700 hover:text-primary font-medium transition-colors">
              Industries
            </Link>
            <Link to="/emergency" className="text-steel-700 hover:text-primary font-medium transition-colors">
              Emergency
            </Link>
            <Link to="/about" className="text-steel-700 hover:text-primary font-medium transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-steel-300 text-steel-700 hover:bg-steel-50">
              <Phone className="w-4 h-4 mr-2" />
              (832) 555-POWER
            </Button>
            <Button className="bg-accent hover:bg-orange-600 text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Get Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-steel-700 hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-steel-200">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link to="/" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                Home
              </Link>
              <Link to="/products" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                Products
              </Link>
              <Link to="/services" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                Services
              </Link>
              <Link to="/industries" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                Industries
              </Link>
              <Link to="/emergency" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                Emergency
              </Link>
              <Link to="/about" className="text-steel-700 hover:text-primary font-medium transition-colors" onClick={toggleMobileMenu}>
                About
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-steel-200">
                <Button variant="outline" size="sm" className="justify-center border-steel-300 text-steel-700">
                  <Phone className="w-4 h-4 mr-2" />
                  (832) 555-POWER
                </Button>
                <Button className="bg-accent hover:bg-orange-600 text-white justify-center">
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
