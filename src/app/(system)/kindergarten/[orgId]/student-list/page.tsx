import { StudentList } from "./_components/student-list";

export default function StudentListPage() {
  // Sample data - replace with actual data fetching
  const students = [
    {
      id: "1",
      name: "Muhammad Adam bin Idris",
      age: 5,
      class: "5 Kenyala",
      daysAbsent: 2,
      attendancePerformance: "98.5%",
    },
    {
      id: "2",
      name: "Anis Munirah binti Megat",
      age: 5,
      class: "5 Kenari",
      daysAbsent: 1,
      attendancePerformance: "99.2%",
    },
    // Add more sample data...
  ];

  return (
    <div className="p-6">
      <StudentList students={students} />
    </div>
  );
}
