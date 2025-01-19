import { db } from "@/lib/db";

export async function getStudents(kindergartenId: string) {
  try {
    const students = await db.student.findMany({
      where: {
        class: {
          kindergartenId: kindergartenId,
        },
      },
      include: {
        class: true,
        attendance: {
          orderBy: {
            date: 'desc',
          },
          take: 30, // Last 30 days
        },
      },
    });

    // Transform the data to match the Student interface
    const formattedStudents = students.map((student) => {
      // Calculate days absent
      const daysAbsent = student.attendance.filter(
        (a) => a.status === "ABSENT"
      ).length;

      // Calculate attendance performance
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(
        (a) => a.status === "ON_TIME" || a.status === "LATE"
      ).length;
      const attendanceRate = totalDays > 0
        ? ((presentDays / totalDays) * 100).toFixed(1) + "%"
        : "N/A";

      return {
        id: student.id,
        name: student.fullName,
        age: student.age,
        class: student.class?.name || "Unassigned",
        daysAbsent,
        attendancePerformance: attendanceRate,
      };
    });

    return {
      data: formattedStudents,
    };
  } catch (error) {
    console.error("[GET_STUDENTS]", error);
    return {
      error: "Failed to fetch students",
    };
  }
} 