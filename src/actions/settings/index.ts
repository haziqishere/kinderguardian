"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { KindergartenSettingsSchemaType } from "./schema";

export async function getSettings(kindergartenId: string) {
  try {
    const kindergarten = await db.kindergarten.findUnique({
      where: { id: kindergartenId },
      include: {
        operatingHours: true
      }
    });

    if (!kindergarten) {
      return { error: "Kindergarten not found" };
    }

    return { data: kindergarten };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { error: "Failed to fetch settings" };
  }
}

export async function updateSettings(data: KindergartenSettingsSchemaType) {
  try {
    const kindergarten = await db.kindergarten.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        messageAlertThreshold: new Date(`1970-01-01T${data.messageAlertThreshold}`),
        callAlertThreshold: new Date(`1970-01-01T${data.callAlertThreshold}`),
        operatingHours: {
          deleteMany: {},
          create: data.operatingHours.map(oh => ({
            dayOfWeek: oh.dayOfWeek,
            startTime: new Date(`1970-01-01T${oh.startTime}`),
            endTime: new Date(`1970-01-01T${oh.endTime}`)
          }))
        }
      },
      include: {
        operatingHours: true
      }
    });

    revalidatePath(`/kindergarten/${data.id}/settings`);
    return { data: kindergarten };
  } catch (error) {
    console.error('Update error:', error);
    return { error: "Failed to update settings" };
  }
}