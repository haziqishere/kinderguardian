import { db } from "@/lib/db";
import { KindergartenSettingsSchema, KindergartenSettingsSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

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
    // Update kindergarten basic info
    const updatedKindergarten = await db.kindergarten.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        messageAlertThreshold: new Date(`1970-01-01T${data.messageAlertThreshold}`),
        callAlertThreshold: new Date(`1970-01-01T${data.callAlertThreshold}`),
      },
    });

    // Delete existing operating hours
    await db.operatingHours.deleteMany({
      where: { kindergartenId: data.id }
    });

    // Create new operating hours
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

export const getKindergarten = getKindergartenHandler;
export const updateKindergarten = createSafeAction(
  KindergartenSettingsSchema,
  updateKindergartenHandler
); 