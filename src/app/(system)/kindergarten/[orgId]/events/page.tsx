import { EventCard } from "./_components/event-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { EventFormDialog } from "./_components/event-form-dialog";

export default function EventsPage() {
  // Sample data - will be replaced with real data
  const upcomingEvents = [
    {
      id: "1",
      title: "Petrosains KLCC Visit",
      dateTime: "30 March 2024",
      location: "KLCC, Kuala Lumpur",
      cost: 45.0,
      description:
        "Educational visit to Petrosains Discovery Centre to learn about science and technology through interactive exhibits.",
      teacherInCharge: "Sarah Madiyah",
    },
    {
      id: "2",
      title: "Beryl's Chocolate Factory Visit",
      dateTime: "8 August 2024",
      location: "Beryl's Chocolate Factory",
      cost: 35.0,
      description:
        "Factory visit to learn about chocolate making process and enjoy chocolate tasting session.",
      teacherInCharge: "Nurul Aisyah",
    },
  ];

  const classes = [
    { id: "1", name: "5 Kenyala" },
    { id: "2", name: "5 Kenari" },
  ];

  const pastEvents: any[] = [
    // ... similar structure for past events
  ];

  /*
  const classes = await db.class.findMany({
    select: {
        id: true,
        name: true,
    }
  })
  */

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <EventFormDialog classes={classes} />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

        {pastEvents.length > 0 && (
          <div>
            <Separator className="my-6" />
            <h2 className="text-lg font-semibold mb-4">Past Events</h2>
            <div className="grid gap-4">
              {pastEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
