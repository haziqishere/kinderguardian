// @/actions/attendance/schema.ts
import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

export const AttendanceSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    date: z.date(),
    status: z.enum([
        AttendanceStatus.PENDING,
        AttendanceStatus.ON_TIME,
        AttendanceStatus.LATE,
        AttendanceStatus.ABSENT
    ]),
    timeRecorded: z.date()
});

export type AttendanceSchemaType = z.infer<typeof AttendanceSchema>;
