import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HGP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">HOU GEN PROS</span>
                <span className="text-xs text-steel-300 font-medium">PREMIUM POWER SOLUTIONS</span>
              </div>
            </div>
            <p className="text-steel-300 mb-6 leading-relaxed">
              Delivering Fortune 500-level generator solutions with unmatched reliability, 
              expert service, and 24/7 support for all your power needs.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="outline" className="border-steel-600 hover:border-accent text-slate-900 bg-slate-50">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-steel-600 hover:border-accent text-slate-900 bg-slate-50">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-steel-600 hover:border-accent bg-slate-50 text-slate-900">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Solutions</h4>
            <ul className="space-y-3">
              <li><Link to="/products" className="text-steel-300 hover:text-white transition-colors">Generator Sales</Link></li>
              <li><Link to="/services" className="text-steel-300 hover:text-white transition-colors">Rental Solutions</Link></li>
              <li><Link to="/services" className="text-steel-300 hover:text-white transition-colors">Installation</Link></li>
              <li><Link to="/services" className="text-steel-300 hover:text-white transition-colors">Maintenance</Link></li>
              <li><Link to="/emergency" className="text-steel-300 hover:text-white transition-colors">Emergency Support</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-lg font-bold mb-6">Industries</h4>
            <ul className="space-y-3">
              <li><Link to="/industries" className="text-steel-300 hover:text-white transition-colors">Construction</Link></li>
              <li><Link to="/industries" className="text-steel-300 hover:text-white transition-colors">Healthcare</Link></li>
              <li><Link to="/industries" className="text-steel-300 hover:text-white transition-colors">Real Estate</Link></li>
              <li><Link to="/industries" className="text-steel-300 hover:text-white transition-colors">Government</Link></li>
              <li><Link to="/industries" className="text-steel-300 hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">(832) 555-POWER</div>
                  <div className="text-steel-300 text-sm">24/7 Emergency Line</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">info@hougenpros.com</div>
                  <div className="text-steel-300 text-sm">General Inquiries</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Houston, TX</div>
                  <div className="text-steel-300 text-sm">Serving Texas & Beyond</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">24/7 Emergency</div>
                  <div className="text-steel-300 text-sm">Mon-Fri 8AM-6PM Office</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-steel-600 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-steel-300 text-sm mb-4 md:mb-0">
              © 2024 HOU GEN PROS. All rights reserved. | Licensed & Insured
            </div>
            <div className="flex space-x-6 text-steel-300 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/warranty" className="hover:text-white transition-colors">Warranty</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;