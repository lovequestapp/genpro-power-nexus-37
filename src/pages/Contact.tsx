
import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, CheckCircle, Star, Users } from 'lucide-react';
import DynamicForm from '@/components/forms/DynamicForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '../components/SEO';

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      primary: "(915) 800-7767",
      secondary: "24/7 Emergency Service",
      action: () => window.location.href = 'tel:+19158007767'
    },
    {
      icon: Mail,
      title: "Email", 
      primary: "info@hougenpros.com",
      secondary: "We'll respond within 24 hours",
      action: () => window.location.href = 'mailto:info@hougenpros.com'
    },
    {
      icon: MapPin,
      title: "Service Area",
      primary: "Houston & Surrounding Areas",
      secondary: "50+ mile radius coverage",
      action: null
    },
    {
      icon: Clock,
      title: "Business Hours",
      primary: "Mon-Fri: 7:00 AM - 7:00 PM",
      secondary: "Sat-Sun: Emergency Service",
      action: null
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Licensed & Insured",
      description: "Fully licensed electrical contractors with comprehensive insurance coverage"
    },
    {
      icon: Star,
      title: "5-Star Rated",
      description: "Over 500+ five-star reviews from satisfied Houston customers"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Certified Generac dealers with 15+ years of generator experience"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Contact HOU GEN PROS | Houston Generator Installation Company | Get Free Quote"
        description="Contact HOU GEN PROS for generator installation in Houston. Call us at (915) 800-7767 for free quotes, emergency service, or general inquiries. Serving Houston and surrounding areas."
        keywords="contact HOU GEN PROS, Houston generator company contact, generator installation quote Houston, emergency generator service contact, generator repair contact Houston, free generator consultation Houston"
        canonical="/contact"
        pageType="website"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDYwIDAgTCAwIDAgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 px-6 py-3 text-sm font-semibold">
              Ready to Help 24/7
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight text-white">
              Let's Keep Your Power
              <span className="block text-accent">Always On</span>
            </h1>
            <p className="text-xl text-white mb-10 max-w-3xl mx-auto leading-relaxed">
              Get expert generator solutions for your Houston home or business. Our certified team is ready to provide free consultations, emergency service, and professional installations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = 'tel:+19158007767'}
              >
                <Phone className="w-5 h-5 mr-3" />
                Call (915) 800-7767
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Get Free Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Get In Touch</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Multiple ways to reach our expert team for all your generator needs in Houston.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card 
                  key={index} 
                  className={`group hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-accent/30 bg-white ${info.action ? 'cursor-pointer' : ''}`}
                  onClick={info.action || undefined}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-primary mb-3 text-lg">{info.title}</h3>
                    <p className="text-steel-700 font-semibold mb-2">{info.primary}</p>
                    <p className="text-steel-500 text-sm">{info.secondary}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Emergency Service Banner */}
          <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                <h3 className="font-bold text-red-900 text-xl">24/7 Emergency Generator Service</h3>
              </div>
              <p className="text-red-800 mb-6 max-w-2xl mx-auto">
                Power outage? Generator not starting? Our emergency response team is available around the clock to restore your backup power.
              </p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold"
                onClick={() => window.location.href = 'tel:+19158007767'}
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency Call Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-primary mb-4">Send Us a Message</h2>
                  <p className="text-xl text-steel-600">
                    Ready to discuss your generator needs? Fill out the form and we'll get back to you within 24 hours with a custom solution.
                  </p>
                </div>
                
                <DynamicForm 
                  formSlug="contact"
                  className="w-full shadow-lg"
                  onSuccess={(data) => {
                    console.log('Contact form submitted successfully:', data);
                  }}
                  onError={(error) => {
                    console.error('Contact form submission error:', error);
                  }}
                />
              </div>

              {/* Benefits & Trust Indicators */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-6">Why Choose HOU GEN PROS?</h3>
                  <div className="space-y-6">
                    {benefits.map((benefit, index) => {
                      const IconComponent = benefit.icon;
                      return (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-primary mb-2">{benefit.title}</h4>
                            <p className="text-steel-600 text-sm leading-relaxed">{benefit.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Service Areas */}
                <Card className="bg-gradient-to-br from-blue-50 to-steel-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Houston Service Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm text-steel-600">
                      <div>• The Woodlands</div>
                      <div>• Sugar Land</div>
                      <div>• Katy</div>
                      <div>• Pearland</div>
                      <div>• Spring</div>
                      <div>• Cypress</div>
                      <div>• Conroe</div>
                      <div>• League City</div>
                      <div>• Tomball</div>
                      <div>• Richmond</div>
                      <div>• Magnolia</div>
                      <div>• And More...</div>
                    </div>
                    <p className="text-xs text-steel-500 mt-4">
                      Serving Houston metro area within 50-mile radius
                    </p>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="bg-gradient-to-br from-green-50 to-steel-50 border-green-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-green-900 mb-4">Licensed & Certified</h4>
                    <div className="space-y-2 text-sm text-green-800">
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Texas Electrical Contractor License
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Authorized Generac Dealer
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Fully Insured & Bonded
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Better Business Bureau A+ Rating
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
