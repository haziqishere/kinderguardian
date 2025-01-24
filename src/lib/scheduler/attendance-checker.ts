// src/lib/scheduler/attendance-check.ts
import { db } from "@/lib/db";
import { DayOfWeek, AttendanceStatus, AlertType } from "@prisma/client";
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
  // Convert operating hours to today's date for proper comparison
  const today = new Date(currentTime);
  
  const startTime = parse(
    format(operatingHours.startTime, 'HH:mm:ss'),
    'HH:mm:ss',
    today
  );
  
  const endTime = parse(
    format(operatingHours.endTime, 'HH:mm:ss'),
    'HH:mm:ss',
    today
  );
  
  // For debugging
  console.log('Current time:', format(currentTime, 'HH:mm:ss'));
  console.log('Start time:', format(startTime, 'HH:mm:ss'));
  console.log('End time:', format(endTime, 'HH:mm:ss'));
  
  return isWithinInterval(currentTime, { start: startTime, end: endTime });
}

export class AttendanceScheduler {
  // Morning initialization of attendance records
  static async initializeDailyAttendance() {
    try {
      const now = new Date()
      const currentDay = format(now, 'EEEE').toUpperCase() as DayOfWeek
      
      const kindergartens = await db.kindergarten.findMany({
        include: {
          operatingHours: true,
          classes: {
            include: {
              students: true
            }
          }
        }
      })

      for (const kindergarten of kindergartens) {
        // Skip if holiday
        const holidayToday = await isHoliday(kindergarten.id, now)
        if (holidayToday) continue

        // Skip if not operating today
        const todayOperatingHours = kindergarten.operatingHours.find(
          oh => oh.dayOfWeek === currentDay
        )
        if (!todayOperatingHours) continue

        // Create or update PENDING attendance records for all students
        for (const class_ of kindergarten.classes) {
          for (const student of class_.students) {
            const today = new Date(now)
            today.setHours(0, 0, 0, 0)

            await db.attendance.upsert({
              where: {
                studentId_date: {
                  studentId: student.id,
                  date: today
                }
              },
              create: {
                studentId: student.id,
                date: today,
                status: AttendanceStatus.PENDING,
                timeRecorded: now
              },
              update: {
                // Only update if status is not already set
                status: {
                  set: AttendanceStatus.PENDING
                },
                timeRecorded: now
              }
            })
          }
        }
      }
    } catch (error) {
      console.error("Initialize attendance error:", error)
      throw error
    }
  }

  // End of day attendance finalization
  static async finalizeAttendance() {
    try {
      const now = new Date()
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)

      // Get all PENDING attendance records for today
      const pendingAttendance = await db.attendance.findMany({
        where: {
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          },
          status: AttendanceStatus.PENDING
        },
        include: {
          student: {
            include: {
              class: {
                include: {
                  kindergarten: true
                }
              }
            }
          }
        }
      })

      // Update all PENDING to ABSENT
      const updates = pendingAttendance.map(attendance =>
        db.attendance.update({
          where: { id: attendance.id },
          data: {
            status: AttendanceStatus.ABSENT,
            timeRecorded: now
          }
        })
      )

      // Also increment daysAbsent counter for these students
      const studentUpdates = pendingAttendance.map(attendance =>
        db.student.update({
          where: { id: attendance.studentId },
          data: {
            daysAbsent: {
              increment: 1
            }
          }
        })
      )

      await db.$transaction([...updates, ...studentUpdates])

      console.log(`Marked ${updates.length} students as absent`)
      return { success: true, absentCount: updates.length }
    } catch (error) {
      console.error("Finalize attendance error:", error)
      throw error
    }
  }

  // Modified checkAttendance to only alert for PENDING status
  static async checkAttendance() {
    try {
      const now = new Date();
      const currentDay = format(now, 'EEEE').toUpperCase() as DayOfWeek;
      
      console.log('Starting attendance check at:', format(now, 'HH:mm:ss'));
      console.log('Current day:', currentDay);
      
      const kindergartens = await db.kindergarten.findMany({
        include: {
          operatingHours: true,
          classes: {
            include: {
              students: {
                include: {
                  attendance: {
                    where: {
                      date: {
                        equals: new Date(now.setHours(0, 0, 0, 0))
                      }
                    }
                  },
                  alertLogs: {
                    where: {
                      alertTime: {
                        gte: new Date(now.setHours(0, 0, 0, 0))
                      }
                    },
                    orderBy: {
                      alertTime: 'desc'
                    }
                  }
                }
              }
            }
          }
        }
      });

      for (const kindergarten of kindergartens) {
        console.log(`\nProcessing kindergarten: ${kindergarten.name}`);
        
        // Get message and call thresholds
        const messageThreshold = parse(
          format(kindergarten.messageAlertThreshold, 'HH:mm:ss'),
          'HH:mm:ss',
          now
        );
        
        console.log('Message threshold:', format(messageThreshold, 'HH:mm:ss'));
        console.log('Current time:', format(now, 'HH:mm:ss'));
        console.log('Is past threshold:', now >= messageThreshold);

        // Process students
        for (const class_ of kindergarten.classes) {
          console.log(`\nChecking class: ${class_.name}`);
          
          for (const student of class_.students) {
            console.log(`\nStudent: ${student.fullName}`);
            
            // Only check students with PENDING status
            const todayAttendance = student.attendance.find(a => 
              a.status === AttendanceStatus.PENDING
            );
            
            if (!todayAttendance) {
              console.log('No PENDING attendance found - skipping');
              continue;
            }
            
            console.log('Attendance status:', todayAttendance.status);
            
            const lastAlert = student.alertLogs[0];
            console.log('Last alert:', lastAlert ? format(lastAlert.alertTime, 'HH:mm:ss') : 'None');

            // Send alerts only for PENDING status
            if (now >= messageThreshold && !lastAlert) {
              console.log('Sending message alert...');
              await fetch(
                `${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/send`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    studentId: student.id,
                    type: AlertType.EMAIL
                  })
                }
              );
              console.log('Alert sent successfully');
            } else {
              console.log('Skipping alert:', {
                isPastThreshold: now >= messageThreshold,
                hasNoPreviousAlert: !lastAlert
              });
            }
          }
        }
      }
      
      console.log('\nAttendance check completed');
    } catch (error) {
      console.error("Attendance check error:", error);
    }
  }
}