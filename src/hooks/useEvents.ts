// hooks/useEvents.ts
import { EventSchemaType } from "@/actions/event/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "@prisma/client";

interface Class {
  id: string;
  name: string;
  capacity: number;
  _count: {
    students: number;
  }
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date | string;
  location: string;
  targetAudience: UserType[];
  classes: {
    class: {
      id: string;
      name: string;
    }
  }[];
}

export interface EventsData {
  upcoming: Event[];
  past: Event[];
}

// Add this new hook for creating events
export function useCreateEvent(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EventSchemaType) => {
      const response = await fetch(`/api/kindergarten/${orgId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate events query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useEvents(kindergartenId: string) {
  return useQuery<EventsData>({
    queryKey: ['events', kindergartenId],
    queryFn: async () => {
      if (!kindergartenId) {
        throw new Error('Kindergarten ID is required');
      }
      
      console.log("Fetching events for kindergarten:", kindergartenId);
      
      const response = await fetch(`/api/kindergarten/${kindergartenId}/events`);
      if (!response.ok) {
        console.error("Failed to fetch events:", await response.text());
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      console.log("Raw events data:", data);
      
      const now = new Date();
      const events = data.data || [];
      
      // Sort into upcoming and past events
      const sorted = {
        upcoming: events.filter((e: Event) => {
          const eventDate = new Date(e.startDate);
          console.log(`Event ${e.title}:`, {
            date: eventDate,
            isUpcoming: eventDate >= now
          });
          return eventDate >= now;
        }),
        past: events.filter((e: Event) => new Date(e.startDate) < now)
      };

      console.log("Sorted events:", sorted);
      return sorted;
    },
    // Disable the query if we don't have a kindergartenId
    enabled: Boolean(kindergartenId),
    staleTime: 1000 * 60, // Cache for 1 minute
  });
}

export function useClasses(kindergartenId: string) {
  return useQuery({
    queryKey: ['classes', kindergartenId],
    queryFn: async () => {
      const response = await fetch(`/api/kindergarten/${kindergartenId}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      
      const data = await response.json();
      return data.data;
    }
  });
}

export function useChildEvents(childId: string) {
  return useQuery<EventsData>({
    queryKey: ['events', childId],
    queryFn: async () => {
      if (!childId) return { upcoming: [], past: [] };
      
      const response = await fetch(`/api/parent/children/${childId}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      const now = new Date();
      const events = data.data || [];
      
      return {
        upcoming: events.filter((e: Event) => new Date(e.startDate) >= now),
        past: events.filter((e: Event) => new Date(e.startDate) < now)
      };
    },
    enabled: Boolean(childId)
  });
}