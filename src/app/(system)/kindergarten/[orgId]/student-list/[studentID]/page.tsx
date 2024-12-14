// src/app/kindergarten/[orgId]/student-list/[studentId]/page.tsx
import { StudentProfile } from "./_components/student-profile";
import { AttendanceStatus, AlertType, ParentAction } from "@prisma/client";

interface StudentPageProps {
  params: {
    studentId: string;
  };
}

// async function getStudent(studentId: string) {
//   const student = await db.student.findUnique({
//     where: {
//       id: studentId,
//     },
//     include: {
//       class: true,
//       attendance: {
//         orderBy: {
//           date: 'desc'
//         },
//         take: 10,
//       },
//       alertLogs: {
//         orderBy: {
//           alertTime: 'desc'
//         },
//         take: 5,
//       },
//     },
//   });

//   if (!student) {
//     notFound();
//   }

//   return student;
// }

// Dummy data
const dummyStudent = {
  id: "1",
  fullName: "Muhammad Adam bin Idris",
  age: 5,
  class: {
    id: "1",
    name: "5 Kenyala",
  },
  daysAbsent: 2,
  faceImageFront: null,
  faceImageLeft: null,
  faceImageRight: null,
  faceImageTiltUp: null,
  faceImageTiltDown: null,
  attendance: [
    {
      id: "1",
      date: new Date("2024-03-14"),
      status: "ON_TIME" as AttendanceStatus,
      timeRecorded: new Date("2024-03-14T07:45:00"),
    },
    {
      id: "2",
      date: new Date("2024-03-13"),
      status: "LATE" as AttendanceStatus,
      timeRecorded: new Date("2024-03-13T08:15:00"),
    },
    {
      id: "3",
      date: new Date("2024-03-12"),
      status: "ABSENT" as AttendanceStatus,
      timeRecorded: new Date("2024-03-12T09:00:00"),
    },
    {
      id: "4",
      date: new Date("2024-03-11"),
      status: "ON_TIME" as AttendanceStatus,
      timeRecorded: new Date("2024-03-11T07:50:00"),
    },
    {
      id: "5",
      date: new Date("2024-03-10"),
      status: "ON_TIME" as AttendanceStatus,
      timeRecorded: new Date("2024-03-10T07:55:00"),
    },
  ],
  alertLogs: [
    {
      id: "1",
      alertTime: new Date("2024-03-12T08:30:00"),
      alertType: "MESSAGED" as AlertType,
      parentAction: "RESPONDED" as ParentAction,
      reason: "Sick",
      phoneNumberContacted: "0123456789",
    },
    {
      id: "2",
      alertTime: new Date("2024-02-15T08:45:00"),
      alertType: "CALLED" as AlertType,
      parentAction: "RESPONDED" as ParentAction,
      reason: "Family emergency",
      phoneNumberContacted: "0123456789",
    },
    {
      id: "3",
      alertTime: new Date("2024-02-01T09:00:00"),
      alertType: "MESSAGED" as AlertType,
      parentAction: "NO_RESPONSE" as ParentAction,
      reason: null,
      phoneNumberContacted: "0123456789",
    },
  ],
};

export default async function StudentPage({ params }: StudentPageProps) {
  // const student = await getStudent(params.studentId);
  const student = dummyStudent; // Using dummy data

  return (
    <div className="p-6 space-y-6">
      <StudentProfile student={student} />
    </div>
  );
}
