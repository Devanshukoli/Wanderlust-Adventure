'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';

type Package = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  price_cents: number;
  currency: string;
  duration_days: number;
  activities: string[];
};

export default function DestinationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { session, isLoading } = useAuth();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [travelerName, setTravelerName] = useState('');
  const [travelerEmail, setTravelerEmail] = useState('');
  const [numTravelers, setNumTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/destinations/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then(setPkg)
      .catch(() => setNotFound(true));
  }, [params.id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;

    if (isLoading) return;

    if (!session) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/destinations/${params.id}`)}`);
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.randomUUID(),
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          packageId: pkg.id,
          travelerName,
          travelerEmail,
          numTravelers,
          travelDate,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (res.status === 401) {
          router.push(`/sign-in?redirect=${encodeURIComponent(`/destinations/${params.id}`)}`);
          return;
        }
        throw new Error(body.error || 'Could not create booking.');
      }

      const { clientSecret, bookingId } = await res.json();

      router.push(
        `/checkout?client_secret=${encodeURIComponent(clientSecret)}&booking_id=${bookingId}`
      );
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsBooking(false);
    }
  };

  if (notFound) {
    return <div className="min-h-screen pt-32 text-center">Destination not found.</div>;
  }
  if (!pkg) {
    return <div className="min-h-screen pt-32 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="relative h-[50vh]">
        <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{pkg.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xl mb-6">{pkg.description}</p>
            <p className="text-2xl font-bold mb-6">
              ${(pkg.price_cents / 100).toFixed(2)}{' '}
              <span className="text-sm font-normal text-gray-500">
                per person / {pkg.duration_days} days
              </span>
            </p>
            <h2 className="text-2xl font-bold mb-4">Activities</h2>
            <ul className="grid grid-cols-1 gap-3 mb-8">
              {pkg.activities.map((activity) => (
                <li key={activity} className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Book this trip</h2>
            <form onSubmit={handleBooking} className="space-y-4">
              <Input placeholder="Your name" required value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)} />
              <Input type="email" placeholder="Your email" required value={travelerEmail}
                onChange={(e) => setTravelerEmail(e.target.value)} />
              <Input type="number" min={1} placeholder="Number of travelers" required
                value={numTravelers} onChange={(e) => setNumTravelers(Number(e.target.value))} />
              <Input type="date" required value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)} />
              <p className="font-semibold">
                Total: ${((pkg.price_cents * numTravelers) / 100).toFixed(2)}
              </p>
              {bookingError && <p className="text-sm text-red-600">{bookingError}</p>}
              <Button type="submit" disabled={isBooking} className="w-full">
                {isBooking ? 'Creating booking...' : 'Continue to payment'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
