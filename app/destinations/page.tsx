import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const destinations = [
  {
    id: "bali",
    title: "Bali, Indonesia",
    description: "Experience the magic of tropical paradise",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
  },
  {
    id: "santorini",
    title: "Santorini, Greece",
    description: "Discover the beauty of the Aegean Sea",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
  },
  {
    id: "swiss-alps",
    title: "Swiss Alps",
    description: "Adventure in the heart of Europe",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
  },
  // Add more destinations as needed
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50 bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Our Destinations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Link href={`/destinations/${destination.id}`} key={destination.id}>
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardHeader>
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{destination.title}</CardTitle>
                  <CardDescription>{destination.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
