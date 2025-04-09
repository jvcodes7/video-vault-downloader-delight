
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const MusicSlideshow: React.FC = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1571310100246-e0676f359b30?q=80&w=2574&auto=format&fit=crop",
      alt: "Person with headphones",
    },
    {
      src: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?q=80&w=2574&auto=format&fit=crop",
      alt: "People enjoying music at concert",
    },
    {
      src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop",
      alt: "DJ mixing music",
    },
    {
      src: "https://images.unsplash.com/photo-1581368135153-a506cf13531c?q=80&w=2670&auto=format&fit=crop",
      alt: "Person listening to vinyl records",
    },
  ];

  return (
    <Carousel
      className="w-full max-w-md mx-auto"
      opts={{
        loop: true,
        align: "start",
      }}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="overflow-hidden border-0 rounded-xl shadow-md">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-2">
        <CarouselPrevious className="relative static left-0 right-auto translate-y-0 mx-2" />
        <CarouselNext className="relative static left-0 right-auto translate-y-0 mx-2" />
      </div>
    </Carousel>
  );
};

export default MusicSlideshow;
