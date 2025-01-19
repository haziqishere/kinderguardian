"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkImageAccess = async () => {
      try {
        const response = await fetch(imageUrl);
        // If response is not an image (e.g. XML error), set error state
        if (
          !response.ok ||
          !response.headers.get("content-type")?.includes("image")
        ) {
          setImageError(true);
        } else {
          setImageError(false);
        }
      } catch (error) {
        console.error("Error checking image access:", error);
        setImageError(true);
      }
    };

    checkImageAccess();
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
          {!imageError ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
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
