import { db } from "@/lib/db";
import { AlertSchema, AlertSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { UserType } from "@prisma/client";

// Get all alerts for a kindergarten
export const getAlerts = async (kindergartenId: string, userType: UserType) => {
  try {
    const alerts = await db.alert.findMany({
      where: {
        kindergartenId,
        AND: [
          {
            OR: [
              { targetUserType: userType },
              { targetUserType: "ALL" }
            ]
          },
          {
            OR: [
              { expiresAt: { gt: new Date() } },
              { expiresAt: null }
            ]
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { data: alerts };
  } catch (error) {
    console.error("[GET_ALERTS]", error);
    return { error: "Failed to fetch alerts" };
  }
};

// Create an alert
const createAlertHandler = async (data: AlertSchemaType) => {
  try {
    const alert = await db.alert.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        kindergartenId: data.kindergartenId,
        targetUserType: data.targetUserType,
        expiresAt: data.expiresAt,
      }
    });

    return { data: alert };
  } catch (error) {
    console.error("[CREATE_ALERT]", error);
    return { error: "Failed to create alert" };
  }
};

// Mark alert as read
export const markAlertAsRead = async (alertId: string) => {
  try {
    const alert = await db.alert.update({
      where: { id: alertId },
      data: { isRead: true }
    });

    return { data: alert };
  } catch (error) {
    console.error("[MARK_ALERT_READ]", error);
    return { error: "Failed to mark alert as read" };
  }
};

// Delete an alert
export const deleteAlert = async (alertId: string) => {
  try {
    await db.alert.delete({
      where: { id: alertId }
    });

    return { data: { success: true } };
  } catch (error) {
    console.error("[DELETE_ALERT]", error);
    return { error: "Failed to delete alert" };
  }
};

// Get unread alerts count
export const getUnreadAlertsCount = async (kindergartenId: string, userType: UserType) => {
  try {
    const count = await db.alert.count({
      where: {
        kindergartenId,
        isRead: false,
        AND: [
          {
            OR: [
              { targetUserType: userType },
              { targetUserType: "ALL" }
            ]
          },
          {
            OR: [
              { expiresAt: { gt: new Date() } },
              { expiresAt: null }
            ]
          }
        ]
      }
    });

    return { data: count };
  } catch (error) {
    console.error("[GET_UNREAD_ALERTS_COUNT]", error);
    return { error: "Failed to get unread alerts count" };
  }
};

export const createAlert = createSafeAction(AlertSchema, createAlertHandler); 