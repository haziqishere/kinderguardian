import { DashboardStats } from "./_components/dashboard-stats";
import { ArrivedStudentsTable } from "./_components/arrived-students-table";
import { AttendanceChart } from "./_components/attendance-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6">
        <div>
          <DashboardStats />
        </div>
        <div className="flex-1">
          <AttendanceChart />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Arrived Student</h2>
        <ArrivedStudentsTable />
      </div>
    </div>
  );
}
