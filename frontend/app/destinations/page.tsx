import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Destination = {
  slug: string;
  title: string;
  description: string;
  image_url: string;
  price_cents: number;
  currency: string;
  duration_days: number;
};

async function getDestinations(): Promise<Destination[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/destinations`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load destinations');
  return res.json();
}

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="min-h-screen pt-20 bg-gray-50 bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Destinations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Link href={`/destinations/${destination.slug}`} key={destination.slug}>
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <img
                    src={destination.image_url}
                    alt={destination.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{destination.title}</CardTitle>
                  <CardDescription>{destination.description}</CardDescription>
                  <p className="mt-3 font-semibold">
                    ${(destination.price_cents / 100).toFixed(2)}{' '}
                    <span className="text-sm font-normal text-gray-500">
                      / {destination.duration_days} days
                    </span>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}