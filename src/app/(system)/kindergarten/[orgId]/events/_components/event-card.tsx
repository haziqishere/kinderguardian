"use client";
import { CalendarDays, MapPin, DollarSign, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type EventCardProps = {
  title: string;
  dateTime: string;
  location: string;
  cost: number;
  description: string;
  teacherInCharge?: string;
};

export const EventCard = ({
  title,
  dateTime,
  location,
  cost,
  description,
  teacherInCharge,
}: EventCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{title[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateTime}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Event</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              {location}
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="mr-2 h-4 w-4" />
              RM {cost.toFixed(2)}
            </div>
          </div>

          {teacherInCharge && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Teacher in charge:
              </p>
              <p className="text-sm font-medium">{teacherInCharge}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
