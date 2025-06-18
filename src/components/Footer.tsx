
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Award, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-steel-900 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-128 sm:h-128 bg-steel-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Trust Bar */}
      <div className="border-b border-steel-200/30 py-4 sm:py-6 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="font-medium text-sm sm:text-base">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                <span className="font-medium text-sm sm:text-base">Generac Authorized</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-medium text-sm sm:text-base">500+ Happy Customers</span>
              </div>
            </div>
            <div className="font-medium text-sm sm:text-base">
              24/7 Emergency Service Available
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Enhanced Company Info */}
          <div className="lg:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-xl">HGP</span>
                </div>
                <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 accent-gradient rounded-xl opacity-30 blur"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold">HOU GEN PROS</span>
                <span className="text-xs font-medium tracking-widest">PREMIUM POWER SOLUTIONS</span>
              </div>
            </div>
            <p className="mb-6 sm:mb-8 leading-relaxed font-medium text-sm sm:text-base">
              Delivering Fortune 500-level generator solutions with unmatched reliability, 
              expert service, and 24/7 support for all your power needs.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" }
              ].map((social, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant="outline" 
                  className="border-steel-300 hover:border-accent text-steel-900 bg-white hover:bg-accent hover:text-white transition-all duration-300 hover-lift touch-manipulation"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">Solutions</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { to: "/products", label: "Generator Sales" },
                { to: "/services", label: "Rental Solutions" },
                { to: "/services", label: "Installation" },
                { to: "/services", label: "Maintenance" },
                { to: "/emergency", label: "Emergency Support" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="hover:text-accent transition-colors duration-300 font-medium hover:translate-x-1 inline-block text-sm sm:text-base touch-manipulation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Industries */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">Industries</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { to: "/industries", label: "Construction" },
                { to: "/industries", label: "Healthcare" },
                { to: "/industries", label: "Real Estate" },
                { to: "/industries", label: "Government" },
                { to: "/industries", label: "Events" }
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="hover:text-accent transition-colors duration-300 font-medium hover:translate-x-1 inline-block text-sm sm:text-base touch-manipulation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8">Contact Us</h4>
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  icon: Phone,
                  title: "(915) 800-7767",
                  subtitle: "24/7 Emergency Line",
                  primary: true
                },
                {
                  icon: Mail,
                  title: "info@hougenpros.com",
                  subtitle: "General Inquiries"
                },
                {
                  icon: MapPin,
                  title: "Houston, TX",
                  subtitle: "Serving Texas & Beyond"
                },
                {
                  icon: Clock,
                  title: "24/7 Emergency",
                  subtitle: "Mon-Fri 8AM-6PM Office"
                }
              ].map((contact, index) => (
                <div key={index} className="flex items-start justify-center sm:justify-start space-x-3 sm:space-x-4 group">
                  <div className="p-1.5 sm:p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors duration-300 flex-shrink-0">
                    <contact.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className={`font-semibold text-sm sm:text-base ${contact.primary ? 'text-accent' : ''}`}>
                      {contact.title}
                    </div>
                    <div className="text-xs sm:text-sm font-medium">{contact.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-steel-200/30 py-6 sm:py-8 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-xs sm:text-sm font-medium text-center sm:text-left">
              © 2024 HOU GEN PROS. All rights reserved. | Licensed & Insured | TECL License #12345
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/warranty", label: "Warranty" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="hover:text-accent transition-colors duration-300 font-medium text-center touch-manipulation"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
