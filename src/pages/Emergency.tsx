
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Clock, Zap, MapPin, CheckCircle, Shield, Users, Star } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '../components/SEO';

const Emergency = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="24/7 Emergency Generator Service Houston | Power Outage Response | HOU GEN PROS"
        description="24/7 emergency generator service in Houston. Fast response for power outages, generator repairs, and emergency power solutions. Licensed technicians ready to help."
        keywords="emergency generator service Houston, 24/7 generator repair Houston, power outage service Houston, emergency generator installation Houston, generator breakdown service Houston, storm power service Houston"
        canonical="/emergency"
        pageType="website"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-yellow-400 text-red-800 border-yellow-400 px-4 py-2 font-semibold">
              24/7 Emergency Power Response
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight hyphens-none">
              Power Emergency?{' '}
              <span className="block text-yellow-400">We're On Our Way</span>
            </h1>
            <p className="text-lg sm:text-xl text-white mb-10 leading-relaxed max-w-3xl mx-auto">
              When power fails across Houston, we respond fast. 24/7 emergency generator service, rapid 
              response, and expert technicians ready to restore your critical power needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-yellow-400 hover:bg-yellow-500 text-red-800 px-8 py-4 font-bold"
                onClick={() => window.location.href = 'tel:+19158007767'}
              >
                <Phone className="w-5 h-5 mr-2" />
                EMERGENCY: (915) 800-7767
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-4 text-red-800 bg-white/10 hover:text-red-800 transition-all duration-300 hyphens-none">
                <Clock className="w-5 h-5 mr-2" />
                2-Hour Response Time
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 hyphens-none">
              Emergency Power Solutions
            </h2>
            <p className="text-lg sm:text-xl text-steel-600 max-w-3xl mx-auto">
              Comprehensive emergency services to restore your power and keep your operations running.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg border-steel-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-primary hyphens-none">Generator Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-steel-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    On-site diagnostics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Emergency repairs
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Parts replacement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    System restoration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-steel-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <CardTitle className="text-xl text-primary hyphens-none">Power Outage Response</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-steel-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Immediate assessment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Temporary power setup
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Emergency fuel delivery
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Priority restoration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-steel-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl text-primary hyphens-none">Storm Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-steel-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Pre-storm inspections
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    Fuel tank fill-up
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    System testing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                    24/7 monitoring
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 hyphens-none">
              Fast Emergency Response
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <Clock className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">2 Hours</h3>
                  <p className="text-steel-600">Emergency Response Time</p>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <Users className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-steel-600">Available Every Day</p>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-lg">
                <CardContent className="p-8">
                  <Star className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-primary mb-2">15+ Years</h3>
                  <p className="text-steel-600">Emergency Experience</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 hyphens-none">
              Emergency Service Areas
            </h2>
            <p className="text-lg sm:text-xl text-steel-600 max-w-3xl mx-auto">
              Rapid emergency response across Greater Houston and surrounding communities.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {['Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Spring', 'Pearland', 'Tomball'].map((area) => (
                    <div key={area} className="flex items-center justify-center p-4 bg-steel-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-accent mr-2" />
                      <span className="text-steel-700 font-medium hyphens-none">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 hyphens-none">
            Don't Wait - Call Now!
          </h2>
          <p className="text-lg sm:text-xl text-white mb-10 max-w-3xl mx-auto">
            Every minute counts during a power emergency. Our certified technicians are standing by 24/7 to respond to your emergency.
          </p>
          <Button 
            size="lg" 
            className="bg-yellow-400 hover:bg-yellow-500 text-red-800 px-12 py-6 text-xl font-bold"
            onClick={() => window.location.href = 'tel:+19158007767'}
          >
            <Phone className="w-6 h-6 mr-3" />
            CALL EMERGENCY LINE: (915) 800-7767
          </Button>
          <p className="text-white/80 mt-4">Available 24 hours a day, 7 days a week</p>
        </div>
      </section>
    </div>
  );
};

export default Emergency;
