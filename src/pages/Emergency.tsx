
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  AlertTriangle,
  Clock,
  MapPin,
  Shield,
  Zap,
  Truck,
  Users,
  CheckCircle,
  Star,
  Calendar,
  Fuel,
  Wrench
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Emergency = () => {
  const emergencyServices = [
    {
      title: 'Generator Repair',
      icon: Wrench,
      response: '2-Hour Response',
      description: 'Immediate on-site diagnosis and repair for all generator makes and models.',
      features: [
        'Emergency diagnostic equipment',
        'Mobile repair capabilities',
        'OEM parts inventory',
        'Field technician expertise'
      ]
    },
    {
      title: 'Emergency Fuel Delivery',
      icon: Fuel,
      response: '1-Hour Delivery',
      description: 'Critical fuel delivery to keep your generators running during extended outages.',
      features: [
        'Diesel and propane delivery',
        '24/7 fuel monitoring',
        'Emergency fuel contracts',
        'Storm preparation services'
      ]
    },
    {
      title: 'Temporary Power',
      icon: Truck,
      response: 'Same Day Setup',
      description: 'Portable generator rentals with immediate delivery and professional setup.',
      features: [
        'Trailer-mounted units',
        'Power distribution panels',
        'Professional installation',
        'Extended runtime capability'
      ]
    },
    {
      title: 'Load Bank Testing',
      icon: Zap,
      response: '4-Hour Response',
      description: 'Emergency load testing to verify generator performance under actual conditions.',
      features: [
        'Portable load bank units',
        'Performance verification',
        'Load capacity testing',
        'Compliance documentation'
      ]
    }
  ];

  const responseAreas = [
    {
      area: 'Central Houston',
      time: '30 minutes',
      coverage: ['Downtown', 'Midtown', 'Museum District', 'Heights']
    },
    {
      area: 'West Houston',
      time: '45 minutes',
      coverage: ['Katy', 'Sugar Land', 'Richmond', 'Rosenberg']
    },
    {
      area: 'North Houston',
      time: '45 minutes',
      coverage: ['The Woodlands', 'Spring', 'Tomball', 'Conroe']
    },
    {
      area: 'East Houston',
      time: '60 minutes',
      coverage: ['Pasadena', 'Baytown', 'Deer Park', 'La Porte']
    },
    {
      area: 'South Houston',
      time: '60 minutes',
      coverage: ['Pearland', 'League City', 'Friendswood', 'Alvin']
    },
    {
      area: 'Southeast Houston',
      time: '75 minutes',
      coverage: ['Clear Lake', 'Webster', 'Seabrook', 'Kemah']
    }
  ];

  const emergencyContacts = [
    {
      title: 'Primary Emergency Line',
      number: '(832) 555-POWER',
      description: '24/7 emergency dispatch',
      priority: 'high'
    },
    {
      title: 'Storm Preparation Hotline',
      number: '(832) 555-STORM',
      description: 'Hurricane & severe weather prep',
      priority: 'medium'
    },
    {
      title: 'Fuel Emergency Line',
      number: '(832) 555-FUEL',
      description: 'Emergency fuel delivery',
      priority: 'medium'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      company: 'Houston Methodist Hospital',
      text: 'When our backup generator failed during Hurricane Harvey, HOU GEN PROS had a team on-site within 90 minutes. Their rapid response saved our critical operations.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      company: 'ExxonMobil Baytown',
      text: 'Outstanding emergency service. Their 24/7 response team has consistently delivered when we needed them most. True professionals.',
      rating: 5
    },
    {
      name: 'Jennifer Chen',
      company: 'Memorial Hermann',
      text: 'Reliable, fast, and professional. HOU GEN PROS is our trusted partner for all emergency power needs. Highly recommended.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-red-900 via-red-800 to-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-red-600 text-white border-red-600 animate-pulse">
              <AlertTriangle className="w-4 h-4 mr-2" />
              24/7 Emergency Response
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Emergency Power
              <span className="block text-accent">When You Need It Most</span>
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Houston's fastest emergency generator response team. Available 24/7/365 with 
              2-hour guaranteed response time across Greater Houston area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white animate-pulse">
                <Phone className="w-5 h-5 mr-2" />
                EMERGENCY: (832) 555-POWER
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-900">
                <MessageSquare className="w-5 h-5 mr-2" />
                Request Emergency Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact Cards */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Emergency Contact Numbers</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Multiple emergency lines to ensure you can reach us when power failures strike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card 
                key={index} 
                className={`text-center hover:shadow-lg transition-shadow duration-300 ${
                  contact.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-steel-200'
                }`}
              >
                <CardContent className="p-6">
                  <Phone className={`w-12 h-12 mx-auto mb-4 ${
                    contact.priority === 'high' ? 'text-red-600' : 'text-accent'
                  }`} />
                  <h3 className="text-xl font-bold text-primary mb-2">{contact.title}</h3>
                  <div className={`text-2xl font-bold mb-2 ${
                    contact.priority === 'high' ? 'text-red-600' : 'text-accent'
                  }`}>
                    {contact.number}
                  </div>
                  <p className="text-steel-600">{contact.description}</p>
                  {contact.priority === 'high' && (
                    <Badge className="mt-3 bg-red-600 text-white">
                      PRIMARY EMERGENCY
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Emergency Services</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Comprehensive emergency power solutions available around the clock.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {emergencyServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                          <Badge className="bg-accent text-white mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {service.response}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-steel-600 mb-4">{service.description}</p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-steel-600">
                          <CheckCircle className="w-4 h-4 text-red-600 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white">
                      Request {service.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Response Areas */}
      <section className="py-16 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Emergency Response Areas</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Guaranteed response times across Greater Houston and surrounding communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {responseAreas.map((area, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary">{area.area}</h3>
                    <Badge className="bg-red-600 text-white">
                      <Clock className="w-3 h-3 mr-1" />
                      {area.time}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {area.coverage.map((location, idx) => (
                      <div key={idx} className="flex items-center text-steel-600">
                        <MapPin className="w-3 h-3 text-red-600 mr-2" />
                        <span className="text-sm">{location}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Emergency Response Testimonials</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Real stories from Houston businesses who relied on our emergency services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-steel-600 mb-4 italic">"{testimonial.text}"</p>
                  
                  <div className="border-t pt-4">
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-steel-500">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              Emergency: (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-900">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Preventive Service
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Emergency;
