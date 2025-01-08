// src/actions/parent/get-children.ts
import { db } from "@/lib/db";

export type ChildData = {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
  attendance: Array<{
    date: Date;
    status: string;
    timeRecorded: Date;
  }>;
  alertLogs: Array<{
    id: string;
    alertTime: Date;
    alertType: string;
    parentAction: string;
    reason: string | null;
  }>;
};

export async function getChildrenData(parentId: string) {
  try {
    const children = await db.student.findMany({
      where: { parentId },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        attendance: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 180)) // Last 6 months
            }
          },
          orderBy: {
            date: 'desc'
          }
        },
        alertLogs: {
          orderBy: {
            alertTime: 'desc'
          },
          take: 10 // Last 10 alerts
        }
      }
    });

    return { data: children };
  } catch (error) {
    return { error: "Failed to fetch children data" };
  }
}