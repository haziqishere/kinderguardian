// actions/kindergarten/index.ts
"use server";

import { db } from "@/lib/db";
import { 
  KindergartenSettingsSchema, 
  KindergartenSettingsSchemaType,
  KindergartenCreateSchema,
  KindergartenJoinSchema
} from "./schema";
import { SetupSchema } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

// Keep existing getKindergarten handler
const getKindergartenHandler = async (id: string) => {
  try {
    const kindergarten = await db.kindergarten.findUnique({
      where: { id },
      include: {
        operatingHours: {
          orderBy: {
            dayOfWeek: 'asc'
          }
        }
      }
    });

    if (!kindergarten) {
      return { error: "Kindergarten not found" };
    }

    return { data: kindergarten };
  } catch (error) {
    return { error: "Failed to fetch kindergarten details" };
  }
};

const updateKindergartenHandler = async (data: KindergartenSettingsSchemaType) => {
  try {
    const updatedKindergarten = await db.kindergarten.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        messageAlertThreshold: new Date(`1970-01-01T${data.messageAlertThreshold}`),
        callAlertThreshold: new Date(`1970-01-01T${data.callAlertThreshold}`),
      },
    });

    await db.operatingHours.deleteMany({
      where: { kindergartenId: data.id }
    });

    await db.operatingHours.createMany({
      data: data.operatingHours.map(oh => ({
        kindergartenId: data.id,
        dayOfWeek: oh.dayOfWeek,
        startTime: new Date(`1970-01-01T${oh.startTime}`),
        endTime: new Date(`1970-01-01T${oh.endTime}`)
      }))
    });

    return { data: updatedKindergarten };
  } catch (error) {
    console.error("Update error:", error);
    return { error: "Failed to update kindergarten settings" };
  }
};

const completeSetupHandler = async (data: z.infer<typeof SetupSchema>) => {
  try {
    const { adminId, ...kindergartenData } = data;
    
    // Start a transaction to ensure all operation succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create kindergarten
      const kindergarten = await db.kindergarten.create({
        data: {
          name: kindergartenData.name,
          address: kindergartenData.address,
          messageAlertThreshold: new Date(`1970-01-01T${kindergartenData.messageAlertThreshold}`),
          callAlertThreshold: new Date(`1970-01-01T${kindergartenData.callAlertThreshold}`),
          operatingHours: {
            create: kindergartenData.operatingHours.map((oh: { dayOfWeek: DayOfWeek; startTime: string; endTime: string }) => ({
              dayOfWeek: oh.dayOfWeek,
              startTime: new Date(`1970-01-01T${oh.startTime}`),
              endTime: new Date(`1970-01-01T${oh.endTime}`)
            }))
          }
        }
      });

      await db.admin.update({
        where: { id: adminId },
        data: {
          kindergartenId: kindergarten.id,
          role: "SUPER_ADMIN"
        }
      });

      return { data: kindergarten };
    });

    return result;
  } catch (error) {
    return { error: "Failed to complete setup" };
  }
};

const getAvailableKindergartensHandler = async () => {
  try {
    const kindergartens = await db.kindergarten.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        _count: {
          select: {
            classes: true,
            admins: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return { data: kindergartens };
  } catch (error) {
    console.error("[GET_KINDERGARTENS]", error);
    return { error: "Failed to fetch kindergartens" };
  }
};

const joinKindergartenHandler = async (data: z.infer<typeof KindergartenJoinSchema>) => {
  try {
    const admin = await db.admin.findUnique({
      where: { id: data.adminId },
      include: { kindergarten: true }
    });

    if (admin?.kindergartenId) {
      return { error: "Admin is already associated with a kindergarten" };
    }

    const updatedAdmin = await db.admin.update({
      where: { id: data.adminId },
      data: {
        kindergartenId: data.kindergartenId,
        role: "ADMIN"
      },
      include: {
        kindergarten: true
      }
    });

    return { data: updatedAdmin };
  } catch (error) {
    console.error("[JOIN_KINDERGARTEN_ERROR]", error);
    return { error: "Failed to join kindergarten" };
  }
};

// Exports with proper schema types
export const getKindergarten = getKindergartenHandler;
export const getAvailableKindergartens = getAvailableKindergartensHandler;
export const updateKindergarten = createSafeAction(KindergartenSettingsSchema, updateKindergartenHandler);
export const completeSetup = createSafeAction(
  KindergartenCreateSchema.extend({ adminId: z.string() }),
  completeSetupHandler
);
export const joinKindergarten = createSafeAction(KindergartenJoinSchema, joinKindergartenHandler);