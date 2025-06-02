
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Phone, 
  MessageSquare,
  Wrench,
  Shield,
  Clock,
  Zap,
  Settings,
  MapPin,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Users,
  Award,
  Truck
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Services = () => {
  const [activeTab, setActiveTab] = useState('installation');

  const services = [
    {
      id: 'installation',
      title: 'Generator Installation',
      icon: Settings,
      description: 'Professional installation by certified technicians across Houston and surrounding areas.',
      features: [
        'Site assessment and planning',
        'Electrical permits and inspections',
        'Gas line installation and connections',
        'Automatic transfer switch setup',
        'System testing and commissioning',
        'Code compliance guarantee'
      ],
      timeline: '3-5 business days',
      price: 'Starting at $2,500',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'maintenance',
      title: 'Preventive Maintenance',
      icon: Wrench,
      description: 'Comprehensive maintenance programs to ensure peak performance and longevity.',
      features: [
        'Quarterly system inspections',
        'Oil and filter changes',
        'Battery testing and replacement',
        'Load bank testing',
        'Performance diagnostics',
        '24/7 monitoring available'
      ],
      timeline: 'Scheduled quarterly',
      price: 'Starting at $299/visit',
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'emergency',
      title: 'Emergency Service',
      icon: AlertTriangle,
      description: '24/7 emergency response for critical power outages across Greater Houston.',
      features: [
        '2-hour emergency response',
        'On-site diagnostics and repair',
        'Emergency fuel delivery',
        'Temporary power solutions',
        'Storm preparation services',
        'Priority customer support'
      ],
      timeline: '2-hour response',
      price: 'Emergency rates apply',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'rental',
      title: 'Generator Rental',
      icon: Truck,
      description: 'Flexible rental solutions for temporary power needs and special events.',
      features: [
        'Same-day delivery available',
        'Setup and operation training',
        'Fuel management services',
        'Technical support included',
        'Flexible rental terms',
        'Pickup and return service'
      ],
      timeline: 'Same day - 12 months',
      price: 'Starting at $150/day',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const serviceAreas = [
    'Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Spring',
    'Tomball', 'Conroe', 'Pearland', 'Pasadena', 'League City', 'Friendswood',
    'Missouri City', 'Stafford', 'Richmond', 'Rosenberg', 'Humble', 'Kingwood'
  ];

  const certifications = [
    { name: 'Licensed Electrical Contractor', code: 'TECL #12345' },
    { name: 'NECA Member', code: 'National Electrical Contractors Association' },
    { name: 'EGSA Certified', code: 'Electrical Generating Systems Association' },
    { name: 'Generac Authorized', code: 'PowerPro Elite Dealer' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-accent text-white border-accent">
              Houston's Premier Generator Services
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Complete Power
              <span className="block text-accent">Solutions & Service</span>
            </h1>
            <p className="text-xl text-steel-200 mb-8 leading-relaxed">
              From installation to emergency response, our certified technicians deliver 
              Fortune 500-level service across Greater Houston and surrounding communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
                <Phone className="w-5 h-5 mr-2" />
                (832) 555-POWER
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Service
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Comprehensive Generator Services</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Expert services delivered by certified technicians with over 15 years of experience in the Houston market.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <TabsTrigger 
                    key={service.id} 
                    value={service.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <IconComponent className="w-4 h-4" />
                    {service.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <TabsContent key={service.id} value={service.id}>
                  <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-64 lg:h-auto">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {service.timeline}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-8">
                        <CardHeader className="p-0 mb-6">
                          <CardTitle className="text-2xl text-primary mb-2">
                            {service.title}
                          </CardTitle>
                          <p className="text-steel-600">{service.description}</p>
                          <div className="text-2xl font-bold text-accent">{service.price}</div>
                        </CardHeader>
                        
                        <div className="space-y-4 mb-6">
                          <h4 className="font-semibold text-primary">Service Includes:</h4>
                          <ul className="space-y-2">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-steel-600">
                                <CheckCircle className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button className="bg-primary hover:bg-steel-700 text-white flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Get Quote
                          </Button>
                          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white flex-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Now
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Serving Greater Houston</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Proudly serving Houston and surrounding communities with professional generator services.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceAreas.map((area, index) => (
              <div 
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-steel-200 text-center hover:shadow-md transition-shadow duration-300"
              >
                <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
                <span className="text-steel-700 font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Licensed & Certified</h2>
            <p className="text-steel-600 max-w-2xl mx-auto">
              Fully licensed and certified by leading industry organizations and manufacturers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-primary mb-2">{cert.name}</h3>
                  <p className="text-sm text-steel-600">{cert.code}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-steel-200 mb-8 max-w-2xl mx-auto">
            Contact our team today for expert consultation and competitive pricing on all generator services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
              <Phone className="w-5 h-5 mr-2" />
              Call (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <MessageSquare className="w-5 h-5 mr-2" />
              Request Service Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
