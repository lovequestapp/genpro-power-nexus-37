
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar as CalendarIcon, Clock, MapPin, Phone, Mail, User, Wrench, AlertTriangle, Settings, Truck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ScheduleServiceFormProps {
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  serviceType: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  urgency: string;
  description: string;
}

const ScheduleServiceForm = ({ onClose }: ScheduleServiceFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FormData>();

  const watchedDate = watch('preferredDate');
  const watchedServiceType = watch('serviceType');

  const serviceTypes = [
    { value: 'installation', label: 'Generator Installation', icon: Settings, color: 'bg-blue-500' },
    { value: 'maintenance', label: 'Preventive Maintenance', icon: Wrench, color: 'bg-green-500' },
    { value: 'emergency', label: 'Emergency Service', icon: AlertTriangle, color: 'bg-red-500' },
    { value: 'rental', label: 'Generator Rental', icon: Truck, color: 'bg-purple-500' }
  ];

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Standard (7-14 days)', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Priority (3-5 days)', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Urgent (1-2 days)', color: 'bg-orange-100 text-orange-800' },
    { value: 'emergency', label: 'Emergency (Same day)', color: 'bg-red-100 text-red-800' }
  ];

  const onSubmit = async (data: FormData) => {
    console.log('Scheduling service with data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: "Service Scheduled Successfully!",
      description: "We'll contact you within 2 hours to confirm your appointment.",
    });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-4">Service Request Submitted!</h3>
        <p className="text-steel-600 mb-6 text-lg">
          Thank you for choosing Houston Generator Pros. We'll contact you within 2 hours to confirm your appointment details.
        </p>
        <div className="bg-steel-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-steel-700">
            <strong>Next Steps:</strong> Our team will call you at the provided number to confirm your preferred date and time, 
            discuss specific requirements, and provide a detailed service estimate.
          </p>
        </div>
        <Button onClick={onClose} className="bg-primary hover:bg-steel-700 px-8">
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              currentStep >= step 
                ? "bg-primary text-white" 
                : "bg-steel-200 text-steel-500"
            )}>
              {step}
            </div>
            {step < 3 && (
              <div className={cn(
                "flex-1 h-1 mx-4",
                currentStep > step ? "bg-primary" : "bg-steel-200"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contact Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-primary mb-2">Contact Information</h3>
            <p className="text-steel-600">Let us know how to reach you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="flex items-center mb-2">
                <User className="w-4 h-4 mr-2" />
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center mb-2">
              <Phone className="w-4 h-4 mr-2" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(713) 555-0123"
              {...register('phone', { required: 'Phone number is required' })}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address" className="flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-2" />
              Service Address *
            </Label>
            <Input
              id="address"
              placeholder="1234 Main Street"
              {...register('address', { required: 'Address is required' })}
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Houston"
                {...register('city', { required: 'City is required' })}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                placeholder="77001"
                {...register('zipCode', { required: 'ZIP code is required' })}
                className={errors.zipCode ? 'border-red-500' : ''}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Service Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-primary mb-2">Service Details</h3>
            <p className="text-steel-600">Tell us what type of service you need</p>
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Service Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceTypes.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={service.value}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      watchedServiceType === service.value
                        ? "ring-2 ring-primary border-primary"
                        : "border-steel-200"
                    )}
                    onClick={() => setValue('serviceType', service.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", service.color)}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-steel-900">{service.label}</h4>
                        </div>
                        {watchedServiceType === service.value && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <input type="hidden" {...register('serviceType', { required: 'Service type is required' })} />
            {errors.serviceType && (
              <p className="text-red-500 text-sm mt-2">{errors.serviceType.message}</p>
            )}
          </div>

          <div>
            <Label className="text-base font-medium mb-4 block">Urgency Level *</Label>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <Card
                  key={level.value}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-sm",
                    watch('urgency') === level.value
                      ? "ring-2 ring-primary border-primary"
                      : "border-steel-200"
                  )}
                  onClick={() => setValue('urgency', level.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-xs", level.color)}>
                        {level.label}
                      </Badge>
                      {watch('urgency') === level.value && (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <input type="hidden" {...register('urgency', { required: 'Urgency level is required' })} />
            {errors.urgency && (
              <p className="text-red-500 text-sm mt-2">{errors.urgency.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium mb-2 block">
              Additional Details
            </Label>
            <Textarea
              id="description"
              placeholder="Please describe your generator needs, any specific requirements, or questions you may have..."
              rows={4}
              {...register('description')}
            />
          </div>
        </div>
      )}

      {/* Step 3: Schedule */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-primary mb-2">Schedule Your Service</h3>
            <p className="text-steel-600">Choose your preferred date and time</p>
          </div>

          <div>
            <Label className="flex items-center text-base font-medium mb-4">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Preferred Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedDate ? format(watchedDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchedDate}
                  onSelect={(date) => setValue('preferredDate', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.preferredDate && (
              <p className="text-red-500 text-sm mt-1">Please select a preferred date</p>
            )}
          </div>

          <div>
            <Label className="flex items-center text-base font-medium mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Preferred Time *
            </Label>
            <Select onValueChange={(value) => setValue('preferredTime', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register('preferredTime', { required: 'Preferred time is required' })} />
            {errors.preferredTime && (
              <p className="text-red-500 text-sm mt-1">{errors.preferredTime.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">What happens next?</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• We'll call you within 2 hours to confirm your appointment</li>
                  <li>• Our certified technician will arrive at your scheduled time</li>
                  <li>• Free assessment and detailed estimate provided on-site</li>
                  <li>• No obligation - get expert advice for your power needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6"
        >
          Previous
        </Button>

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="bg-primary hover:bg-steel-700 px-6"
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="submit"
            className="bg-accent hover:bg-orange-600 text-white px-8"
          >
            Schedule Service
          </Button>
        )}
      </div>
    </form>
  );
};

export default ScheduleServiceForm;
