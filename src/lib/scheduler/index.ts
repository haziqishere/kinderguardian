// src/lib/scheduler/index.ts
import { CronJob } from "cron";
import { AttendanceScheduler } from "./attendance-checker";

export function initializeScheduler() {
  // Run every 5 minutes during working hours (6 AM - 6 PM)
  const attendanceJob = new CronJob(
    "*/5 6-18 * * *",
    () => {
      AttendanceScheduler.checkAttendance();
    },
    null,
    false,
    "Asia/Kuala_Lumpur"
  );

  attendanceJob.start();
}