
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, AlertCircle, Phone, Mail, MapPin, Calculator, Shield, Star, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  zipCode: string;
  serviceType: string;
  generatorType: string;
  powerRequirements: string;
  fuelType: string;
  installationType: string;
  projectDescription: string;
  budgetRange: string;
  timeline: string;
  emergencyService: boolean;
  maintenancePlan: boolean;
  financing: boolean;
  preferredContact: string;
  additionalNotes: string;
}

const QuoteForm = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    zipCode: '',
    serviceType: '',
    generatorType: '',
    powerRequirements: '',
    fuelType: '',
    installationType: '',
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    emergencyService: false,
    maintenancePlan: false,
    financing: false,
    preferredContact: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string>('');

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Full name is required' : '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return !phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) ? 'Please enter a valid phone number' : '';
      case 'serviceType':
        return !value ? 'Please select a service type' : '';
      case 'projectDescription':
        return !value.trim() ? 'Project description is required' : '';
      case 'address':
        return !value.trim() ? 'Address is required' : '';
      case 'city':
        return !value.trim() ? 'City is required' : '';
      case 'zipCode':
        return !value.trim() ? 'ZIP code is required' : '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const requiredFields = ['name', 'email', 'phone', 'serviceType', 'projectDescription', 'address', 'city', 'zipCode'];
    
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof QuoteFormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Submit to quotes table
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || null,
          address: formData.address,
          city: formData.city,
          zip_code: formData.zipCode,
          service_type: formData.serviceType,
          generator_type: formData.generatorType || null,
          power_requirements: formData.powerRequirements || null,
          fuel_type: formData.fuelType || null,
          installation_type: formData.installationType || null,
          project_description: formData.projectDescription,
          budget_range: formData.budgetRange || null,
          timeline: formData.timeline || null,
          emergency_service: formData.emergencyService,
          maintenance_plan: formData.maintenancePlan,
          financing: formData.financing,
          preferred_contact: formData.preferredContact || null,
          additional_notes: formData.additionalNotes || null,
          status: 'pending'
        }])
        .select()
        .single();

      if (quoteError) {
        console.error('Quote submission error:', quoteError);
        throw new Error('Failed to submit quote request');
      }

      // Also submit to form submissions for tracking
      try {
        await supabase
          .from('form_submissions')
          .insert([{
            form_slug: 'quote-request',
            data: formData,
            status: 'new'
          }]);
      } catch (formError) {
        console.warn('Form submission tracking failed:', formError);
      }

      setSubmittedQuoteId(quoteData.id);
      setSubmitStatus('success');
      toast.success('Quote request submitted successfully! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        zipCode: '',
        serviceType: '',
        generatorType: '',
        powerRequirements: '',
        fuelType: '',
        installationType: '',
        projectDescription: '',
        budgetRange: '',
        timeline: '',
        emergencyService: false,
        maintenancePlan: false,
        financing: false,
        preferredContact: '',
        additionalNotes: ''
      });

      console.log('Quote submitted successfully:', {
        quoteId: quoteData.id,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('There was an error submitting the form. Please try again or contact us directly at (915) 800-7767.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: keyof QuoteFormData, type: string, label: string, required: boolean = false, options?: any) => {
    const value = formData[field];
    const error = errors[field];

    const commonProps = {
      id: field,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field, e.target.value),
      className: error ? 'border-red-500 focus:border-red-500' : '',
    };

    switch (type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium text-steel-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              type={type}
              value={value as string}
              placeholder={`Enter your ${label.toLowerCase()}`}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium text-steel-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              value={value as string}
              rows={4}
              placeholder={`Describe your ${label.toLowerCase()}`}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field} className="space-y-2">
            <Label htmlFor={field} className="text-sm font-medium text-steel-700">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={value as string}
              onValueChange={(val) => handleInputChange(field, val)}
            >
              <SelectTrigger className={error ? 'border-red-500 focus:border-red-500' : ''}>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field} className="flex items-center space-x-2">
            <Checkbox
              id={field}
              checked={value as boolean}
              onCheckedChange={(checked) => handleInputChange(field, checked)}
            />
            <Label htmlFor={field} className="text-sm font-medium text-steel-700">
              {label}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-xl border-steel-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary via-steel-700 to-primary text-white">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6" />
            <div>
              <CardTitle className="text-xl sm:text-2xl">Generator Quote Request</CardTitle>
              <CardDescription className="text-steel-100">
                Get your custom generator quote in 24 hours
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8">
          {submitStatus === 'success' && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <div className="space-y-2">
                  <p className="font-semibold">Thank you! Your quote request has been submitted successfully.</p>
                  <p>Our team will review your requirements and get back to you within 24 hours.</p>
                  {submittedQuoteId && (
                    <p className="text-sm">
                      <strong>Quote ID:</strong> {submittedQuoteId}
                    </p>
                  )}
                  <p className="text-sm">
                    You can also contact us directly at{' '}
                    <a 
                      href="tel:+19158007767" 
                      className="text-green-600 hover:text-green-700 underline cursor-pointer"
                    >
                      (915) 800-7767
                    </a>{' '}
                    for immediate assistance.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                There was an error submitting the form. Please try again or contact us directly.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-steel-800">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('name', 'text', 'Full Name', true)}
                {renderField('email', 'email', 'Email Address', true)}
                {renderField('phone', 'tel', 'Phone Number', true)}
                {renderField('company', 'text', 'Company Name')}
              </div>
            </div>

            <Separator />

            {/* Service Location */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-steel-800">Service Location</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('address', 'text', 'Street Address', true)}
                {renderField('city', 'text', 'City', true)}
                {renderField('zipCode', 'text', 'ZIP Code', true)}
              </div>
            </div>

            <Separator />

            {/* Service Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-steel-800">Service Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('serviceType', 'select', 'Service Type', true, [
                  { value: 'generator_installation', label: 'Generator Installation' },
                  { value: 'maintenance', label: 'Maintenance Service' },
                  { value: 'repair', label: 'Repair Service' },
                  { value: 'emergency_service', label: 'Emergency Service' },
                  { value: 'consultation', label: 'Consultation' },
                  { value: 'upgrade', label: 'System Upgrade' }
                ])}
                
                {renderField('generatorType', 'select', 'Generator Type', false, [
                  { value: 'standby', label: 'Standby Generator' },
                  { value: 'portable', label: 'Portable Generator' },
                  { value: 'inverter', label: 'Inverter Generator' },
                  { value: 'commercial', label: 'Commercial Generator' },
                  { value: 'industrial', label: 'Industrial Generator' },
                  { value: 'not_sure', label: 'Not Sure - Need Consultation' }
                ])}
                
                {renderField('powerRequirements', 'select', 'Power Requirements', false, [
                  { value: 'whole_house', label: 'Whole House Backup' },
                  { value: 'essential_circuits', label: 'Essential Circuits Only' },
                  { value: 'specific_appliances', label: 'Specific Appliances' },
                  { value: 'commercial_load', label: 'Commercial Load' },
                  { value: 'not_sure', label: 'Not Sure - Need Assessment' }
                ])}
                
                {renderField('fuelType', 'select', 'Preferred Fuel Type', false, [
                  { value: 'natural_gas', label: 'Natural Gas' },
                  { value: 'propane', label: 'Propane' },
                  { value: 'diesel', label: 'Diesel' },
                  { value: 'gasoline', label: 'Gasoline' },
                  { value: 'not_sure', label: 'Not Sure - Need Recommendation' }
                ])}
                
                {renderField('installationType', 'select', 'Installation Type', false, [
                  { value: 'new_installation', label: 'New Installation' },
                  { value: 'replacement', label: 'Replacement' },
                  { value: 'upgrade', label: 'Upgrade Existing' },
                  { value: 'maintenance', label: 'Maintenance Only' }
                ])}
                
                {renderField('preferredContact', 'select', 'Preferred Contact Method', false, [
                  { value: 'phone', label: 'Phone Call' },
                  { value: 'email', label: 'Email' },
                  { value: 'text', label: 'Text Message' },
                  { value: 'any', label: 'Any Method' }
                ])}
              </div>
            </div>

            <Separator />

            {/* Project Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-steel-800">Project Details</h3>
              </div>
              
              {renderField('projectDescription', 'textarea', 'Project Description', true)}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('budgetRange', 'select', 'Budget Range', false, [
                  { value: 'under_5k', label: 'Under $5,000' },
                  { value: '5k_10k', label: '$5,000 - $10,000' },
                  { value: '10k_25k', label: '$10,000 - $25,000' },
                  { value: '25k_50k', label: '$25,000 - $50,000' },
                  { value: 'over_50k', label: 'Over $50,000' },
                  { value: 'not_sure', label: 'Not Sure - Need Quote' }
                ])}
                
                {renderField('timeline', 'select', 'Project Timeline', false, [
                  { value: 'immediate', label: 'Immediate' },
                  { value: '1_month', label: 'Within 1 month' },
                  { value: '3_months', label: 'Within 3 months' },
                  { value: '6_months', label: 'Within 6 months' },
                  { value: 'flexible', label: 'Flexible' }
                ])}
              </div>
            </div>

            <Separator />

            {/* Additional Services */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-steel-800">Additional Services</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('emergencyService', 'checkbox', 'Emergency Service Available')}
                {renderField('maintenancePlan', 'checkbox', 'Maintenance Plan Interest')}
                {renderField('financing', 'checkbox', 'Financing Options Interest')}
              </div>
            </div>

            <Separator />

            {/* Additional Notes */}
            <div className="space-y-4">
              {renderField('additionalNotes', 'textarea', 'Additional Notes or Special Requirements')}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-steel-700 hover:from-steel-700 hover:to-primary text-white py-3 text-lg font-semibold"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Quote Request...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Get My Free Quote
                  </>
                )}
              </Button>
              
              <p className="text-xs text-steel-500 text-center mt-3">
                By submitting this form, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
