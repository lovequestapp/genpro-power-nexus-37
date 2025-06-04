
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  Zap, 
  Clock,
  Star,
  Shield,
  Wifi,
  Award
} from 'lucide-react';

const PromotionSection = () => {
  const summerSpecialIncludes = [
    "26KW Generac Generator",
    "200 Amp Automatic Transfer Switch", 
    "15 ft Gas & Electric Lines (Above Ground)",
    "Generator Pad + Battery",
    "WiFi Setup + Demo",
    "5-Year Manufacturer Warranty"
  ];

  return (
    <section className="section-padding accent-gradient text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-128 h-128 bg-orange-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto container-padding relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 px-6 py-3 text-base font-semibold animate-fade-in hover-lift">
            🚨 LIMITED TIME SUMMER SPECIAL
          </Badge>
          <h2 className="font-display font-bold mb-8 text-white animate-fade-in text-balance" style={{ animationDelay: '0.2s' }}>
            Complete Home Generator Package
          </h2>
          <p className="text-xl text-orange-100 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Everything you need for whole home backup power - professionally installed in just 3-5 hours!
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Package Details */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="glass-effect rounded-3xl p-8 border border-white/20 premium-shadow hover-lift">
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-yellow-400/20 rounded-2xl mr-4">
                    <Zap className="w-8 h-8 text-yellow-300" />
                  </div>
                  <h3 className="text-3xl font-bold">26KW Generator Package</h3>
                </div>
                
                <div className="space-y-5 mb-10">
                  {summerSpecialIncludes.map((item, index) => (
                    <div key={index} className="flex items-center group">
                      <div className="p-1 bg-green-400/20 rounded-full mr-4">
                        <CheckCircle className="w-5 h-5 text-green-300 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-orange-50 font-medium text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between glass-effect rounded-2xl p-6 mb-8 hover-lift">
                  <div>
                    <div className="text-sm text-orange-200 mb-2">Complete Package Price</div>
                    <div className="text-4xl font-bold">$10,250</div>
                    <div className="text-sm text-orange-200">+ Tax</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-200 mb-2">Installation Time</div>
                    <div className="text-2xl font-bold">3-5 Hours</div>
                    <div className="flex items-center justify-end mt-2">
                      <Clock className="w-4 h-4 text-orange-200 mr-1" />
                      <span className="text-sm text-orange-200">Same Day</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-orange-200 mb-8 p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center mb-2">
                    <Award className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Professional Installation Included</span>
                  </div>
                  * Permit fees not included. Delivery & installation available (cost varies by location)
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-accent hover:bg-orange-50 flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call for Quote
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-accent flex-1 font-semibold transition-all duration-300"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Benefits */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              {[
                {
                  icon: Star,
                  title: "Brand New Units",
                  description: "Not refurbished - genuine Generac generators with full warranty coverage",
                  color: "text-yellow-300",
                  bgColor: "bg-yellow-400/20"
                },
                {
                  icon: Shield,
                  title: "Licensed & Insured",
                  description: "Professional installation by certified Houston Generator Pros technicians",
                  color: "text-green-300",
                  bgColor: "bg-green-400/20"
                },
                {
                  icon: Clock,
                  title: "Fast Setup",
                  description: "Complete installation in just 3-5 hours with same-day WiFi setup and demo",
                  color: "text-blue-300",
                  bgColor: "bg-blue-400/20"
                }
              ].map((benefit, index) => (
                <Card key={index} className="glass-effect border-white/20 hover-lift group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${benefit.bgColor} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                        <p className="text-orange-100 leading-relaxed font-medium">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
