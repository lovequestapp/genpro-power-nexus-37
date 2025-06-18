
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white border-b border-steel-200/60 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo with 3D Effect */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 group">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-500 transform group-hover:scale-105">
                <span className="text-white font-bold text-lg sm:text-xl tracking-tight">HGP</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary tracking-tight group-hover:text-accent transition-colors duration-500">HOU GEN PROS</span>
              <span className="text-xs text-steel-500 font-medium tracking-widest uppercase hidden sm:block">Premium Power Solutions</span>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
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
                className="relative px-4 py-2 text-steel-700 hover:text-primary font-medium transition-all duration-500 rounded-lg hover:bg-steel-50/80 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-accent to-orange-600 transition-all duration-500 group-hover:w-3/4 transform -translate-x-1/2"></span>
              </Link>
            ))}
          </nav>

          {/* Enhanced Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-steel-300 text-steel-700 hover:bg-steel-50 hover:border-steel-400 transition-all duration-500 font-medium bg-white hover:scale-105 transform"
            >
              <Phone className="w-4 h-4 mr-2" />
              <span className="hidden xl:inline">(915) 800-7767</span>
              <span className="xl:hidden">Call</span>
            </Button>
            <Link to="/get-quote">
              <Button 
                className="accent-gradient text-white hover:shadow-glow transition-all duration-500 font-semibold px-4 xl:px-6 hover:scale-105 transform"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Get Quote
              </Button>
            </Link>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="xl:hidden p-2 sm:p-3 text-steel-700 hover:text-primary transition-all duration-500 hover:bg-steel-50 rounded-lg touch-manipulation hover:scale-105 transform"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enhanced Mobile Menu with Smooth Animation */}
        <div className={`xl:hidden overflow-hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-4 sm:mt-6 pb-4 sm:pb-6 border-t border-steel-200/60 bg-white/95 backdrop-blur-xl rounded-lg">
            <nav className="flex flex-col space-y-1 mt-4 sm:mt-6">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/services', label: 'Services' },
                { to: '/industries', label: 'Industries' },
                { to: '/emergency', label: 'Emergency' },
                { to: '/about', label: 'About' }
              ].map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-steel-700 hover:text-primary font-medium transition-all duration-500 py-3 px-2 rounded-lg hover:bg-steel-50/80 touch-manipulation text-lg sm:text-base transform hover:translate-x-2"
                  onClick={toggleMobileMenu}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-steel-200/60">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="justify-center border-steel-300 text-steel-700 hover:bg-steel-50 font-medium touch-manipulation h-12 sm:h-auto bg-white hover:scale-105 transform transition-all duration-500"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (915) 800-7767
                </Button>
                <Link to="/get-quote" onClick={toggleMobileMenu}>
                  <Button 
                    size="lg"
                    className="accent-gradient text-white justify-center font-semibold shadow-lg touch-manipulation h-12 sm:h-auto hover:scale-105 transform transition-all duration-500 w-full"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Get Free Quote
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
