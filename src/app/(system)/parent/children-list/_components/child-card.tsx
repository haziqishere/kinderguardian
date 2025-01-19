"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ChildCardProps {
  id: string;
  name: string;
  class: string;
  isPresent: boolean;
  imageUrl: string;
}

export const ChildCard = ({
  id,
  name,
  class: className,
  isPresent,
  imageUrl,
}: ChildCardProps) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error("Failed to fetch image");

        const data = await response.json();
        // Use the front-facing image as the profile picture
        setPhotoUrl(data.data.front);
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(true);
      }
    };

    fetchImage();
  }, [imageUrl]);

  const handleClick = () => {
    router.push(`/parent/children-list/${id}`);
  };

  // Get initials for avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative">
          {photoUrl && !error ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{name}</h3>
          <p className="text-muted-foreground text-sm mb-2">{className}</p>
          <Badge
            variant={isPresent ? "positive" : "destructive"}
            className="mt-2"
          >
            {isPresent ? "Present" : "Absent"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
