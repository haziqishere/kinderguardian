"use client";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Clock, Users, AlertTriangle } from "lucide-react";

const totalStudents = 104;
const lateStudents = 4;
const attendingStudents = "93%";
const absentNoReason = 2;

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Changed to 2x2 grid */}
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Late Students</p>
              <p className="text-2xl font-bold">{lateStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded">
              <Users className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Attending Students
              </p>
              <p className="text-2xl font-bold">{attendingStudents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white w-60">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Absent No Reason</p>
              <p className="text-2xl font-bold">{absentNoReason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
