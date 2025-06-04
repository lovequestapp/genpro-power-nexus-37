
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
  Award,
  Home
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
    <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 sm:w-128 sm:h-128 bg-orange-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <Badge className="mb-4 sm:mb-6 bg-accent text-white border-accent px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold animate-fade-in hover-lift">
            🚨 LIMITED TIME SUMMER SPECIAL
          </Badge>
          <h2 className="font-display font-bold mb-6 sm:mb-8 text-white animate-fade-in text-balance text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ animationDelay: '0.2s' }}>
            Complete Home Generator Package
          </h2>
          <p className="text-lg sm:text-xl text-steel-200 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.4s' }}>
            Everything you need for whole home backup power - professionally installed in just 3-5 hours!
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Enhanced Package Details */}
            <div className="animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.6s' }}>
              <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 premium-shadow hover-lift text-steel-800">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="p-2 sm:p-3 bg-accent/10 rounded-xl sm:rounded-2xl mr-3 sm:mr-4">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary">26KW Generator Package</h3>
                </div>
                
                <div className="space-y-3 sm:space-y-5 mb-8 sm:mb-10">
                  {summerSpecialIncludes.map((item, index) => (
                    <div key={index} className="flex items-start group">
                      <div className="p-1 bg-green-500/20 rounded-full mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-steel-700 font-medium text-base sm:text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-steel-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 hover-lift border border-steel-200">
                  <div className="mb-4 sm:mb-0">
                    <div className="text-xs sm:text-sm text-steel-500 mb-1 sm:mb-2">Complete Package Price</div>
                    <div className="text-3xl sm:text-4xl font-bold text-primary">$10,250</div>
                    <div className="text-xs sm:text-sm text-steel-500">+ Tax</div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-xs sm:text-sm text-steel-500 mb-1 sm:mb-2">Installation Time</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">3-5 Hours</div>
                    <div className="flex items-center sm:justify-end mt-1 sm:mt-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-accent mr-1" />
                      <span className="text-xs sm:text-sm text-steel-600">Same Day Available</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-steel-500 mb-6 sm:mb-8 p-3 sm:p-4 bg-steel-50 rounded-xl border border-steel-200">
                  <div className="flex items-center mb-2">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-accent" />
                    <span className="font-semibold text-steel-700">Professional Installation Included</span>
                  </div>
                  * Permit fees not included. Delivery & installation available (cost varies by location)
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="bg-accent hover:bg-orange-600 text-white flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation h-12 sm:h-auto"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call for Quote
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-accent text-accent hover:bg-accent hover:text-white flex-1 font-semibold transition-all duration-300 touch-manipulation h-12 sm:h-auto bg-white"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Benefits */}
            <div className="space-y-4 sm:space-y-6 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.8s' }}>
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
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover-lift group">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 ${benefit.bgColor} rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <benefit.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${benefit.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">{benefit.title}</h4>
                        <p className="text-steel-200 leading-relaxed font-medium text-sm sm:text-base">{benefit.description}</p>
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
