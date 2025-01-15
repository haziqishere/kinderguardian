import { db } from "@/lib/db";
import { EventSchema, EventSchemaType, EventWithAttendeesSchema } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

// Get all events for a kindergarten
export const getEvents = async (kindergartenId: string, userType: string) => {
  try {
    const events = await db.event.findMany({
      where: {
        kindergartenId,
        OR: [
          { targetAudience: { has: userType } },
          { targetAudience: { has: "ALL" } }
        ],
        endDate: {
          gte: new Date() // Only show current and future events
        }
      },
      include: {
        attendees: true
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return { data: events };
  } catch (error) {
    console.error("[GET_EVENTS]", error);
    return { error: "Failed to fetch events" };
  }
};

// Get upcoming events
export const getUpcomingEvents = async (kindergartenId: string, userType: string, limit = 5) => {
  try {
    const events = await db.event.findMany({
      where: {
        kindergartenId,
        OR: [
          { targetAudience: { has: userType } },
          { targetAudience: { has: "ALL" } }
        ],
        startDate: {
          gte: new Date()
        }
      },
      include: {
        attendees: true
      },
      orderBy: {
        startDate: 'asc'
      },
      take: limit
    });

    return { data: events };
  } catch (error) {
    console.error("[GET_UPCOMING_EVENTS]", error);
    return { error: "Failed to fetch upcoming events" };
  }
};

// Create an event
const createEventHandler = async (data: EventSchemaType) => {
  try {
    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        type: data.type,
        kindergartenId: data.kindergartenId,
        targetAudience: data.targetAudience,
        isAllDay: data.isAllDay,
      }
    });

    return { data: event };
  } catch (error) {
    console.error("[CREATE_EVENT]", error);
    return { error: "Failed to create event" };
  }
};

// Update an event
const updateEventHandler = async (data: EventSchemaType & { id: string }) => {
  try {
    const event = await db.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        type: data.type,
        targetAudience: data.targetAudience,
        isAllDay: data.isAllDay,
      }
    });

    return { data: event };
  } catch (error) {
    console.error("[UPDATE_EVENT]", error);
    return { error: "Failed to update event" };
  }
};

// Delete an event
export const deleteEvent = async (eventId: string) => {
  try {
    await db.event.delete({
      where: { id: eventId }
    });

    return { data: { success: true } };
  } catch (error) {
    console.error("[DELETE_EVENT]", error);
    return { error: "Failed to delete event" };
  }
};

// Update attendee status
export const updateAttendeeStatus = async (
  eventId: string,
  attendeeId: string,
  status: "PENDING" | "ACCEPTED" | "DECLINED"
) => {
  try {
    const attendee = await db.attendee.update({
      where: { 
        id: attendeeId,
        eventId: eventId
      },
      data: { status }
    });

    return { data: attendee };
  } catch (error) {
    console.error("[UPDATE_ATTENDEE_STATUS]", error);
    return { error: "Failed to update attendee status" };
  }
};

// Add attendees to an event
export const addEventAttendees = async (
  eventId: string,
  attendees: { name: string; type: string }[]
) => {
  try {
    const event = await db.event.update({
      where: { id: eventId },
      data: {
        attendees: {
          createMany: {
            data: attendees.map(attendee => ({
              name: attendee.name,
              type: attendee.type as any,
              status: "PENDING"
            }))
          }
        }
      },
      include: {
        attendees: true
      }
    });

    return { data: event };
  } catch (error) {
    console.error("[ADD_EVENT_ATTENDEES]", error);
    return { error: "Failed to add attendees" };
  }
};

export const createEvent = createSafeAction(EventSchema, createEventHandler);
export const updateEvent = createSafeAction(
  EventSchema.extend({ id: z.string() }),
  updateEventHandler
);