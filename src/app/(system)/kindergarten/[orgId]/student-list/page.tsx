import { StudentList } from "./_components/student-list";
import { getStudents } from "@/actions/student";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface StudentListPageProps {
  params: {
    orgId: string;
  };
}

export default async function StudentListPage({
  params,
}: StudentListPageProps) {
  const result = await getStudents(params.orgId);

  if (result.error) {
    return (
      <div className="p-6">
        <div className="text-red-500">Error: {result.error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        }
      >
        <StudentList students={result.data || []} />
      </Suspense>
    </div>
  );
}
