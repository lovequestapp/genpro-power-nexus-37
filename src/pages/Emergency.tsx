import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Phone, MessageSquare, AlertTriangle, Clock, MapPin, Shield, Zap, Truck, Users, CheckCircle, Star, Calendar, Fuel, Wrench, Timer } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '../components/SEO';

const Emergency = () => {
  const emergencyServices = [{
    title: 'Generator Repair',
    icon: Wrench,
    response: '2-Hour Response',
    description: 'Immediate on-site diagnosis and repair for all generator makes and models.',
    features: ['Emergency diagnostic equipment', 'Mobile repair capabilities', 'OEM parts inventory', 'Field technician expertise']
  }, {
    title: 'Emergency Fuel Delivery',
    icon: Fuel,
    response: '1-Hour Delivery',
    description: 'Critical fuel delivery to keep your generators running during extended outages.',
    features: ['Diesel and propane delivery', '24/7 fuel monitoring', 'Emergency fuel contracts', 'Storm preparation services']
  }, {
    title: 'Temporary Power',
    icon: Truck,
    response: 'Same Day Setup',
    description: 'Portable generator rentals with immediate delivery and professional setup.',
    features: ['Trailer-mounted units', 'Power distribution panels', 'Professional installation', 'Extended runtime capability']
  }, {
    title: 'Load Bank Testing',
    icon: Zap,
    response: '4-Hour Response',
    description: 'Emergency load testing to verify generator performance under actual conditions.',
    features: ['Portable load bank units', 'Performance verification', 'Load capacity testing', 'Compliance documentation']
  }];
  const responseAreas = [{
    area: 'Central Houston',
    time: '30 minutes',
    coverage: ['Downtown', 'Midtown', 'Museum District', 'Heights']
  }, {
    area: 'West Houston',
    time: '45 minutes',
    coverage: ['Katy', 'Sugar Land', 'Richmond', 'Rosenberg']
  }, {
    area: 'North Houston',
    time: '45 minutes',
    coverage: ['The Woodlands', 'Spring', 'Tomball', 'Conroe']
  }, {
    area: 'East Houston',
    time: '60 minutes',
    coverage: ['Pasadena', 'Baytown', 'Deer Park', 'La Porte']
  }, {
    area: 'South Houston',
    time: '60 minutes',
    coverage: ['Pearland', 'League City', 'Friendswood', 'Alvin']
  }, {
    area: 'Southeast Houston',
    time: '75 minutes',
    coverage: ['Clear Lake', 'Webster', 'Seabrook', 'Kemah']
  }];
  const emergencyContacts = [{
    title: 'Primary Emergency Line',
    number: '(915) 800-7767',
    description: '24/7 emergency dispatch',
    priority: 'high'
  }, {
    title: 'Storm Preparation Hotline',
    number: '(915) 800-7767',
    description: 'Hurricane & severe weather prep',
    priority: 'medium'
  }, {
    title: 'Fuel Emergency Line',
    number: '(915) 800-7767',
    description: 'Emergency fuel delivery',
    priority: 'medium'
  }];
  const preparationSteps = [
    {
      step: '1',
      title: 'System Inspection',
      description: 'Complete generator system inspection and testing before storm season.',
      timeframe: '2-3 hours',
    },
    {
      step: '2',
      title: 'Fuel Management',
      description: 'Top off fuel tanks and test fuel quality to ensure reliability.',
      timeframe: '1-2 hours',
    },
    {
      step: '3',
      title: 'Battery Check',
      description: 'Test and replace batteries if needed for reliable startup.',
      timeframe: '1 hour',
    },
    {
      step: '4',
      title: 'Load Testing',
      description: 'Verify generator performance under expected load conditions.',
      timeframe: '2-4 hours',
    },
    {
      step: '5',
      title: 'Transfer Switch Test',
      description: 'Ensure automatic transfer switches are functioning properly.',
      timeframe: '1-2 hours',
    },
    {
      step: '6',
      title: 'Response Plan Review',
      description: 'Update emergency response plans and contact information.',
      timeframe: '1 hour',
    }
  ];
  return <div className="min-h-screen bg-white">
      <SEO 
        title="Emergency Generator Service Houston | 24/7 Generator Repair | HOU GEN PROS"
        description="24/7 emergency generator service in Houston. Immediate response for generator failures, power outages, and urgent repairs. Call (281) XXX-XXXX for emergency generator service."
        keywords="emergency generator service Houston, 24/7 generator repair Houston, generator emergency Houston, generator failure Houston, power outage generator service, urgent generator repair Houston, generator breakdown Houston, emergency generator technician Houston"
        canonical="/emergency"
        pageType="website"
      />
      <Header />
      
      {/* Hero Section - Added more top padding */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 px-4 py-2">
              24/7 Emergency Power Response
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Power Emergency?
              <span className="block text-yellow-300">We're On Our Way</span>
            </h1>
            <p className="text-xl text-red-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              When power fails across Houston, we respond fast. 24/7 emergency generator service, 
              rapid deployment, and expert technicians ready to restore your critical power systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-6 text-xl">
                <Phone className="w-6 h-6 mr-3" />
                EMERGENCY: (915) 800-7767
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-6 text-slate-950">
                <Clock className="w-5 h-5 mr-2" />
                2-Hour Response Guarantee
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Emergency Generator Services</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Comprehensive emergency power solutions available 24/7 across Greater Houston and surrounding areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {emergencyServices.map((service, index) => {
            const IconComponent = service.icon;
            return <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-steel-200 hover:border-red-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-red-100 group-hover:bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="font-bold text-primary mb-4 text-lg">{service.title}</h3>
                    <p className="text-steel-600 mb-4 text-sm">{service.description}</p>
                    <div className="text-red-600 font-bold text-lg mb-4">{service.response}</div>
                    
                    <ul className="space-y-2 mb-6 text-left">
                      {service.features.map((feature, idx) => <li key={idx} className="text-sm text-steel-600 flex items-center">
                          <CheckCircle className="w-4 h-4 text-red-600 mr-3 flex-shrink-0" />
                          {feature}
                        </li>)}
                    </ul>
                    
                    <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Response Coverage */}
      <section className="py-20 bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Emergency Response Coverage</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Rapid emergency response across Greater Houston with strategically positioned service teams and equipment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Service Areas & Response Times</h3>
              <div className="grid grid-cols-2 gap-4">
                {responseAreas.map((area, index) => <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-steel-200 text-center hover:shadow-md transition-shadow duration-300">
                    <MapPin className="w-5 h-5 text-red-600 mx-auto mb-2" />
                    <div className="font-semibold text-primary text-sm">{area.area}</div>
                    <div className="text-red-600 font-bold text-xs">{area.time}</div>
                  </div>)}
              </div>
              
              <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-bold text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Storm & Hurricane Response
                </h4>
                <p className="text-red-700 text-sm">
                  During severe weather events, we activate our emergency storm response protocol with 
                  additional crews and equipment pre-positioned across Houston for faster response times.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Emergency response truck" className="w-full h-80 object-cover rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              <div className="absolute bottom-6 left-6 text-white">
                <Badge className="bg-red-600 text-white mb-3">
                  Emergency Fleet Ready
                </Badge>
                <h4 className="text-xl font-bold mb-2">Mobile Service Units</h4>
                <p className="text-sm text-red-100">
                  Fully equipped service trucks with diagnostic equipment, parts, and backup generators
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storm Preparation */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Hurricane & Storm Preparation</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Don't wait for the storm to hit. Prepare your generator system before hurricane season with our comprehensive preparation services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {preparationSteps.map((step, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-steel-200">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-primary mb-4 text-lg">{step.title}</h3>
                  <p className="text-steel-600 mb-4 text-sm">{step.description}</p>
                  <div className="text-blue-600 font-semibold text-sm">{step.timeframe}</div>
                </CardContent>
              </Card>)}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
              <Shield className="w-5 h-5 mr-2" />
              Schedule Pre-Storm Service
            </Button>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Power Emergency? Don't Wait.</h2>
            <p className="text-xl text-red-100 mb-10">
              Every minute without power costs your business money and puts lives at risk. 
              Our emergency response team is standing by 24/7 to restore your critical systems.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <Clock className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">2-Hour Response</h3>
                <p className="text-red-100 text-sm">Guaranteed emergency response across Greater Houston</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Expert Technicians</h3>
                <p className="text-red-100 text-sm">Certified professionals with 15+ years experience</p>
              </div>
              <div className="text-center">
                <Truck className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Mobile Service</h3>
                <p className="text-red-100 text-sm">Fully equipped emergency response vehicles</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-6 text-xl">
                <Phone className="w-6 h-6 mr-3" />
                CALL NOW: (915) 800-7767
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-6 text-steel-800">
                <MessageSquare className="w-5 h-5 mr-2" />
                Text Emergency Request
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Don't Wait for an Emergency</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Prepare now with preventive maintenance and emergency service contracts. 
            Protect your business before disaster strikes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Phone className="w-5 h-5 mr-2" />
              Emergency: (915) 800-7767
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 py-6 text-steel-800">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Preventive Service
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Emergency;
