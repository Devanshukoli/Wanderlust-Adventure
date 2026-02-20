'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const feedbacks = [
  {
    name: 'Sarah Johnson',
    feedback: 'Amazing experience! The team made our trip unforgettable.',
    location: 'Bali Trip'
  },
  {
    name: 'Michael Chen',
    feedback: 'Professional service and attention to detail. Highly recommended!',
    location: 'Swiss Alps Adventure'
  },
  {
    name: 'Emma Davis',
    feedback: 'Perfect organization and wonderful destinations. Will travel with them again!',
    location: 'Greece Tour'
  }
];

export default function AboutPage() {
  const [currentFeedback, setCurrentFeedback] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedback((prev) => (prev + 1) % feedbacks.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Wanderlust Adventures</h1>
          <p className="text-xl max-w-2xl">
            Creating unforgettable travel experiences since 2010. We believe in making every journey special.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Who We Are</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="text-lg text-white-700 mb-6">
                Wanderlust Adventures is a premium travel company dedicated to creating extraordinary journeys for adventurous souls. With over a decade of experience, we've helped thousands of travelers discover the world's most remarkable destinations.
              </p>
              <p className="text-lg text-white-700">
                Our team of experienced travel experts works tirelessly to craft unique itineraries that combine adventure, culture, and comfort. We believe that travel has the power to transform lives and create lasting memories.
              </p>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.0&auto=format&fit=crop&w=800&q=80"
                alt="Our Team"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Goals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Mission & Goals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Our Mission',
                content: 'To inspire and enable people to explore the world safely and sustainably, creating meaningful connections and unforgettable memories.'
              },
              {
                title: 'Our Vision',
                content: 'To become the worlds most trusted and innovative travel company, known for exceptional service and responsible tourism.'
              },
              {
                title: 'Our Values',
                content: 'Excellence in service, sustainability, cultural respect, and creating positive impact in the communities we visit.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-gray-950 text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Feedback */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h2>
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentFeedback * 100}%)` }}
            >
              {feedbacks.map((feedback, index) => (
                <Card key={index} className="min-w-full px-4">
                  <CardContent className="py-8">
                    <div className="text-center">
                      <p className="text-xl mb-6">"{feedback.feedback}"</p>
                      <p className="font-semibold">{feedback.name}</p>
                      <p className="text-gray-600">{feedback.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}