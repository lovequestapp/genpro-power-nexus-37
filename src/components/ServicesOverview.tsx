
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
  Zap,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesOverview = () => {
  const services = [
    {
      icon: ShoppingCart,
      title: "Generator Sales",
      description: "Brand new Generac generators in stock - not refurbished. Complete inventory ready for immediate delivery.",
      features: ["18KW, 22KW, 24KW, 26KW Models", "Equipment-Only Pricing", "Immediate Availability", "5-Year Warranty"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: Wrench,
      title: "Professional Installation",
      description: "Licensed & insured installation completed in just 3-5 hours by certified Houston Generator Pros technicians.",
      features: ["200 Amp Transfer Switch", "15ft Gas & Electric Lines", "Generator Pad & Battery", "WiFi Setup & Demo"],
      color: "from-accent to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-accent"
    },
    {
      icon: Calendar,
      title: "Complete Packages",
      description: "Everything included packages with installation, transfer switch, and all necessary components for whole home power.",
      features: ["Summer Special: $10,250", "Above Ground Installation", "Same-Day Service Available", "Professional Setup"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "Local Houston Service",
      description: "Serving Houston & surrounding areas with delivery, installation, and ongoing maintenance support.",
      features: ["Houston & Surrounding Areas", "Cost Varies by Location", "Licensed & Insured", "Local Experts"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-steel-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 sm:mb-4 text-primary border-primary px-3 sm:px-4 py-1 sm:py-2 bg-white">
            Houston Generator Pros Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6 text-balance">
            Your Complete Generator Solution
          </h2>
          <p className="text-lg sm:text-xl text-steel-600 max-w-3xl mx-auto px-4 sm:px-0">
            From sales to installation to ongoing support - everything you need for reliable 
            whole home backup power in Houston and surrounding areas.
          </p>
        </div>

        {/* Services Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-steel-200 hover:border-accent/30 overflow-hidden animate-fade-in bg-white"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  {/* Service Header */}
                  <div className={`bg-gradient-to-r ${service.color} p-4 sm:p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10">
                      <IconComponent className="w-full h-full" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold">{service.title}</h3>
                      </div>
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Service Features */}
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4 sm:mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-steel-700 font-medium text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/get-quote">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300 touch-manipulation h-10 sm:h-auto bg-white border-steel-300 text-steel-700"
                      >
                        Get Free Quote
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Installation Features - Mobile Optimized */}
        <div className="bg-gradient-to-r from-primary to-steel-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Professional Installation Included
              </h3>
              <p className="text-lg sm:text-xl text-steel-200">
                Licensed & insured Houston Generator Pros technicians handle everything from permits to WiFi setup
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-3 sm:mb-4" />
                <h4 className="font-bold text-base sm:text-lg mb-2">3-5 Hour Installation</h4>
                <p className="text-steel-200 text-sm">Fast professional setup with same-day completion</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                <Wifi className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-3 sm:mb-4" />
                <h4 className="font-bold text-base sm:text-lg mb-2">WiFi Setup & Demo</h4>
                <p className="text-steel-200 text-sm">Complete system setup with app configuration and training</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
                <Battery className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-3 sm:mb-4" />
                <h4 className="font-bold text-base sm:text-lg mb-2">Everything Included</h4>
                <p className="text-steel-200 text-sm">Generator pad, battery, transfer switch, and all connections</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-steel-300 text-sm mb-4 sm:mb-6">
                * Permit fees not included. Delivery & installation available (cost varies by location)
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
                <Link to="/get-quote" className="flex-1 sm:flex-none">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-orange-600 text-white touch-manipulation h-12 sm:h-auto w-full"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Message for Free Quote
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary touch-manipulation h-12 sm:h-auto flex-1 sm:flex-none bg-transparent"
                >
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
