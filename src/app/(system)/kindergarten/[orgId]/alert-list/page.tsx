import { AlertList } from "../_components/alert-list";

export default async function AlertListPage() {
  const respondedData = [
    {
      id: "1",
      name: "Haris Azhari bin Zaharudin",
      class: "5 Kenyala",
      attendancePerformance: "99.5%",
      parentAction: "Responded" as const,
      alertStatus: "Messaged" as const,
      reason: "Sick",
    },
    {
      id: "2",
      name: "Irfan bin Abdul Ghafar",
      class: "4 Mentari",
      attendancePerformance: "99.5%",
      parentAction: "Responded" as const,
      alertStatus: "Messaged" as const,
      reason: "Going back to hometown",
    },
  ];

  const awaitingData = [
    {
      id: "3",
      name: "Muhammad Hakim bin Zulkhainan",
      class: "5 Kenari",
      attendancePerformance: "99.5%",
      parentAction: "No Response" as const,
      alertStatus: "Called" as const,
    },
    {
      id: "4",
      name: "Nandaprian Rajasekaran",
      class: "5 Kenanga",
      attendancePerformance: "99.5%",
      parentAction: "No Response" as const,
      alertStatus: "Called" as const,
    },
  ];

  return (
    <AlertList respondedData={respondedData} awaitingData={awaitingData} />
  );
}
