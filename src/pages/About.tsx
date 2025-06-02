import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Phone, MessageSquare, Users, Award, MapPin, Calendar, CheckCircle, Shield, Wrench, Clock, Star, Building, Target, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const About = () => {
  const stats = [{
    number: '15+',
    label: 'Years in Business'
  }, {
    number: '500+',
    label: 'Projects Completed'
  }, {
    number: '99.9%',
    label: 'Uptime Guarantee'
  }, {
    number: '24/7',
    label: 'Emergency Support'
  }];
  const team = [{
    name: 'Michael Brown',
    position: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1534528741702-a0cfae58c947?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=4&w=300&h=300&q=80',
    bio: 'Experienced entrepreneur with a passion for power solutions and a commitment to customer satisfaction.',
    experience: '15 years'
  }, {
    name: 'Jessica Davis',
    position: 'Service Manager',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dca953c?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=4&w=300&h=300&q=80',
    bio: 'Dedicated service professional ensuring every client receives prompt, reliable, and expert support.',
    experience: '10 years'
  }, {
    name: 'David Wilson',
    position: 'Lead Technician',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d674x?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=4&w=300&h=300&q=80',
    bio: 'Certified technician with extensive experience in generator installation, maintenance, and emergency repair.',
    experience: '12 years'
  }];
  const values = [{
    title: 'Reliability',
    description: 'We deliver dependable power solutions and responsive service you can count on, day or night.',
    icon: Shield
  }, {
    title: 'Expertise',
    description: 'Our certified technicians bring years of experience and specialized knowledge to every project.',
    icon: Wrench
  }, {
    title: 'Commitment',
    description: 'We are dedicated to exceeding customer expectations and building long-term partnerships.',
    icon: Heart
  }];
  const timeline = [{
    year: '2008',
    title: 'Company Founded',
    description: 'HOU GEN PROS was established with a vision to provide reliable power solutions to Houston businesses.'
  }, {
    year: '2012',
    title: 'Expanded Services',
    description: 'Introduced comprehensive maintenance programs and 24/7 emergency support services.'
  }, {
    year: '2018',
    title: 'New Headquarters',
    description: 'Opened a state-of-the-art headquarters and service center in Northwest Houston.'
  }, {
    year: '2023',
    title: 'Industry Leader',
    description: 'Recognized as Houston\'s premier generator service company with hundreds of satisfied clients.'
  }];
  const certifications = [{
    name: 'Licensed Electrical Contractor',
    description: 'Fully licensed, bonded, and insured for all electrical and generator services.',
    icon: Award
  }, {
    name: 'EGSA Certified',
    description: 'Certified by the Electrical Generating Systems Association for quality and safety.',
    icon: Star
  }, {
    name: 'Generac Power Pro Dealer',
    description: 'Authorized dealer and service provider for Generac generators.',
    icon: Building
  }, {
    name: 'BBB Accredited',
    description: 'Accredited by the Better Business Bureau with an A+ rating.',
    icon: Shield
  }];
  return <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Added more top padding */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-steel-800 to-steel-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-accent text-white border-accent px-4 py-2">
              Houston's Premier Generator Experts
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
              Powering Houston's
              <span className="block text-accent">Future Since 2008</span>
            </h1>
            <p className="text-xl text-steel-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              From humble beginnings to Houston's most trusted generator company, we've built our reputation 
              on reliability, expertise, and unwavering commitment to keeping your power on when it matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Meet Our Team
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white px-8 py-4 text-slate-950">
                <MessageSquare className="w-5 h-5 mr-2" />
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-steel-600 font-medium">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Leadership Team</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Meet the experienced professionals leading Houston's premier generator service company.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-0 shadow-md">
                <div className="relative h-80 bg-gradient-to-br from-steel-100 to-steel-200">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-accent font-medium">{member.position}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-steel-600 mb-4 text-sm">{member.bio}</p>
                  <div className="flex items-center text-sm text-steel-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {member.experience} with company
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Values</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              The principles that guide everything we do for our Houston customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
            const IconComponent = value.icon;
            return <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-steel-200">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-primary mb-4 text-xl">{value.title}</h3>
                    <p className="text-steel-600">{value.description}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-steel-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Our Journey</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              From startup to Houston's most trusted generator company - here's how we built our reputation.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((event, index) => <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-24 text-right mr-8">
                    <div className="text-2xl font-bold text-accent">{event.year}</div>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-accent rounded-full mt-2 mr-8"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <p className="text-steel-600">{event.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-6">Certifications & Partnerships</h2>
            <p className="text-xl text-steel-600 max-w-3xl mx-auto">
              Fully licensed, certified, and partnered with industry leaders to deliver exceptional service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <Award className="w-16 h-16 text-accent mx-auto mb-6" />
                  <h3 className="font-bold text-primary mb-3 text-lg">{cert.name}</h3>
                  <p className="text-steel-600 text-sm">{cert.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work with Houston's Best?</h2>
          <p className="text-xl text-steel-200 mb-10 max-w-3xl mx-auto">
            Experience the difference that comes from working with Houston's most trusted generator professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-accent hover:bg-orange-600 text-white px-8 py-4">
              <Phone className="w-5 h-5 mr-2" />
              Call (832) 555-POWER
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4">
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Your Free Quote
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default About;