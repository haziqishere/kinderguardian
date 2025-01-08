// src/app/(dashboard)/parent/_lib/dummy-data.ts

import { AttendanceStatus, AlertType, ParentAction } from "@prisma/client";

export type DummyChildData = {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
  stats: {
    lateCount: number;
    attendanceRate: string;
    absentNoReason: number;
  };
  attendance: {
    id: string;
    date: string;
    status: AttendanceStatus;
    timeRecorded: string;
  }[];
  alerts: {
    id: string;
    alertTime: string;
    alertType: AlertType;
    parentAction: ParentAction;
    reason: string | null;
    phoneNumberContacted: string;
  }[];
};

export const dummyChildren: DummyChildData[] = [
  {
    id: "1",
    name: "Haris Azhari bin Zaharudin",
    class: {
      id: "c1",
      name: "5 Kenyala"
    },
    stats: {
      lateCount: 4,
      attendanceRate: "93%",
      absentNoReason: 1
    },
    attendance: [
      {
        id: "a1",
        date: "2024-01-01",
        status: "ON_TIME",
        timeRecorded: "2024-01-01T07:45:00Z"
      },
      {
        id: "a2",
        date: "2024-01-02",
        status: "LATE",
        timeRecorded: "2024-01-02T08:15:00Z"
      },
      // Add more attendance records...
    ],
    alerts: [
      {
        id: "al1",
        alertTime: "2024-01-02T08:30:00Z",
        alertType: "MESSAGED",
        parentAction: "RESPONDED",
        reason: "Traffic jam",
        phoneNumberContacted: "+60123456789"
      },
      // Add more alerts...
    ]
  },
  {
    id: "2",
    name: "Sarah Azhari",
    class: {
      id: "c2",
      name: "4 Mentari"
    },
    stats: {
      lateCount: 2,
      attendanceRate: "95%",
      absentNoReason: 0
    },
    attendance: [
      {
        id: "a3",
        date: "2024-01-01",
        status: "ON_TIME",
        timeRecorded: "2024-01-01T07:40:00Z"
      },
      // Add more attendance records...
    ],
    alerts: [
      {
        id: "al2",
        alertTime: "2024-01-03T08:30:00Z",
        alertType: "MESSAGED",
        parentAction: "RESPONDED",
        reason: "Doctor appointment",
        phoneNumberContacted: "+60123456788"
      },
      // Add more alerts...
    ]
  }
];

export const dummyEvents = [
  {
    id: "e1",
    title: "Petrosains KLCC Visit",
    dateTime: "2024-03-30T09:00:00Z",
    description: "Educational visit to Petrosains Discovery Centre...",
    location: "KLCC, Kuala Lumpur",
    cost: 45.0,
    teacherInChargeName: "Sarah Madiyah",
    teacherInChargePhone: "+60123456787",
    classIds: ["c1", "c2"]
  },
  {
    id: "e2",
    title: "Beryl's Chocolate Factory Visit",
    dateTime: "2024-08-08T09:00:00Z",
    description: "Factory visit to learn about chocolate making process...",
    location: "Beryl's Chocolate Factory",
    cost: 35.0,
    teacherInChargeName: "Nurul Aisyah",
    teacherInChargePhone: "+60123456786",
    classIds: ["c1"]
  }
];