"use client";
import { DataTable } from "./data-table";
import { respondedColumns } from "../alert-list/_components/alert-table/responded-columns";
import { awaitingColumns } from "../alert-list/_components/alert-table/awaiting-columns";
import { AlertStudent } from "@/types/alert";
import { Card, CardContent } from "@/components/ui/card";

type AlertListProps = {
  respondedData: AlertStudent[];
  awaitingData: AlertStudent[];
};

export function AlertList({ respondedData, awaitingData }: AlertListProps) {
  return (
    <div className="space-y-6">
      {/* Responded Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <h2 className="text-lg font-medium">Responded</h2>
        </div>
        <Card>
          <CardContent>
            <DataTable
              columns={respondedColumns}
              data={respondedData}
              searchKey="name"
              showSearch={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Awaiting Response Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <h2 className="text-lg font-medium">Awaiting Respond</h2>
        </div>
        <Card>
          <CardContent>
            <DataTable
              columns={awaitingColumns}
              data={awaitingData}
              searchKey="name"
              showSearch={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
