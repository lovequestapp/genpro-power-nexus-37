import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, AlertTriangle, CreditCard, Wrench, Clock } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '../components/SEO';

const TermsOfService = () => {
  return (
    <div>
      <SEO 
        title="Terms of Service | HOU GEN PROS | Houston Generator Company"
        description="Terms of service for HOU GEN PROS generator services in Houston. Read our service terms, conditions, and policies for generator installation and maintenance."
        keywords="terms of service HOU GEN PROS, generator company terms, Houston generator terms, generator service conditions"
        canonical="/terms"
        pageType="website"
      />
      <Header />
      <div className="min-h-screen bg-white pt-24">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent text-white">Legal Terms</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-steel-800 mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-steel-600">
                Please read these terms carefully before using our services.
              </p>
              <p className="text-sm text-steel-500 mt-4">
                Last updated: January 2025
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-accent" />
                    Agreement to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-steel-600">
                    By accessing and using HOU GEN PROS services, you accept and agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, you may not use our services.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-accent" />
                    Services Provided
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Generator Services</h4>
                    <ul className="list-disc pl-6 space-y-1 text-steel-600">
                      <li>Generator sales and installation</li>
                      <li>Preventive maintenance and repairs</li>
                      <li>Emergency service and support</li>
                      <li>Generator rental solutions</li>
                      <li>Parts and accessories</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Service Standards</h4>
                    <p className="text-steel-600">
                      All services are performed by licensed, insured technicians in accordance with local codes and manufacturer specifications.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-accent" />
                    Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Payment Requirements</h4>
                    <ul className="space-y-2 text-steel-600">
                      <li>• Payment is due upon completion of service unless otherwise agreed</li>
                      <li>• Financing options available for qualified customers</li>
                      <li>• Emergency service requires payment within 30 days</li>
                      <li>• Late payments may incur additional charges</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Pricing</h4>
                    <p className="text-steel-600">
                      All prices are subject to change without notice. Written estimates are valid for 30 days unless otherwise specified.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-accent" />
                    Warranties and Guarantees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Installation Warranty</h4>
                    <p className="text-steel-600">
                      We warrant our installation work for 5 years from completion date. This covers workmanship defects but not normal wear or damage from misuse.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Equipment Warranty</h4>
                    <p className="text-steel-600">
                      Generator equipment is covered by manufacturer warranty. We will assist with warranty claims but are not responsible for manufacturer defects.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-accent" />
                    Limitation of Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Service Limitations</h4>
                    <p className="text-steel-600">
                      Our liability is limited to the cost of services provided. We are not responsible for consequential damages, 
                      lost profits, or damages resulting from power outages.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-steel-800 mb-2">Force Majeure</h4>
                    <p className="text-steel-600">
                      We are not liable for delays or failures due to natural disasters, government actions, 
                      or other circumstances beyond our reasonable control.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-accent" />
                    Cancellation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-steel-600">
                    <li>• Service appointments can be cancelled up to 24 hours in advance</li>
                    <li>• Emergency service calls cannot be cancelled once technician is dispatched</li>
                    <li>• Installation contracts may be subject to cancellation fees</li>
                    <li>• Rental equipment must be returned in original condition</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-steel-600 mb-4">As a customer, you agree to:</p>
                  <ul className="space-y-2 text-steel-600">
                    <li>• Provide accurate information about your property and power needs</li>
                    <li>• Ensure safe access to installation and service areas</li>
                    <li>• Obtain necessary permits when required</li>
                    <li>• Follow all operating instructions and safety guidelines</li>
                    <li>• Schedule regular maintenance as recommended</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dispute Resolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-steel-600 mb-4">
                    Any disputes will be resolved through binding arbitration in Houston, Texas, 
                    in accordance with Texas state law. Both parties waive the right to jury trial.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-steel-600 mb-4">
                    For questions about these Terms of Service, contact us:
                  </p>
                  <div className="space-y-2 text-steel-600">
                    <p><strong>Email:</strong> legal@hougenpros.com</p>
                    <p><strong>Phone:</strong> (915) 800-7767</p>
                    <p><strong>Address:</strong> Houston, TX</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
