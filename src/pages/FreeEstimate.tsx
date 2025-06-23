import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Home, Phone, Mail, Zap, Smile } from 'lucide-react';
import Header from '@/components/Header';
import SEO from '../components/SEO';

const steps = [
  'Contact Info',
  'Property Details',
  'Generator Needs',
  'Review & Submit',
];

export default function FreeEstimate() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    needs: '',
    contactMethod: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div>
      <SEO 
        title="Free Generator Estimate Houston | No-Obligation Generator Assessment | HOU GEN PROS"
        description="Get a free, no-obligation generator estimate in Houston. Professional assessment of your power needs, generator sizing, and installation requirements. Call today for your free estimate."
        keywords="free generator estimate Houston, generator assessment Houston, generator sizing Houston, power needs assessment Houston, generator consultation Houston, free generator evaluation Houston, generator requirements Houston"
        canonical="/free-estimate"
        pageType="website"
      />
      <Header />
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-24 mb-10 animate-in fade-in duration-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">Get Your Free Estimate</h1>
          <p className="text-steel-600 mt-2">Fill out the form below to receive a detailed quote for your generator needs.</p>
        </div>
        <div className="flex items-center mb-6">
          <Zap className="text-accent mr-2" />
          <h2 className="text-3xl font-bold text-primary">Free Estimate</h2>
        </div>
        <Progress value={((step + 1) / steps.length) * 100} className="mb-6" />
        <div className="flex justify-between mb-8">
          {steps.map((label, i) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${i <= step ? 'bg-accent text-white' : 'bg-steel-200 text-steel-500'}`}>{i < step ? <CheckCircle size={20} /> : i + 1}</div>
              <span className={`text-xs ${i === step ? 'font-bold text-primary' : 'text-steel-400'}`}>{label}</span>
            </div>
          ))}
        </div>
        {submitted ? (
          <div className="text-center py-10">
            <Smile className="mx-auto text-accent mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
            <p className="text-steel-700 mb-4">Your request has been submitted. Our team will contact you soon.</p>
            <Button onClick={() => { setStep(0); setSubmitted(false); }}>
              Submit Another Request
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {step === 0 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2">
                  <User className="text-accent" />
                  <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-accent" />
                  <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-accent" />
                  <Input name="phone" type="tel" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center gap-2">
                  <Home className="text-accent" />
                  <RadioGroup name="propertyType" value={form.propertyType} onValueChange={v => setForm(f => ({ ...f, propertyType: v }))} className="flex gap-4">
                    <RadioGroupItem value="residential" id="residential" />
                    <label htmlFor="residential">Residential</label>
                    <RadioGroupItem value="commercial" id="commercial" />
                    <label htmlFor="commercial">Commercial</label>
                    <RadioGroupItem value="industrial" id="industrial" />
                    <label htmlFor="industrial">Industrial</label>
                  </RadioGroup>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <label className="block font-medium mb-1">What are your generator needs?</label>
                <Textarea name="needs" placeholder="Describe your needs (e.g., backup, rental, installation, etc.)" value={form.needs} onChange={handleChange} required />
                <label className="block font-medium mb-1 mt-4">Preferred Contact Method</label>
                <RadioGroup name="contactMethod" value={form.contactMethod} onValueChange={v => setForm(f => ({ ...f, contactMethod: v }))} className="flex gap-4">
                  <RadioGroupItem value="email" id="contact-email" />
                  <label htmlFor="contact-email">Email</label>
                  <RadioGroupItem value="phone" id="contact-phone" />
                  <label htmlFor="contact-phone">Phone</label>
                </RadioGroup>
                <label className="block font-medium mb-1 mt-4">Additional Notes (optional)</label>
                <Textarea name="notes" placeholder="Anything else we should know?" value={form.notes} onChange={handleChange} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="font-bold text-lg mb-2">Review Your Info</h3>
                <div className="bg-steel-50 p-4 rounded-lg space-y-2">
                  <p><strong>Name:</strong> {form.name}</p>
                  <p><strong>Email:</strong> {form.email}</p>
                  <p><strong>Phone:</strong> {form.phone}</p>
                  <p><strong>Property Type:</strong> {form.propertyType}</p>
                  <p><strong>Needs:</strong> {form.needs}</p>
                  <p><strong>Contact Method:</strong> {form.contactMethod}</p>
                  {form.notes && <p><strong>Notes:</strong> {form.notes}</p>}
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8">
              {step > 0 && (
                <Button type="button" variant="outline" onClick={prev}>
                  Previous
                </Button>
              )}
              {step < steps.length - 1 ? (
                <Button type="button" onClick={next} disabled={!form.name || !form.email || !form.phone}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={!form.needs || !form.contactMethod}>
                  Submit Estimate Request
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 