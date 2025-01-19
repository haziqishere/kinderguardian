import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface EventListProps {
  classId: string;
  kindergartenId: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: string;
}

const EventList = ({ classId, kindergartenId }: EventListProps) => {
  const { data: events, isLoading } = useQuery<{ data: Event[] }>({
    queryKey: ["events", kindergartenId],
    queryFn: async () => {
      const response = await fetch(
        `/api/kindergarten/${kindergartenId}/events`
      );
      if (!response.ok) throw new Error("Failed to fetch events");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!events?.data || events.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No upcoming events
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.data.map((event) => (
            <div
              key={event.id}
              className="space-y-2 rounded-xl p-3 shadow-xs border outline-0"
            >
              <h3 className="text-blue-600 font-medium hover:underline cursor-pointer">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500">
                {format(new Date(event.startDate), "d MMMM yyyy")}
              </p>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                Location: {event.location}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;
