// actions/kindergarten/setup.ts
"use server"

import { db } from "@/lib/db";
import { z } from "zod";
import { createSafeAction } from "@/lib/create-safe-action";
import { DayOfWeek } from "@prisma/client"; // Add this import

const SetupSchema = z.object({
  adminId: z.string(),
  name: z.string().min(1),
  address: z.string().min(1),
  operatingHours: z.array(z.object({
    dayOfWeek: z.nativeEnum(DayOfWeek), // Update this to use the Prisma enum
    isOpen: z.boolean(),
    startTime: z.string(),
    endTime: z.string()
  })),
  messageAlertThreshold: z.string(),
  callAlertThreshold: z.string()
});

const handler = async (data: z.infer<typeof SetupSchema>) => {
  try {
    // Create kindergarten with all settings
    const kindergarten = await db.kindergarten.create({
      data: {
        name: data.name,
        address: data.address,
        messageAlertThreshold: new Date(`1970-01-01T${data.messageAlertThreshold}`),
        callAlertThreshold: new Date(`1970-01-01T${data.callAlertThreshold}`),
        operatingHours: {
          create: data.operatingHours
            .filter(oh => oh.isOpen)
            .map(oh => ({
              dayOfWeek: oh.dayOfWeek as DayOfWeek, // Ensure correct type
              startTime: new Date(`1970-01-01T${oh.startTime}`),
              endTime: new Date(`1970-01-01T${oh.endTime}`)
            }))
        }
      }
    });

    // Update admin with kindergarten
    await db.admin.update({
      where: { id: data.adminId },
      data: {
        kindergartenId: kindergarten.id,
        role: "SUPER_ADMIN"
      }
    });

    return { data: kindergarten };
  } catch (error) {
    console.error("[SETUP_ERROR]", error);
    return { error: "Failed to complete setup" };
  }
};

export const completeSetup = createSafeAction(SetupSchema, handler);