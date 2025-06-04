
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Calendar, 
  Wrench, 
  Phone, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Wifi,
  Battery,
  Zap
} from 'lucide-react';

const ServicesOverview = () => {
  const services = [
    {
      icon: ShoppingCart,
      title: "Generator Sales",
      description: "Brand new Generac generators in stock - not refurbished. Complete inventory ready for immediate delivery.",
      features: ["18KW, 22KW, 24KW, 26KW Models", "Equipment-Only Pricing", "Immediate Availability", "5-Year Warranty"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Wrench,
      title: "Professional Installation",
      description: "Licensed & insured installation completed in just 3-5 hours by certified Houston Generator Pros technicians.",
      features: ["200 Amp Transfer Switch", "15ft Gas & Electric Lines", "Generator Pad & Battery", "WiFi Setup & Demo"],
      color: "from-accent to-orange-600"
    },
    {
      icon: Calendar,
      title: "Complete Packages",
      description: "Everything included packages with installation, transfer switch, and all necessary components for whole home power.",
      features: ["Summer Special: $10,250", "Above Ground Installation", "Same-Day Service Available", "Professional Setup"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Phone,
      title: "Local Houston Service",
      description: "Serving Houston & surrounding areas with delivery, installation, and ongoing maintenance support.",
      features: ["Houston & Surrounding Areas", "Cost Varies by Location", "Licensed & Insured", "Local Experts"],
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-steel-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Houston Generator Pros Services
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Your Complete Generator Solution
          </h2>
          <p className="text-xl text-steel-600 max-w-3xl mx-auto">
            From sales to installation to ongoing support - everything you need for reliable 
            whole home backup power in Houston and surrounding areas.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-steel-200 hover:border-accent/30 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  {/* Service Header */}
                  <div className={`bg-gradient-to-r ${service.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="bg-white/20 p-3 rounded-lg mr-4">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                      </div>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Service Features */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-steel-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300"
                    >
                      Get Free Quote
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Installation Features */}
        <div className="bg-gradient-to-r from-primary to-steel-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Professional Installation Included
              </h3>
              <p className="text-xl text-steel-200">
                Licensed & insured Houston Generator Pros technicians handle everything from permits to WiFi setup
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">3-5 Hour Installation</h4>
                <p className="text-steel-200 text-sm">Fast professional setup with same-day completion</p>
              </div>
              
              <div className="text-center">
                <Wifi className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">WiFi Setup & Demo</h4>
                <p className="text-steel-200 text-sm">Complete system setup with app configuration and training</p>
              </div>
              
              <div className="text-center">
                <Battery className="w-12 h-12 text-accent mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-2">Everything Included</h4>
                <p className="text-steel-200 text-sm">Generator pad, battery, transfer switch, and all connections</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-steel-300 text-sm mb-6">
                * Permit fees not included. Delivery & installation available (cost varies by location)
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-orange-600 text-white">
                  <Phone className="w-5 h-5 mr-2" />
                  Message for Free Quote
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  <Zap className="w-5 h-5 mr-2" />
                  View Summer Special
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
