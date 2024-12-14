import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export const AddChildCard = () => {
  return (
    <Card className="border-none">
      <CardContent className="p-6">
        <Link href="/parent/children-list/add-child">
          <Button variant="outline" className="w-full h-[120px] border-dashed">
            <div className="flex flex-col items-center gap-y-2">
              <UserPlus className="h-8 w-8" />
              <p className="text-base">Add Children</p>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
