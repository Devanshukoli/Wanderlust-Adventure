import { notFound } from "next/navigation";

const destinations = {
  bali: {
    title: "Bali, Indonesia",
    description: "Experience the magic of tropical paradise",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    content: `
      Discover the enchanting island of Bali, where ancient temples meet pristine beaches and lush rainforests. Known for its rich culture, stunning landscapes, and warm hospitality, Bali offers an unforgettable experience for every traveler.

      Popular attractions include:
      - Ubud Sacred Monkey Forest
      - Tanah Lot Temple
      - Tegalalang Rice Terraces
      - Uluwatu Temple
      - Nusa Dua Beach
    `,
    activities: [
      "Temple Hopping",
      "Surfing",
      "Yoga Retreats",
      "Cultural Performances",
      "Cooking Classes",
    ],
  },
  santorini: {
    title: "Santorini, Greece",
    description: "Discover the beauty of the Aegean Sea",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    content: `
      Experience the breathtaking beauty of Santorini, a jewel in the Aegean Sea. Famous for its white-washed buildings, blue-domed churches, and spectacular sunsets, this Greek paradise offers a perfect blend of romance, history, and natural beauty.

      Must-visit locations include:
      - Oia Village
      - Fira
      - Red Beach
      - Ancient Thera
      - Akrotiri Archaeological Site
    `,
    activities: [
      "Sunset Watching",
      "Wine Tasting",
      "Boat Tours",
      "Beach Hopping",
      "Photography Tours",
    ],
  },
  "swiss-alps": {
    title: "Swiss Alps",
    description: "Adventure in the heart of Europe",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7",
    content: `
      Embark on an alpine adventure in the majestic Swiss Alps. With breathtaking mountain scenery, pristine lakes, and charming villages, the Swiss Alps offer year-round activities for nature lovers and adventure seekers alike.

      Highlights include:
      - Zermatt and the Matterhorn
      - Jungfraujoch
      - Lake Lucerne
      - Interlaken
      - Glacier Express
    `,
    activities: [
      "Skiing",
      "Hiking",
      "Mountain Biking",
      "Paragliding",
      "Scenic Train Rides",
    ],
  },
};

export default function DestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = destinations[params.id as keyof typeof destinations];

  if (!destination) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="relative h-[50vh]">
        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">{destination.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xl mb-8 whitespace-pre-line">
            {destination.content}
          </p>

          <h2 className="text-2xl font-bold mb-4">Activities</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {destination.activities.map((activity, index) => (
              <li
                key={index}
                className="flex items-center bg-gray-50 p-4 rounded-lg"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
