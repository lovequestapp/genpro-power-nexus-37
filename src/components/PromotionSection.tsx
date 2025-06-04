
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
  Wifi
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
    <section className="py-20 bg-gradient-to-br from-accent to-orange-600 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-2">
            🚨 LIMITED TIME SUMMER SPECIAL
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Complete Home Generator Package
          </h2>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Everything you need for whole home backup power - professionally installed in just 3-5 hours!
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Package Details */}
            <div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center mb-6">
                  <Zap className="w-8 h-8 text-yellow-300 mr-3" />
                  <h3 className="text-2xl font-bold">26KW Generator Package</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  {summerSpecialIncludes.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                      <span className="text-orange-50">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between bg-white/20 rounded-lg p-4 mb-6">
                  <div>
                    <div className="text-sm text-orange-200">Complete Package Price</div>
                    <div className="text-3xl font-bold">$10,250</div>
                    <div className="text-sm text-orange-200">+ Tax</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-200">Installation Time</div>
                    <div className="text-xl font-bold">3-5 Hours</div>
                  </div>
                </div>

                <div className="text-sm text-orange-200 mb-6">
                  * Permit fees not included. Delivery & installation available (cost varies by location)
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white text-accent hover:bg-orange-50 flex-1">
                    <Phone className="w-5 h-5 mr-2" />
                    Call for Quote
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-accent flex-1">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Benefits & Trust */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Brand New Units</h4>
                  <p className="text-orange-100">Not refurbished - genuine Generac generators with full warranty coverage</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Licensed & Insured</h4>
                  <p className="text-orange-100">Professional installation by certified Houston Generator Pros technicians</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Fast Setup</h4>
                  <p className="text-orange-100">Complete installation in just 3-5 hours with same-day WiFi setup and demo</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
