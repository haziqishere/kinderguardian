import { db } from "@/lib/db";
import { EventSchema, EventSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: EventSchemaType) => {
    try {
        const event = await db.event.create({
            data: {
                title: data.title,
                dateTime: data.dateTime,
                description: data.description,
                location: data.location,
                cost: data.cost,
                requiredItems: data.requiredItems,
                teacherInChargePhone: data.teacherInChargePhone,
                classes: {
                    create: data.classIds.map(classId => ({
                        classId
                    }))
                }
            }
        });

        return { data: event };
    } catch (error) {
        return { error: "Failed to create event." };
    }
};

export const createEvent = createSafeAction(EventSchema, handler);