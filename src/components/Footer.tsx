
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Award, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-128 h-128 bg-steel-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Trust Bar */}
      <div className="border-b border-steel-600/30 py-6 relative z-10">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-steel-300 font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="text-steel-300 font-medium">Generac Authorized</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-steel-300 font-medium">500+ Happy Customers</span>
              </div>
            </div>
            <div className="text-steel-300 font-medium">
              24/7 Emergency Service Available
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto container-padding section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 accent-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">HGP</span>
                </div>
                <div className="absolute inset-0 w-12 h-12 accent-gradient rounded-xl opacity-30 blur"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">HOU GEN PROS</span>
                <span className="text-xs text-steel-300 font-medium tracking-widest">PREMIUM POWER SOLUTIONS</span>
              </div>
            </div>
            <p className="text-steel-300 mb-8 leading-relaxed font-medium">
              Delivering Fortune 500-level generator solutions with unmatched reliability, 
              expert service, and 24/7 support for all your power needs.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" }
              ].map((social, index) => (
                <Button 
                  key={index}
                  size="sm" 
                  variant="outline" 
                  className="border-steel-600 hover:border-accent text-slate-900 bg-slate-50 hover:bg-accent hover:text-white transition-all duration-300 hover-lift"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-gradient">Solutions</h4>
            <ul className="space-y-4">
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
                    className="text-steel-300 hover:text-white transition-colors duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Industries */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-gradient">Industries</h4>
            <ul className="space-y-4">
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
                    className="text-steel-300 hover:text-white transition-colors duration-300 font-medium hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-8 text-gradient">Contact Us</h4>
            <div className="space-y-6">
              {[
                {
                  icon: Phone,
                  title: "(832) 555-POWER",
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
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors duration-300">
                    <contact.icon className="w-5 h-5 text-accent flex-shrink-0" />
                  </div>
                  <div>
                    <div className={`font-semibold ${contact.primary ? 'text-accent text-lg' : 'text-white'}`}>
                      {contact.title}
                    </div>
                    <div className="text-steel-300 text-sm font-medium">{contact.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-steel-600/30 py-8 relative z-10">
        <div className="container mx-auto container-padding">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-steel-300 text-sm mb-4 md:mb-0 font-medium">
              © 2024 HOU GEN PROS. All rights reserved. | Licensed & Insured | TECL License #12345
            </div>
            <div className="flex space-x-8 text-steel-300 text-sm">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/warranty", label: "Warranty" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="hover:text-white transition-colors duration-300 font-medium"
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
