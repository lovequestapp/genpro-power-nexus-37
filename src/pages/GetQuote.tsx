import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  User, 
  Home, 
  Phone, 
  Mail, 
  MapPin,
  Zap, 
  Calculator,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  Star
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const steps = [
  { id: 1, title: 'Contact Info', icon: User },
  { id: 2, title: 'Property Details', icon: Home },
  { id: 3, title: 'Power Requirements', icon: Zap },
  { id: 4, title: 'Project Details', icon: FileText },
  { id: 5, title: 'Review & Submit', icon: CheckCircle },
];

const formSchema = z.object({
  // Contact Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Property Details
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'Please enter a city'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
  propertyType: z.enum(['residential', 'commercial', 'industrial']),
  propertySize: z.string().min(1, 'Please select property size'),
  
  // Power Requirements
  currentElectricalPanel: z.string().min(1, 'Please select panel type'),
  essentialAppliances: z.array(z.string()).min(1, 'Please select at least one appliance'),
  generatorSize: z.string().optional(),
  fuelType: z.enum(['natural-gas', 'propane', 'diesel']),
  
  // Project Details
  installationType: z.enum(['new-install', 'replacement', 'upgrade']),
  timeline: z.string().min(1, 'Please select preferred timeline'),
  budget: z.string().min(1, 'Please select budget range'),
  additionalNotes: z.string().optional(),
  
  // Preferences
  contactMethod: z.enum(['phone', 'email', 'text']),
  contactTime: z.string().min(1, 'Please select preferred contact time'),
});

type FormData = z.infer<typeof formSchema>;

export default function GetQuote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essentialAppliances: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const watchedValues = watch();

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone'];
      case 2:
        return ['address', 'city', 'zipCode', 'propertyType', 'propertySize'];
      case 3:
        return ['currentElectricalPanel', 'essentialAppliances', 'fuelType'];
      case 4:
        return ['installationType', 'timeline', 'budget', 'contactMethod', 'contactTime'];
      default:
        return [];
    }
  };

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setSubmitted(true);
  };

  const getRecommendedGeneratorSize = () => {
    const appliances = watchedValues.essentialAppliances || [];
    const propertySize = watchedValues.propertySize;
    
    let recommendedKW = 0;
    
    // Base recommendation on property size
    switch (propertySize) {
      case 'small': recommendedKW = 18; break;
      case 'medium': recommendedKW = 22; break;
      case 'large': recommendedKW = 24; break;
      case 'extra-large': recommendedKW = 26; break;
    }
    
    // Adjust based on appliances
    if (appliances.includes('central-ac')) recommendedKW += 2;
    if (appliances.includes('electric-heat')) recommendedKW += 4;
    if (appliances.includes('pool-equipment')) recommendedKW += 2;
    
    return Math.min(26, recommendedKW);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center p-8 shadow-xl border-0 bg-white">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-primary mb-2">Quote Request Submitted!</h1>
                <p className="text-steel-600 text-lg">Thank you for choosing HOU GEN PROS</p>
              </div>
              
              <div className="bg-accent/5 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-2">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-accent mr-3" />
                    <span>Our team will review your request within 2 hours</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-accent mr-3" />
                    <span>We'll contact you via your preferred method</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="w-5 h-5 text-accent mr-3" />
                    <span>Receive a detailed quote within 24 hours</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-steel-500 mb-4">Need immediate assistance?</p>
                <Button size="lg" className="accent-gradient text-white">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (915) 800-7767
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-steel-50 to-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-accent text-white">
              Free Professional Quote
            </Badge>
            <h1 className="text-4xl font-bold text-primary mb-4">
              Get Your Custom Generator Quote
            </h1>
            <p className="text-xl text-steel-600 max-w-2xl mx-auto">
              Professional assessment in minutes. Detailed quote in 24 hours. 
              Licensed & insured Houston Generator Pros.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={(currentStep / steps.length) * 100} className="h-2 mb-4" />
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isActive 
                        ? 'bg-accent text-white' 
                        : 'bg-steel-200 text-steel-500'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs text-center hidden sm:block ${
                      isActive ? 'font-semibold text-primary' : 'text-steel-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <Card className="shadow-xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-steel-700 text-white">
              <CardTitle className="flex items-center text-2xl">
                <CurrentStepIcon className="w-6 h-6 mr-3" />
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Step 1: Contact Info */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Smith" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 w-5 h-5" />
                                <Input placeholder="john@example.com" {...field} className="h-12 pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 w-5 h-5" />
                                <Input placeholder="(555) 123-4567" {...field} className="h-12 pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Property Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Property Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 w-5 h-5" />
                                <Input placeholder="123 Main Street" {...field} className="h-12 pl-10" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">City</FormLabel>
                              <FormControl>
                                <Input placeholder="Houston" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="77001" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Property Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                              >
                                {[
                                  { value: 'residential', label: 'Residential', desc: 'Single/Multi-family home' },
                                  { value: 'commercial', label: 'Commercial', desc: 'Office, retail, restaurant' },
                                  { value: 'industrial', label: 'Industrial', desc: 'Manufacturing, warehouse' }
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-steel-50 cursor-pointer">
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <div className="flex-1">
                                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                        {option.label}
                                      </Label>
                                      <p className="text-sm text-steel-500">{option.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="propertySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Property Size</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2"
                              >
                                {[
                                  { value: 'small', label: 'Small', desc: 'Under 1,500 sq ft' },
                                  { value: 'medium', label: 'Medium', desc: '1,500-2,500 sq ft' },
                                  { value: 'large', label: 'Large', desc: '2,500-4,000 sq ft' },
                                  { value: 'extra-large', label: 'Extra Large', desc: 'Over 4,000 sq ft' }
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-steel-50 cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`size-${option.value}`} />
                                    <div className="flex-1">
                                      <Label htmlFor={`size-${option.value}`} className="font-medium cursor-pointer text-sm">
                                        {option.label}
                                      </Label>
                                      <p className="text-xs text-steel-500">{option.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Power Requirements */}
                  {currentStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <FormField
                        control={form.control}
                        name="currentElectricalPanel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Current Electrical Panel</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                              >
                                {[
                                  { value: '100-amp', label: '100 Amp Panel', desc: 'Older homes, basic coverage' },
                                  { value: '150-amp', label: '150 Amp Panel', desc: 'Standard for most homes' },
                                  { value: '200-amp', label: '200 Amp Panel', desc: 'Modern homes, full coverage' },
                                  { value: 'unsure', label: 'Not Sure', desc: 'We can assess during visit' }
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-steel-50 cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`panel-${option.value}`} />
                                    <div className="flex-1">
                                      <Label htmlFor={`panel-${option.value}`} className="font-medium cursor-pointer">
                                        {option.label}
                                      </Label>
                                      <p className="text-sm text-steel-500">{option.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="essentialAppliances"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Essential Appliances to Power (Select all that apply)</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                {[
                                  { value: 'central-ac', label: 'Central Air Conditioning' },
                                  { value: 'heating-system', label: 'Heating System' },
                                  { value: 'refrigerator', label: 'Refrigerator/Freezer' },
                                  { value: 'lights', label: 'Essential Lighting' },
                                  { value: 'outlets', label: 'Key Outlets' },
                                  { value: 'garage-door', label: 'Garage Door Opener' },
                                  { value: 'security-system', label: 'Security System' },
                                  { value: 'pool-equipment', label: 'Pool Equipment' },
                                  { value: 'well-pump', label: 'Well Pump' },
                                  { value: 'electric-heat', label: 'Electric Heat Pump' }
                                ].map((appliance) => (
                                  <div key={appliance.value} className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-steel-50">
                                    <input
                                      type="checkbox"
                                      id={appliance.value}
                                      checked={field.value?.includes(appliance.value) || false}
                                      onChange={(e) => {
                                        const currentValue = field.value || [];
                                        if (e.target.checked) {
                                          field.onChange([...currentValue, appliance.value]);
                                        } else {
                                          field.onChange(currentValue.filter((item) => item !== appliance.value));
                                        }
                                      }}
                                      className="w-4 h-4 text-accent"
                                    />
                                    <Label htmlFor={appliance.value} className="flex-1 cursor-pointer">
                                      {appliance.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Generator Size Recommendation */}
                      {watchedValues.propertySize && watchedValues.essentialAppliances?.length > 0 && (
                        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Star className="w-5 h-5 text-accent mr-2" />
                            <span className="font-semibold text-accent">Recommended Generator Size</span>
                          </div>
                          <p className="text-steel-700">
                            Based on your selections, we recommend a <strong>{getRecommendedGeneratorSize()}KW generator</strong> for optimal coverage.
                          </p>
                        </div>
                      )}
                      
                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Preferred Fuel Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                              >
                                {[
                                  { value: 'natural-gas', label: 'Natural Gas', desc: 'Most convenient, unlimited supply' },
                                  { value: 'propane', label: 'Propane', desc: 'Reliable, stored on-site' },
                                  { value: 'diesel', label: 'Diesel', desc: 'Industrial applications' }
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-steel-50 cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`fuel-${option.value}`} />
                                    <div className="flex-1">
                                      <Label htmlFor={`fuel-${option.value}`} className="font-medium cursor-pointer">
                                        {option.label}
                                      </Label>
                                      <p className="text-sm text-steel-500">{option.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Project Details */}
                  {currentStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <FormField
                        control={form.control}
                        name="installationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Installation Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
                              >
                                {[
                                  { value: 'new-install', label: 'New Installation', desc: 'First-time generator setup' },
                                  { value: 'replacement', label: 'Generator Replacement', desc: 'Replace existing unit' },
                                  { value: 'upgrade', label: 'System Upgrade', desc: 'Upgrade current system' }
                                ].map((option) => (
                                  <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-steel-50 cursor-pointer">
                                    <RadioGroupItem value={option.value} id={`install-${option.value}`} />
                                    <div className="flex-1">
                                      <Label htmlFor={`install-${option.value}`} className="font-medium cursor-pointer">
                                        {option.label}
                                      </Label>
                                      <p className="text-sm text-steel-500">{option.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="timeline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Preferred Timeline</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-2 mt-2"
                                >
                                  {[
                                    { value: 'asap', label: 'As Soon As Possible' },
                                    { value: '1-2-weeks', label: '1-2 Weeks' },
                                    { value: '1-month', label: 'Within 1 Month' },
                                    { value: '2-3-months', label: '2-3 Months' },
                                    { value: 'planning', label: 'Just Planning Ahead' }
                                  ].map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
                                      <Label htmlFor={`timeline-${option.value}`} className="cursor-pointer">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Budget Range</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-2 mt-2"
                                >
                                  {[
                                    { value: 'under-8k', label: 'Under $8,000' },
                                    { value: '8k-12k', label: '$8,000 - $12,000' },
                                    { value: '12k-16k', label: '$12,000 - $16,000' },
                                    { value: '16k-20k', label: '$16,000 - $20,000' },
                                    { value: 'over-20k', label: 'Over $20,000' }
                                  ].map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option.value} id={`budget-${option.value}`} />
                                      <Label htmlFor={`budget-${option.value}`} className="cursor-pointer">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contactMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Preferred Contact Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-2 mt-2"
                                >
                                  {[
                                    { value: 'phone', label: 'Phone Call' },
                                    { value: 'email', label: 'Email' },
                                    { value: 'text', label: 'Text Message' }
                                  ].map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option.value} id={`contact-${option.value}`} />
                                      <Label htmlFor={`contact-${option.value}`} className="cursor-pointer">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Best Time to Contact</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  className="space-y-2 mt-2"
                                >
                                  {[
                                    { value: 'morning', label: 'Morning (8AM-12PM)' },
                                    { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
                                    { value: 'evening', label: 'Evening (5PM-8PM)' },
                                    { value: 'anytime', label: 'Anytime' }
                                  ].map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option.value} id={`time-${option.value}`} />
                                      <Label htmlFor={`time-${option.value}`} className="cursor-pointer">
                                        {option.label}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-semibold">Additional Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any specific requirements, concerns, or questions about your generator installation..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 5: Review & Submit */}
                  {currentStep === 5 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="bg-steel-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Review Your Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-steel-700 mb-2">Contact Information</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Name:</strong> {watchedValues.firstName} {watchedValues.lastName}</p>
                              <p><strong>Email:</strong> {watchedValues.email}</p>
                              <p><strong>Phone:</strong> {watchedValues.phone}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-steel-700 mb-2">Property Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Address:</strong> {watchedValues.address}</p>
                              <p><strong>City:</strong> {watchedValues.city}, {watchedValues.zipCode}</p>
                              <p><strong>Type:</strong> {watchedValues.propertyType}</p>
                              <p><strong>Size:</strong> {watchedValues.propertySize}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-steel-700 mb-2">Power Requirements</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Panel:</strong> {watchedValues.currentElectricalPanel}</p>
                              <p><strong>Fuel Type:</strong> {watchedValues.fuelType}</p>
                              <p><strong>Appliances:</strong> {watchedValues.essentialAppliances?.length || 0} selected</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-steel-700 mb-2">Project Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Type:</strong> {watchedValues.installationType}</p>
                              <p><strong>Timeline:</strong> {watchedValues.timeline}</p>
                              <p><strong>Budget:</strong> {watchedValues.budget}</p>
                              <p><strong>Contact:</strong> {watchedValues.contactMethod} - {watchedValues.contactTime}</p>
                            </div>
                          </div>
                        </div>
                        
                        {watchedValues.additionalNotes && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-steel-700 mb-2">Additional Notes</h4>
                            <p className="text-sm bg-white p-3 rounded border">{watchedValues.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
                        <h4 className="font-semibold text-accent mb-2">What happens next?</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-accent mr-2" />
                            <span>Our team will review your request within 2 hours</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-accent mr-2" />
                            <span>We'll contact you via your preferred method</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-accent mr-2" />
                            <span>Receive a detailed quote within 24 hours</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-accent mr-2" />
                            <span>Schedule your professional installation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={prevStep} className="flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={nextStep} className="flex items-center accent-gradient text-white">
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" className="flex items-center accent-gradient text-white">
                        Submit Quote Request
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
