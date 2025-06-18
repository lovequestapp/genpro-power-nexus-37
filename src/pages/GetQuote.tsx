import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, Home, User, Calculator, CheckCircle, Phone, Mail, MapPin, Clock, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';

interface FormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Property Info
  address: string;
  city: string;
  zipCode: string;
  propertyType: string;
  homeSize: string;
  
  // Generator Needs
  generatorSize: string;
  powerNeeds: string[];
  fuelType: string;
  installationType: string;
  
  // Additional Info
  timeline: string;
  budget: string;
  additionalNotes: string;
}

const GetQuote = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    propertyType: '',
    homeSize: '',
    generatorSize: '',
    powerNeeds: [],
    fuelType: '',
    installationType: '',
    timeline: '',
    budget: '',
    additionalNotes: ''
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
    { number: 2, title: "Property Details", icon: Home, description: "Your home information" },
    { number: 3, title: "Generator Needs", icon: Calculator, description: "Power requirements" },
    { number: 4, title: "Review & Submit", icon: CheckCircle, description: "Confirm your details" }
  ];

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePowerNeedToggle = (need: string) => {
    setFormData(prev => ({
      ...prev,
      powerNeeds: prev.powerNeeds.includes(need)
        ? prev.powerNeeds.filter(n => n !== need)
        : [...prev.powerNeeds, need]
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const submitForm = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you! We\'ll contact you within 24 hours with your custom quote.');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 2:
        return formData.address && formData.city && formData.zipCode && formData.propertyType;
      case 3:
        return formData.generatorSize && formData.fuelType && formData.installationType;
      default:
        return true;
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-steel-50 via-white to-steel-100 py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-6 text-accent border-accent px-6 py-3 text-base">
              Free Generator Quote
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6">
              Get Your Custom Generator Quote
            </h1>
            <p className="text-lg text-steel-600 max-w-2xl mx-auto">
              Complete our quick form and receive a detailed quote within 24 hours. 
              Licensed & insured Houston Generator Pros ready to serve you.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-steel-200 -translate-y-1/2 z-0"></div>
              <div 
                className="absolute top-1/2 left-0 h-1 bg-accent -translate-y-1/2 z-10 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
              
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;
                
                return (
                  <div key={step.number} className="relative z-20 flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted ? 'bg-accent border-accent text-white' :
                      isActive ? 'bg-white border-accent text-accent' :
                      'bg-white border-steel-300 text-steel-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-3 text-center hidden sm:block">
                      <div className={`text-sm font-medium ${isActive || isCompleted ? 'text-primary' : 'text-steel-500'}`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-steel-400">{step.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <Card className="max-w-3xl mx-auto shadow-xl border-steel-200 mb-12">
            <CardHeader className="bg-gradient-to-r from-primary to-steel-700 text-white rounded-t-lg">
              <CardTitle className="text-xl sm:text-2xl">
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Smith"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john.smith@email.com"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(713) 555-0123"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Property Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Houston"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="77001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-family">Single Family Home</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="commercial">Commercial Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="homeSize">Approximate Home Size</Label>
                    <Select onValueChange={(value) => handleInputChange('homeSize', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select home size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1500">Under 1,500 sq ft</SelectItem>
                        <SelectItem value="1500-2500">1,500 - 2,500 sq ft</SelectItem>
                        <SelectItem value="2500-4000">2,500 - 4,000 sq ft</SelectItem>
                        <SelectItem value="over-4000">Over 4,000 sq ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Generator Needs */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="generatorSize">Generator Size *</Label>
                    <Select onValueChange={(value) => handleInputChange('generatorSize', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select generator size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18kw">18KW - Basic Coverage</SelectItem>
                        <SelectItem value="22kw">22KW - Standard Home</SelectItem>
                        <SelectItem value="24kw">24KW - Large Home</SelectItem>
                        <SelectItem value="26kw">26KW - Maximum Coverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>What do you need to power? (Select all that apply)</Label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Essential Circuits Only',
                        'HVAC System',
                        'Kitchen Appliances',
                        'Garage Door',
                        'Pool Equipment',
                        'Home Office',
                        'Security System',
                        'Entire Home'
                      ].map((need) => (
                        <div key={need} className="flex items-center space-x-2">
                          <Checkbox
                            id={need}
                            checked={formData.powerNeeds.includes(need)}
                            onCheckedChange={() => handlePowerNeedToggle(need)}
                          />
                          <Label htmlFor={need} className="text-sm">{need}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="fuelType">Preferred Fuel Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('fuelType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural-gas">Natural Gas</SelectItem>
                        <SelectItem value="propane">Propane (LP)</SelectItem>
                        <SelectItem value="either">Either (Need Recommendation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="installationType">Installation Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('installationType', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select installation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="complete-package">Complete Package (Generator + Installation)</SelectItem>
                        <SelectItem value="equipment-only">Equipment Only</SelectItem>
                        <SelectItem value="installation-only">Installation Only (I have generator)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeline">Preferred Timeline</Label>
                      <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asap">ASAP</SelectItem>
                          <SelectItem value="1-2-weeks">1-2 Weeks</SelectItem>
                          <SelectItem value="1-month">Within 1 Month</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="budget">Budget Range</Label>
                      <Select onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-8k">Under $8,000</SelectItem>
                          <SelectItem value="8k-12k">$8,000 - $12,000</SelectItem>
                          <SelectItem value="12k-15k">$12,000 - $15,000</SelectItem>
                          <SelectItem value="over-15k">Over $15,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes or Questions</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                      placeholder="Any specific requirements, concerns, or questions..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-steel-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 text-primary">Review Your Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-steel-800 mb-2">Contact Information</h4>
                        <div className="space-y-1 text-sm text-steel-600">
                          <p>{formData.firstName} {formData.lastName}</p>
                          <p>{formData.email}</p>
                          <p>{formData.phone}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-steel-800 mb-2">Property Details</h4>
                        <div className="space-y-1 text-sm text-steel-600">
                          <p>{formData.address}</p>
                          <p>{formData.city}, {formData.zipCode}</p>
                          <p>{formData.propertyType}</p>
                          {formData.homeSize && <p>{formData.homeSize}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-steel-800 mb-2">Generator Requirements</h4>
                        <div className="space-y-1 text-sm text-steel-600">
                          <p>Size: {formData.generatorSize}</p>
                          <p>Fuel: {formData.fuelType}</p>
                          <p>Type: {formData.installationType}</p>
                          {formData.timeline && <p>Timeline: {formData.timeline}</p>}
                          {formData.budget && <p>Budget: {formData.budget}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-steel-800 mb-2">Power Needs</h4>
                        <div className="space-y-1 text-sm text-steel-600">
                          {formData.powerNeeds.map((need, index) => (
                            <p key={index}>• {need}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {formData.additionalNotes && (
                      <div className="mt-4 pt-4 border-t border-steel-200">
                        <h4 className="font-medium text-steel-800 mb-2">Additional Notes</h4>
                        <p className="text-sm text-steel-600">{formData.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-accent/10 rounded-lg p-6 border border-accent/20">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-steel-800 mb-2">What Happens Next?</h4>
                        <ul className="space-y-2 text-sm text-steel-700">
                          <li>• We'll review your requirements within 2 hours</li>
                          <li>• A licensed Houston Generator Pros specialist will contact you within 24 hours</li>
                          <li>• We'll schedule a free on-site consultation at your convenience</li>
                          <li>• Receive a detailed written quote with transparent pricing</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-steel-200">
                <div className="flex items-center space-x-4">
                  {currentStep > 1 && (
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </Button>
                  )}
                  
                  <Link to="/" className="text-steel-500 hover:text-steel-700 text-sm">
                    Back to Home
                  </Link>
                </div>
                
                <div className="flex items-center space-x-4">
                  {currentStep < 4 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="bg-accent hover:bg-orange-600 text-white flex items-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitForm}
                      className="bg-accent hover:bg-orange-600 text-white flex items-center space-x-2 px-8"
                    >
                      <span>Submit Quote Request</span>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-steel-600">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">Licensed & Insured</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-steel-600">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">500+ Happy Customers</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-steel-600">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Free Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GetQuote;
