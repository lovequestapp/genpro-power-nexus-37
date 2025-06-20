
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent text-white">Privacy & Security</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-steel-800 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-steel-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-steel-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-accent" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2">Personal Information</h4>
                  <ul className="list-disc pl-6 space-y-1 text-steel-600">
                    <li>Name, email address, and phone number</li>
                    <li>Property address and service location</li>
                    <li>Generator specifications and power requirements</li>
                    <li>Billing and payment information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-steel-800 mb-2">Technical Information</h4>
                  <ul className="list-disc pl-6 space-y-1 text-steel-600">
                    <li>Website usage data and analytics</li>
                    <li>IP address and browser information</li>
                    <li>Service call logs and maintenance records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-accent" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-steel-600">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>Provide generator sales, installation, and maintenance services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>Process payments and manage customer accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>Schedule service appointments and emergency calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>Send service reminders and warranty notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                    <span>Improve our services and customer experience</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-accent" />
                  Information Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-steel-600">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="space-y-2 text-steel-600">
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>SSL encryption for all data transmission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure payment processing through trusted providers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Limited access to personal information on a need-to-know basis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Regular security audits and system updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-accent" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-steel-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:
                </p>
                <ul className="space-y-2 text-steel-600">
                  <li>• With Generac and authorized parts suppliers for warranty service</li>
                  <li>• With payment processors for transaction completion</li>
                  <li>• When required by law or to protect our legal rights</li>
                  <li>• With emergency services during power outage situations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-steel-600 mb-4">You have the right to:</p>
                <ul className="space-y-2 text-steel-600">
                  <li>• Access and review your personal information</li>
                  <li>• Request corrections to inaccurate data</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Request deletion of your account and data</li>
                  <li>• Receive a copy of your data in a portable format</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="w-6 h-6 text-accent" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-steel-600 mb-4">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
                </p>
                <div className="space-y-2 text-steel-600">
                  <p><strong>Email:</strong> privacy@hougenpros.com</p>
                  <p><strong>Phone:</strong> (915) 800-7767</p>
                  <p><strong>Address:</strong> Houston, TX</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
