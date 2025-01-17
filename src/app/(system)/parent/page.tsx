// src/app/(dashboard)/parent/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardContent } from "./_components/dashboard-content";
import { ChildSwitcher, Child } from "./_components/child-switcher";
import { getChildrenData, ChildData } from "@/actions/parent/get-children";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // TODO: Replace with actual parent ID from auth
        const result = await getChildrenData("test-parent-id");
        if (result.data) {
          const formattedChildren = result.data.map((child) => ({
            id: child.id,
            name: child.fullName,
            class: child.class || { id: "", name: "Unassigned" },
            imageUrl: child.faceImages?.front,
          }));
          setChildren(formattedChildren);
          if (formattedChildren.length > 0) {
            setSelectedChild(formattedChildren[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching children:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const handleChildChange = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      setSelectedChild(child);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <ChildSwitcher
          children={children}
          selectedChild={selectedChild || children[0]}
          onChildChange={handleChildChange}
          isLoading={loading}
        />
        <Link href="/parent/children-list/add-child">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {children.length === 0 ? (
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
        <DashboardContent childId={selectedChild?.id || ""} />
      )}
    </div>
  );
}
