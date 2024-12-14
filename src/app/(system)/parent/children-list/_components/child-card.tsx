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

interface ChildCardProps {
  id: string;
  name: string;
  class: string;
  isPresent: boolean;
  imageUrl?: string;
}

export const ChildCard = ({
  id,
  name,
  class: className,
  isPresent,
  imageUrl,
}: ChildCardProps) => {
  // Get initials for avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-x-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={imageUrl} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-base">{name}</h3>
                <p className="text-sm text-muted-foreground">{className}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => {}}>Edit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Badge
              variant={isPresent ? "positive" : "default"}
              className="mt-2"
            >
              {isPresent ? "At kindergarten" : "Not at kindergarten"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
