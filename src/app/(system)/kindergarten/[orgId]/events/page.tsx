// app/(system)/kindergarten/[orgId]/events/page.tsx
"use client";

import { useParams } from "next/navigation";
import { EventCard } from "./_components/event-card";
import { Calendar, Loader2, TriangleAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EventFormDialog } from "./_components/event-form-dialog";
import { Event, useClasses, useEvents } from "@/hooks/useEvents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const { orgId } = useParams();

  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents(orgId as string);

  const {
    data: classes,
    isLoading: classesLoading,
    error: classesError,
  } = useClasses(orgId as string);

  // Combined loading state
  if (eventsLoading || classesLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Events</h1>
        </div>
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span>Loading events...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combined Error State
  if (eventsError || classesError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-6 text-center text-destructive">
            <TriangleAlert className="h-8 w-8 mx-auto mb-2" />
            <p>Failed to load data. Please try again later.</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasNoEvents = !events?.upcoming.length && !events?.past.length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <EventFormDialog classes={classes || []} />
      </div>

      {hasNoEvents ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              There are no events scheduled. Create your first event to get
              started.
            </p>
            <EventFormDialog classes={classes || []} />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
            {events?.upcoming.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  No upcoming events scheduled
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events?.upcoming.map((event: Event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    dateTime={new Date(event.startDate).toLocaleDateString()}
                    location={event.location}
                    cost={0}
                    description={event.description}
                  />
                ))}
              </div>
            )}
          </div>

          {events?.past.length > 0 && (
            <div>
              <Separator className="my-6" />
              <h2 className="text-lg font-semibold mb-4">Past Events</h2>
              <div className="grid gap-4">
                {events.past.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    dateTime={new Date(event.startDate).toLocaleDateString()}
                    location={event.location}
                    cost={0}
                    description={event.description}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
