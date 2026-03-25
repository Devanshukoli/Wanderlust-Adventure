'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white-700 mb-1">
                  Name
                </label>
                <Input id="name" placeholder="Your name" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white-700 mb-1">
                  Email
                </label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-whtie-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="How can we help you?"
                  className="min-h-[150px]"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-gray-700 text-2xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-gray-600 font-semibold">Visit Us</h3>
                  <p className="text-gray-600">
                    123 Travel Street<br />
                    Adventure City, AC 12345<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-gray-700 font-semibold">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-gray-700 font-semibold">Email Us</h3>
                  <p className="text-gray-600">info@wanderlustadventures.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-gray-700 font-semibold mb-2">Business Hours</h3>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}