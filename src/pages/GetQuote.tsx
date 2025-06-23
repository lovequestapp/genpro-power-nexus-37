
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Phone, Mail, MapPin, Clock, Shield, Star, Zap, Calculator, Award, Users, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import QuoteForm from '@/components/QuoteForm';
import Header from '@/components/Header';
import SEO from '../components/SEO';

const GetQuote = () => {
  return (
    <div>
      <SEO 
        title="Free Generator Quote Houston | Get Generator Installation Estimate | HOU GEN PROS"
        description="Get a free generator installation quote in Houston. Professional estimates for Generac generators, whole home backup power, and installation services. No obligation, competitive pricing."
        keywords="free generator quote Houston, generator installation estimate Houston, Generac quote Houston, generator pricing Houston, generator cost estimate Houston, free generator consultation Houston, generator installation cost Houston"
        canonical="/get-quote"
        pageType="website"
      />
      <Header />
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-steel-100 py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 text-accent border-accent px-6 py-3 text-base">
              Free Generator Quote
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 hyphens-none break-words leading-tight">
              Get Your Custom{' '}
              <span className="block sm:inline">Generator Quote</span>
            </h1>
            <p className="text-base sm:text-lg text-steel-600 max-w-3xl mx-auto leading-relaxed">
              Complete our comprehensive quote form and receive a detailed estimate within 24 hours. 
              Our licensed & insured Houston Generator Pros are ready to provide you with the best solution for your power needs.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form - Make sure it's prominently displayed */}
              <div className="lg:col-span-2 order-1">
                <QuoteForm />
              </div>

              {/* Benefits & Info */}
              <div className="space-y-8 order-2">
                {/* Why Choose Us */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader className="bg-gradient-to-r from-primary to-steel-700 text-white rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2 hyphens-none">
                      <Star className="w-5 h-5" />
                      Why Choose Houston Generator Pros?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">Licensed & Insured</h4>
                        <p className="text-sm text-steel-600">Full licensing and comprehensive insurance coverage for your peace of mind</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">Expert Technicians</h4>
                        <p className="text-sm text-steel-600">Certified professionals with years of experience in generator systems</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">Quality Guarantee</h4>
                        <p className="text-sm text-steel-600">All work backed by our satisfaction guarantee and warranty</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">24/7 Emergency Service</h4>
                        <p className="text-sm text-steel-600">Round-the-clock support when you need it most</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">Local Expertise</h4>
                        <p className="text-sm text-steel-600">Houston-based team with deep knowledge of local requirements</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-steel-800 hyphens-none">Fast Response</h4>
                        <p className="text-sm text-steel-600">Quick response times and efficient project completion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader className="bg-gradient-to-r from-accent to-accent/80 text-white rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2 hyphens-none">
                      <Calculator className="w-5 h-5" />
                      What's Included in Your Quote
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Detailed cost breakdown</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Equipment specifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Installation timeline</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Warranty information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Maintenance recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Financing options</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Permit assistance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-steel-700">Post-installation support</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Areas */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2 hyphens-none">
                      <MapPin className="w-5 h-5" />
                      Service Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-steel-600 mb-3">
                      We proudly serve the Greater Houston area and surrounding communities:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Houston</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Sugar Land</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">The Woodlands</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Katy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Pearland</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Spring</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Cypress</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <span className="text-steel-700">Kingwood</span>
                      </div>
                    </div>
                    <p className="text-xs text-steel-500 mt-3">
                      Don't see your area? Contact us to check availability.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                    <CardTitle className="text-lg flex items-center gap-2 hyphens-none">
                      <Phone className="w-5 h-5" />
                      Need Immediate Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold text-steel-800 hyphens-none">Emergency Service</p>
                        <a 
                          href="tel:+19158007767" 
                          className="text-sm text-steel-600 hover:text-accent transition-colors cursor-pointer"
                        >
                          (915) 800-7767
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold text-steel-800 hyphens-none">Email Support</p>
                        <p className="text-sm text-steel-600">quotes@hougenpros.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold text-steel-800 hyphens-none">Service Area</p>
                        <p className="text-sm text-steel-600">Greater Houston & Surrounding Areas</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Link 
                        to="/emergency" 
                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors hyphens-none"
                      >
                        Emergency Service Request
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetQuote;
