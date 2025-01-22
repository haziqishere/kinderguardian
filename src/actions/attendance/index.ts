"use server";

import { db } from "@/lib/db";
import { AttendanceSchema, AttendanceSchemaType } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: AttendanceSchemaType) => {
    try {
        const attendance = await db.attendance.create({
            data: {
                studentId: data.studentId,
                date: data.date,
                status: data.status,
                timeRecorded: data.timeRecorded
            }
        });

        return { data: attendance };
    } catch (_error) {
        return { error: "Failed to create attendance record." };
    }
};

export const createAttendance = createSafeAction(AttendanceSchema, handler);