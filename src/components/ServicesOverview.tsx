
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
  ArrowRight 
} from 'lucide-react';

const ServicesOverview = () => {
  const services = [
    {
      icon: ShoppingCart,
      title: "Generator Sales",
      description: "Premium new and certified pre-owned generators from leading manufacturers.",
      features: ["Expert Consultation", "Custom Configuration", "Competitive Pricing", "Financing Options"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Rental Solutions",
      description: "Flexible rental options for temporary power needs, events, and emergency situations.",
      features: ["24-48hr Delivery", "Setup & Pickup", "Fuel Management", "Technical Support"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Wrench,
      title: "Installation & Service",
      description: "Professional installation and comprehensive maintenance programs.",
      features: ["Licensed Technicians", "Code Compliance", "Preventive Maintenance", "Emergency Repairs"],
      color: "from-accent to-orange-600"
    },
    {
      icon: Phone,
      title: "Emergency Support",
      description: "Round-the-clock emergency response when power failures threaten your operations.",
      features: ["24/7 Hotline", "Rapid Response", "Mobile Service Units", "Priority Support"],
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-steel-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Complete Power Solutions
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Your Power, Our Commitment
          </h2>
          <p className="text-xl text-steel-600 max-w-3xl mx-auto">
            From initial consultation to ongoing maintenance, we provide comprehensive 
            generator solutions tailored to your specific power requirements.
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
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency CTA */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Phone className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Power Emergency? We're Here 24/7
            </h3>
            <p className="text-xl text-red-100 mb-8">
              When power failure threatens your operations, our emergency response team 
              is ready to deploy immediately. Don't wait – power problems won't.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-red-50 border-white">
                <Phone className="w-5 h-5 mr-2" />
                Call Emergency Line
              </Button>
              <Button size="lg" className="bg-red-700 hover:bg-red-800 text-white border-red-700">
                <Clock className="w-5 h-5 mr-2" />
                Request Callback
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
