
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleServiceFormProps {
  onClose?: () => void;
}

const ScheduleServiceForm = ({ onClose }: ScheduleServiceFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    urgency: '',
    description: '',
    generatorBrand: '',
    generatorModel: '',
    lastServiceDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceTypes = [
    { value: 'installation', label: 'Generator Installation' },
    { value: 'maintenance', label: 'Preventive Maintenance' },
    { value: 'repair', label: 'Generator Repair' },
    { value: 'emergency', label: 'Emergency Service' },
    { value: 'inspection', label: 'Safety Inspection' },
    { value: 'consultation', label: 'Consultation' }
  ];

  const timeSlots = [
    { value: 'morning', label: '8:00 AM - 12:00 PM' },
    { value: 'afternoon', label: '12:00 PM - 5:00 PM' },
    { value: 'evening', label: '5:00 PM - 8:00 PM' },
    { value: 'anytime', label: 'Anytime' }
  ];

  const urgencyLevels = [
    { value: 'routine', label: 'Routine - Within 1-2 weeks' },
    { value: 'priority', label: 'Priority - Within 3-5 days' },
    { value: 'urgent', label: 'Urgent - Within 24-48 hours' },
    { value: 'emergency', label: 'Emergency - Same day' }
  ];

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date validation (should be in the future)
    if (formData.preferredDate) {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = 'Please select a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Please correct the highlighted fields and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual service call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to submit the form
      console.log('Form submitted:', formData);
      
      toast({
        title: "Service scheduled successfully!",
        description: "We'll contact you within 2 hours to confirm your appointment.",
        action: (
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Success</span>
          </div>
        ),
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        urgency: '',
        description: '',
        generatorBrand: '',
        generatorModel: '',
        lastServiceDate: ''
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose?.();
      }, 1500);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error scheduling service",
        description: "There was a problem submitting your request. Please try again or call us directly.",
        variant: "destructive",
        action: (
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span>Error</span>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Service Location</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
                placeholder="123 Main Street"
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                  placeholder="Houston"
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={errors.zipCode ? 'border-red-500' : ''}
                  placeholder="77001"
                />
                {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Service Details</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type *</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                <SelectTrigger className={errors.serviceType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                <SelectTrigger className={errors.urgency ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.urgency && <p className="text-sm text-red-500">{errors.urgency}</p>}
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Preferred Schedule</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  className={errors.preferredDate ? 'border-red-500' : ''}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.preferredDate && <p className="text-sm text-red-500">{errors.preferredDate}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Generator Information (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Generator Information (Optional)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generatorBrand">Generator Brand</Label>
                <Input
                  id="generatorBrand"
                  value={formData.generatorBrand}
                  onChange={(e) => handleInputChange('generatorBrand', e.target.value)}
                  placeholder="e.g., Generac, Kohler"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="generatorModel">Generator Model</Label>
                <Input
                  id="generatorModel"
                  value={formData.generatorModel}
                  onChange={(e) => handleInputChange('generatorModel', e.target.value)}
                  placeholder="e.g., Guardian 22kW"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastServiceDate">Last Service Date</Label>
              <Input
                id="lastServiceDate"
                type="date"
                value={formData.lastServiceDate}
                onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
              />
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Please describe your specific needs, any issues you're experiencing, or additional information that would help us prepare for your service call..."
                rows={4}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-steel-700 text-white flex-1"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling Service...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Service
                </>
              )}
            </Button>
            
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="text-sm text-steel-600 bg-steel-50 p-4 rounded-lg">
            <p className="mb-2">
              <strong>What happens next?</strong>
            </p>
            <ul className="space-y-1 text-sm">
              <li>• We'll contact you within 2 hours to confirm your appointment</li>
              <li>• Our technician will arrive at your scheduled time</li>
              <li>• All work comes with our satisfaction guarantee</li>
              <li>• Emergency services available 24/7</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ScheduleServiceForm;
