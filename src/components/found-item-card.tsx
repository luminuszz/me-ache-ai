"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { defaultImageUrl } from "@/lib/utils";
import dayjs from "dayjs";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ListItemProps {
  lostItem: {
    name: string;
    description: string;
    locationFound: string;
    createdAt: string | Date;
    imageUrl: string;
  };
}

export function FoundItemCard({ lostItem }: ListItemProps) {
  const { createdAt, description, imageUrl, locationFound, name } = lostItem;

  const formattedCreatedAt = dayjs(createdAt).format("DD/MM/YYYY [as] HH:mm");

  const [currentImage, setCurrentImage] = useState(imageUrl);

  return (
    <Card className="w-full max-w-sm overflow-hidden cursor-pointer">
      <div className="relative w-full h-48">
        <Image
          onError={() => {
            setCurrentImage(defaultImageUrl);
          }}
          src={currentImage}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <CardTitle className="text-xl font-bold">{name}</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">{description}</CardDescription>

            <div className="flex items-center text-sm">
              <Calendar className="size-4 mr-2" />
              <span>{formattedCreatedAt}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <p className="text-sm">Onde foi encontrado:</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{locationFound}</p>
      </CardContent>
    </Card>
  );
}
