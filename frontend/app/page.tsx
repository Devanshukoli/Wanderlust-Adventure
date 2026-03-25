import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Globe2, Users2, Clock, Shield, MapPin, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section 
        className="h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.0&auto=format&fit=crop&w=2021&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Experience unforgettable journeys to the world's most breathtaking destinations. Let us guide you to your dream vacation.
          </p>
          <Link href="/destinations">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore Destinations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Bali, Indonesia',
                image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                description: 'Tropical paradise with rich culture'
              },
              {
                title: 'Santorini, Greece',
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
                description: 'Iconic white buildings and stunning sunsets'
              },
              {
                title: 'Swiss Alps',
                image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
                description: 'Majestic mountains and pristine lakes'
              },
            ].map((destination, index) => (
              <div key={index} className="group relative bg-background rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{destination.title}</h3>
                  <p className="text-muted-foreground">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Wanderlust Adventures</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80"
                alt="Travel Experience"
                className="w-full h-[600px] object-cover rounded-lg"
              />
              <div className="absolute -bottom-8 -right-8 bg-background p-8 rounded-lg shadow-xl max-w-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">13+ Years Experience</h3>
                </div>
                <p className="text-muted-foreground">
                  Trusted by thousands of travelers worldwide for creating unforgettable journeys.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              {[
                {
                  icon: Globe2,
                  title: 'Global Expertise',
                  description: 'Our team of travel experts brings deep knowledge of destinations worldwide, ensuring authentic and enriching experiences.'
                },
                {
                  icon: Users2,
                  title: 'Personalized Service',
                  description: 'We craft each journey to match your unique preferences and travel style, delivering truly personalized adventures.'
                },
                {
                  icon: Shield,
                  title: 'Safe & Secure',
                  description: 'Your safety is our priority. We partner with trusted local operators and maintain strict safety standards.'
                },
                {
                  icon: Clock,
                  title: '24/7 Support',
                  description: 'Our dedicated support team is available around the clock to assist you throughout your journey.'
                },
                {
                  icon: MapPin,
                  title: 'Local Connections',
                  description: 'Access unique experiences and hidden gems through our network of local partners and guides.'
                }
              ].map((feature, index) => (
                <div key={index} className="flex gap-6">
                  <div className="bg-primary/10 p-3 h-fit rounded-full">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}