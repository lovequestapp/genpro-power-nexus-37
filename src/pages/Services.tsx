import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowRight, Phone, MessageSquare, Wrench, Shield, Clock, Zap, Settings, MapPin, Calendar, CheckCircle, AlertTriangle, Users, Award, Truck } from 'lucide-react';
import Header from '@/components/Header';
import ScheduleServiceForm from '@/components/ScheduleServiceForm';
import SEO from '../components/SEO';

const Services = () => {
  const [activeTab, setActiveTab] = useState('installation');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const services = [{
    id: 'installation',
    title: 'Generator Installation',
    icon: Settings,
    description: 'Professional installation by certified technicians across Houston and surrounding areas.',
    features: ['Site assessment and planning', 'Electrical permits and inspections', 'Gas line installation and connections', 'Automatic transfer switch setup', 'System testing and commissioning', 'Code compliance guarantee'],
    timeline: '3-5 business days',
    price: 'Starting at $2,500',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }, {
    id: 'maintenance',
    title: 'Preventive Maintenance',
    icon: Wrench,
    description: 'Comprehensive maintenance programs to ensure peak performance and longevity.',
    features: ['Quarterly system inspections', 'Oil and filter changes', 'Battery testing and replacement', 'Load bank testing', 'Performance diagnostics', '24/7 monitoring available'],
    timeline: 'Scheduled quarterly',
    price: 'Starting at $299/visit',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }, {
    id: 'emergency',
    title: 'Emergency Service',
    icon: AlertTriangle,
    description: '24/7 emergency response for critical power outages across Greater Houston.',
    features: ['2-hour emergency response', 'On-site diagnostics and repair', 'Emergency fuel delivery', 'Temporary power solutions', 'Storm preparation services', 'Priority customer support'],
    timeline: '2-hour response',
    price: 'Emergency rates apply',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }, {
    id: 'rental',
    title: 'Generator Rental',
    icon: Truck,
    description: 'Flexible rental solutions for temporary power needs and special events.',
    features: ['Same-day delivery available', 'Setup and operation training', 'Fuel management services', 'Technical support included', 'Flexible rental terms', 'Pickup and return service'],
    timeline: 'Same day - 12 months',
    price: 'Starting at $150/day',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];
  const serviceAreas = ['Houston', 'Katy', 'Sugar Land', 'The Woodlands', 'Cypress', 'Spring', 'Tomball', 'Conroe', 'Pearland', 'Pasadena', 'League City', 'Friendswood', 'Missouri City', 'Stafford', 'Richmond', 'Rosenberg', 'Humble', 'Kingwood'];
  const certifications = [{
    name: 'Licensed Electrical Contractor',
    code: 'TECL #12345'
  }, {
    name: 'NECA Member',
    code: 'National Electrical Contractors Association'
  }, {
    name: 'EGSA Certified',
    code: 'Electrical Generating Systems Association'
  }, {
    name: 'Generac Authorized',
    code: 'PowerPro Elite Dealer'
  }];
  return <div className="min-h-screen bg-white">
      <SEO 
        title="Generator Services Houston | Installation, Repair & Maintenance | HOU GEN PROS"
        description="Comprehensive generator services in Houston: installation, repair, maintenance, emergency service, and 24/7 support. Generac authorized dealer with same-day service available."
        keywords="generator services Houston, generator installation Houston, generator repair Houston, generator maintenance Houston, emergency generator service Houston, Generac services Houston, standby generator installation, portable generator service, generator troubleshooting Houston, generator parts Houston, generator warranty service, 24/7 generator service Houston"
        canonical="/services"
        pageType="website"
      />
      <Header />
      
      {/* Hero Section - Added more top padding */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-white border-accent px-4 py-2">
              Houston's Premier Generator Services
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Complete Power
              <span className="block text-accent">Solutions & Service</span>
            </h1>
            <p className="text-xl text-white mb-10 leading-relaxed max-w-3xl mx-auto">
              From installation to emergency response, our certified technicians deliver 
              Fortune 500-level service across Greater Houston and surrounding communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-orange-600 text-white px-8 py-4"
                onClick={() => window.location.href = 'tel:+19158007767'}
              >
                <Phone className="w-5 h-5 mr-2" />
                (915) 800-7767
              </Button>
              <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-4 text-slate-900 bg-white/10 hover:text-primary transition-all duration-300">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">Schedule Your Service</DialogTitle>
                  </DialogHeader>
                  <ScheduleServiceForm onClose={() => setIsScheduleModalOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Services Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Comprehensive Generator Services</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Expert services delivered by certified technicians with over 15 years of experience in the Houston market.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-12 h-auto">
              {services.map(service => {
              const IconComponent = service.icon;
              return <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2 text-sm p-4">
                    <IconComponent className="w-4 h-4" />
                    {service.title}
                  </TabsTrigger>;
            })}
            </TabsList>

            {services.map(service => {
            const IconComponent = service.icon;
            return <TabsContent key={service.id} value={service.id} className="mt-8">
                  <Card className="overflow-hidden shadow-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-80 lg:h-auto">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
                        <div className="absolute top-8 left-8">
                          <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mb-6">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                            {service.timeline}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-10">
                        <CardHeader className="p-0 mb-8">
                          <CardTitle className="text-3xl text-primary mb-4">
                            {service.title}
                          </CardTitle>
                          <p className="text-steel-600 text-lg mb-4">{service.description}</p>
                          <div className="text-3xl font-bold text-accent">{service.price}</div>
                        </CardHeader>
                        
                        <div className="space-y-6 mb-8">
                          <h4 className="font-semibold text-primary text-lg">Service Includes:</h4>
                          <ul className="space-y-3">
                            {service.features.map((feature, idx) => <li key={idx} className="flex items-center text-steel-600">
                                <CheckCircle className="w-5 h-5 text-accent mr-4 flex-shrink-0" />
                                {feature}
                              </li>)}
                          </ul>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button className="bg-primary hover:bg-steel-700 text-white flex-1 py-3">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Get Quote
                          </Button>
                          <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-white flex-1 py-3 transition-all duration-300">
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Now
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </TabsContent>;
          })}
          </Tabs>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Serving Greater Houston</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Proudly serving Houston and surrounding communities with professional generator services.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {serviceAreas.map((area, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-steel-200 text-center hover:shadow-md transition-shadow duration-300">
                <MapPin className="w-6 h-6 text-accent mx-auto mb-3" />
                <span className="text-steel-700 font-medium">{area}</span>
              </div>)}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Licensed & Certified</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Fully licensed and certified by leading industry organizations and manufacturers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <Award className="w-16 h-16 text-accent mx-auto mb-6" />
                  <h3 className="font-bold text-primary mb-3 text-lg">{cert.name}</h3>
                  <p className="text-steel-600">{cert.code}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white mb-10 max-w-3xl mx-auto">
            Contact our team today for expert consultation and competitive pricing on all generator services.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-orange-600 text-white px-8 py-4"
              onClick={() => window.location.href = 'tel:+19158007767'}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call (915) 800-7767
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-4 text-steel-800">
              <MessageSquare className="w-5 h-5 mr-2" />
              Request Service Quote
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Services;
