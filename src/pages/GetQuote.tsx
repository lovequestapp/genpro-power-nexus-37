import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Phone, Mail, MapPin, Clock, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import DynamicForm from '@/components/forms/DynamicForm';

const GetQuote = () => {
  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-steel-100 py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 text-accent border-accent px-6 py-3 text-base">
              Free Generator Quote
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Get Your Custom Generator Quote
            </h1>
            <p className="text-lg text-steel-600 max-w-2xl mx-auto">
              Complete our quick form and receive a detailed quote within 24 hours. 
              Licensed & insured Houston Generator Pros ready to serve you.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <Card className="shadow-xl border-steel-200">
                  <CardHeader className="bg-gradient-to-r from-primary to-steel-700 text-white rounded-t-lg">
                    <CardTitle className="text-xl sm:text-2xl">
                      Request Your Quote
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-8">
                    <DynamicForm 
                      formSlug="quote-request"
                      className="w-full"
                      onSuccess={(data) => {
                        console.log('Quote request submitted successfully:', data);
                      }}
                      onError={(error) => {
                        console.error('Quote request submission error:', error);
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Benefits & Info */}
              <div className="space-y-8">
                {/* Why Choose Us */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader>
                    <CardTitle className="text-primary">Why Choose Houston Generator Pros?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Licensed & Insured</h4>
                        <p className="text-sm text-steel-600">Full licensing and comprehensive insurance coverage</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Expert Technicians</h4>
                        <p className="text-sm text-steel-600">Certified professionals with years of experience</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Quality Guarantee</h4>
                        <p className="text-sm text-steel-600">All work backed by our satisfaction guarantee</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <h4 className="font-semibold">24/7 Emergency Service</h4>
                        <p className="text-sm text-steel-600">Round-the-clock support when you need it most</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What's Included */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader>
                    <CardTitle className="text-primary">What's Included in Your Quote</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Detailed cost breakdown</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Equipment specifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Installation timeline</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Warranty information</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Maintenance recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Financing options</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="shadow-lg border-steel-200">
                  <CardHeader>
                    <CardTitle className="text-primary">Need Immediate Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">Emergency Service</p>
                        <p className="text-sm text-steel-600">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">Email Support</p>
                        <p className="text-sm text-steel-600">quotes@hougenpros.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-semibold">Service Area</p>
                        <p className="text-sm text-steel-600">Greater Houston & Surrounding Areas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetQuote;
