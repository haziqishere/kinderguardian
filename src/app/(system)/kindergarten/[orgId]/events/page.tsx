"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EventCard } from "./_components/event-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EventFormDialog } from "./_components/event-form-dialog";
import { getEvents } from "@/actions/event";
import { Event } from "@prisma/client";
import { db } from "@/lib/db";

export default function EventsPage() {
  const { orgId } = useParams();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResult, classesResult] = await Promise.all([
          getEvents(orgId as string, "ADMIN"),
          db.class.findMany({
            where: { kindergartenId: orgId as string },
            select: { id: true, name: true },
          }),
        ]);

        if (eventsResult.data) {
          const now = new Date();
          // Split events into upcoming and past
          const upcoming = eventsResult.data.filter(
            (event) => new Date(event.startDate) >= now
          );
          const past = eventsResult.data.filter(
            (event) => new Date(event.startDate) < now
          );

          setUpcomingEvents(upcoming);
          setPastEvents(past);
        }

        setClasses(classesResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
              <EventCard
                key={event.id}
                title={event.title}
                dateTime={new Date(event.startDate).toLocaleDateString()}
                location={event.location}
                cost={0}
                description={event.description}
                teacherInCharge={undefined}
              />
            ))}
          </div>
        </div>

        {pastEvents.length > 0 && (
          <div>
            <Separator className="my-6" />
            <h2 className="text-lg font-semibold mb-4">Past Events</h2>
            <div className="grid gap-4">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  dateTime={new Date(event.startDate).toLocaleDateString()}
                  location={event.location}
                  cost={0}
                  description={event.description}
                  teacherInCharge={undefined}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
