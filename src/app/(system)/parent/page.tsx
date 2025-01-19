// src/app/(dashboard)/parent/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DashboardContent } from "./_components/dashboard-content";
import { ChildSwitcher, Child } from "./_components/child-switcher";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useChildren } from "@/hooks/use-children";

export default function ParentDashboard() {
  const { data: children, isLoading } = useChildren();
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    if (children && children.length > 0) {
      const formattedChildren = children.map((child) => ({
        id: child.id,
        name: child.fullName,
        class: child.class || { id: "", name: "Unassigned" },
        imageUrl: `/api/images/${child.id}`,
      }));
      setSelectedChild(formattedChildren[0]);
    }
  }, [children]);

  const handleChildChange = (childId: string) => {
    const child = children?.find((c) => c.id === childId);
    if (child) {
      setSelectedChild({
        id: child.id,
        name: child.fullName,
        class: child.class || { id: "", name: "Unassigned" },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <ChildSwitcher
          children={
            children?.map((child) => ({
              id: child.id,
              name: child.fullName,
              class: child.class || { id: "", name: "Unassigned" },
              imageUrl: `/api/images/${child.id}`,
            })) || []
          }
          selectedChild={selectedChild}
          onChildChange={handleChildChange}
          isLoading={isLoading}
        />
        <Link href="/parent/children-list/add-child">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {!children || children.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-semibold mb-2">No Children Added Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by adding your child to monitor their attendance and receive
            updates.
          </p>
          <Link href="/parent/children-list/add-child">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Child
            </Button>
          </Link>
        </div>
      ) : (
        selectedChild && <DashboardContent childId={selectedChild.id} />
      )}
    </div>
  );
}
