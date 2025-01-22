// src/lib/scheduler/attendance-check.ts
import { db } from "@/lib/db";
import { DayOfWeek, AttendanceStatus, ParentAction, AlertType } from "@prisma/client";
import { format, parse, isWithinInterval } from "date-fns";

async function isHoliday(kindergartenId: string, date: Date) {
  const holiday = await db.holiday.findFirst({
    where: {
      kindergartenId,
      AND: [
        { startDate: { lte: date } },
        { endDate: { gte: date } }
      ]
    }
  });
  return !!holiday;
}

function isWithinOperatingHours(operatingHours: any, currentTime: Date): boolean {
  const startTime = parse(format(operatingHours.startTime, 'HH:mm:ss'), 'HH:mm:ss', new Date());
  const endTime = parse(format(operatingHours.endTime, 'HH:mm:ss'), 'HH:mm:ss', new Date());
  
  const timeToCheck = parse(format(currentTime, 'HH:mm:ss'), 'HH:mm:ss', new Date());
  
  return isWithinInterval(timeToCheck, { start: startTime, end: endTime });
}

export class AttendanceScheduler {
  static async checkAttendance() {
    try {
      const now = new Date();
      const currentDay = format(now, 'EEEE').toUpperCase() as DayOfWeek;
      
      // Fetch all active kindergartens
      const kindergartens = await db.kindergarten.findMany({
        include: {
          operatingHours: true,
          classes: {
            include: {
              students: {
                include: {
                  attendance: {
                    where: { date: now }
                  },
                  alertLogs: {
                    where: {
                      alertTime: {
                        gte: new Date(now.setHours(0, 0, 0, 0))
                      }
                    },
                    orderBy: { alertTime: 'desc' }
                  }
                }
              }
            }
          }
        }
      });

      for (const kindergarten of kindergartens) {
        // Skip if holiday
        const holidayToday = await isHoliday(kindergarten.id, now);
        if (holidayToday) {
          console.log(`Skipping ${kindergarten.name} - Holiday`);
          continue;
        }

        // Get today's operating hours
        const todayOperatingHours = kindergarten.operatingHours.find(
          oh => oh.dayOfWeek === currentDay
        );

        if (!todayOperatingHours) {
          console.log(`Skipping ${kindergarten.name} - Not operating today`);
          continue;
        }

        // Check if within operating hours
        const isOperating = await isWithinOperatingHours(todayOperatingHours, now);
        if (!isOperating) {
          console.log(`Skipping ${kindergarten.name} - Outside operating hours`);
          continue;
        }

        // Get message and call thresholds
        const messageThreshold = parse(
          format(kindergarten.messageAlertThreshold, 'HH:mm:ss'),
          'HH:mm:ss',
          now
        );
        const callThreshold = parse(
          format(kindergarten.callAlertThreshold, 'HH:mm:ss'),
          'HH:mm:ss',
          now
        );

        // Process students
        for (const class_ of kindergarten.classes) {
          for (const student of class_.students) {
            // Skip if already marked present today
            if (student.attendance.some(a => 
              ([AttendanceStatus.ON_TIME, AttendanceStatus.LATE] as AttendanceStatus[]).includes(a.status)
            )) {
              console.log(`Skipping ${student.fullName} - Already marked present`);
              continue;
            }

            // Skip if already marked as absent
            if (student.attendance.some(a => a.status === AttendanceStatus.ABSENT)) {
              console.log(`Skipping ${student.fullName} - Already marked absent`);
              continue;
            }

            const lastAlert = student.alertLogs[0];
            const currentTime = parse(format(now, 'HH:mm:ss'), 'HH:mm:ss', now);

            // Skip if parent has already responded to an alert today
            if (lastAlert?.parentAction === ParentAction.RESPONDED) {
              console.log(`Skipping ${student.fullName} - Parent already responded`);
              continue;
            }

            // Send first alert (message)
            if (currentTime >= messageThreshold && (!lastAlert || lastAlert.alertType !== AlertType.MESSAGED)) {
              console.log(`Sending message alert for ${student.fullName}`);
              await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/test/emailAlert?studentId=${student.id}&type=message`
              );
              
              // Create alert log
              await db.alertLog.create({
                data: {
                  studentId: student.id,
                  alertTime: now,
                  alertType: AlertType.MESSAGED,
                  parentAction: ParentAction.NO_RESPONSE,
                  reason: "Student not present by message threshold"
                }
              });
              continue;
            }

            // Send second alert (call)
            if (currentTime >= callThreshold && 
                lastAlert?.alertType === AlertType.MESSAGED && 
                !student.alertLogs.some(log => log.alertType === AlertType.CALLED)) {
              console.log(`Sending call alert for ${student.fullName}`);
              await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/test/emailAlert?studentId=${student.id}&type=call`
              );
              
              // Create alert log
              await db.alertLog.create({
                data: {
                  studentId: student.id,
                  alertTime: now,
                  alertType: AlertType.CALLED,
                  parentAction: ParentAction.NO_RESPONSE,
                  reason: "Student not present by call threshold"
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Attendance check error:", error);
      // Log to monitoring service if available
    }
  }
}