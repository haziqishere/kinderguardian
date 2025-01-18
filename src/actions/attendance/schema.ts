// @/actions/attendance/schema.ts
import { z } from "zod";

export const AttendanceSchema = z.object({
    studentId: z.string().min(1, "Student ID is required"),
    date: z.date(),
    status: z.enum(["PENDING", "ON_TIME", "LATE", "ABSENT"]),
    timeRecorded: z.date()
});

export type AttendanceSchemaType = z.infer<typeof AttendanceSchema>;
