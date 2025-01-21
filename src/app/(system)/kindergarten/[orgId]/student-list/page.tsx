import { StudentList } from "./_components/student-list";
import { getStudents } from "@/actions/student";
import { Card, CardContent } from "@/components/ui/card";

interface StudentListPageProps {
  params: {
    orgId: string;
  };
}

export default async function StudentListPage({
  params,
}: StudentListPageProps) {
  const result = await getStudents(params.orgId);

  if (!result || result.error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center text-destructive">
            {result?.error || "Failed to load students"}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <StudentList students={result.data || []} />
    </div>
  );
}
