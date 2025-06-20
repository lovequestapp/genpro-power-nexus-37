
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Award, Clock, Wrench, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';

const Warranty = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-white">Warranty Protection</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-steel-800 mb-6">
              Comprehensive Warranty Coverage
            </h1>
            <p className="text-xl text-steel-600">
              Your investment is protected with industry-leading warranty coverage and professional support.
            </p>
          </div>

          <div className="space-y-8">
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-accent" />
                  5-Year Installation Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-accent/10 p-6 rounded-lg">
                  <h4 className="font-bold text-steel-800 mb-3 text-lg">What's Covered</h4>
                  <ul className="space-y-2 text-steel-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>All electrical connections and wiring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Automatic transfer switch installation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Gas line connections and fittings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Concrete pad and mounting system</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>System startup and commissioning</span>
                    </li>
                  </ul>
                </div>
                <p className="text-steel-600">
                  <strong>Coverage Period:</strong> 5 years from installation completion date
                </p>
                <p className="text-steel-600">
                  <strong>Response Time:</strong> 24-48 hours for warranty service calls
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  Generac Manufacturer Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-steel-800 mb-2">Residential Generators</h4>
                    <ul className="space-y-1 text-steel-600 text-sm">
                      <li>• 10-year limited warranty</li>
                      <li>• Covers parts and labor</li>
                      <li>• 24/7 customer support</li>
                      <li>• Nationwide service network</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-steel-800 mb-2">Commercial Generators</h4>
                    <ul className="space-y-1 text-steel-600 text-sm">
                      <li>• 5-year limited warranty</li>
                      <li>• Extended coverage available</li>
                      <li>• Priority service response</li>
                      <li>• Dedicated support team</li>
                    </ul>
                  </div>
                </div>
                <p className="text-steel-600">
                  We handle all manufacturer warranty claims on your behalf, ensuring fast resolution and minimal downtime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wrench className="w-6 h-6 text-accent" />
                  Service & Maintenance Warranty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2">Maintenance Services</h4>
                  <ul className="space-y-2 text-steel-600">
                    <li>• 90-day warranty on all maintenance work</li>
                    <li>• 6-month warranty on parts replacement</li>
                    <li>• Guaranteed performance improvement</li>
                    <li>• Return visit at no charge if issues persist</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2">Repair Services</h4>
                  <ul className="space-y-2 text-steel-600">
                    <li>• 1-year warranty on repair work</li>
                    <li>• Parts warranty matches manufacturer terms</li>
                    <li>• Emergency repair guarantee</li>
                    <li>• Performance testing included</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-accent" />
                  Warranty Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2">Warranty Coverage</h4>
                  <ul className="space-y-2 text-steel-600">
                    <li>• Covers defects in materials and workmanship</li>
                    <li>• Includes necessary parts and labor</li>
                    <li>• Valid with proof of purchase and registration</li>
                    <li>• Transferable to new property owner</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    Warranty Exclusions
                  </h4>
                  <ul className="space-y-2 text-steel-600">
                    <li>• Damage from natural disasters or extreme weather</li>
                    <li>• Normal wear and tear items (filters, spark plugs)</li>
                    <li>• Damage from improper use or modifications</li>
                    <li>• Issues caused by inadequate maintenance</li>
                    <li>• Damage from power surges or electrical issues</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to File a Warranty Claim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-steel-800 mb-2">Contact Us</h4>
                    <p className="text-steel-600 text-sm">Call our warranty hotline or submit an online claim</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-steel-800 mb-2">Provide Information</h4>
                    <p className="text-steel-600 text-sm">Share your warranty details and describe the issue</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-steel-800 mb-2">Schedule Service</h4>
                    <p className="text-steel-600 text-sm">We'll schedule a convenient time for warranty service</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-accent" />
                  Warranty Support Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-3">Emergency Warranty Service</h4>
                    <div className="space-y-2 text-steel-600">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-accent" />
                        <span>(915) 800-7767</span>
                      </p>
                      <p className="text-sm">Available 24/7 for warranty emergencies</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-3">General Warranty Claims</h4>
                    <div className="space-y-2 text-steel-600">
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-accent" />
                        <span>warranty@hougenpros.com</span>
                      </p>
                      <p className="text-sm">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Warranty;
