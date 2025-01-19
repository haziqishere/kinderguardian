"use client";

// @/app/parent/children-list/page.tsx
import { ChildCard } from "./_components/child-card";
import { AddChildCard } from "./_components/add-child-card";
import { useChildren } from "@/hooks/use-children";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { toast } from "sonner";

const ChildrenListPage = () => {
  const { data: children, isLoading, error, isError } = useChildren();

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-muted-foreground">
            {error instanceof Error
              ? error.message
              : "Failed to load children data"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const hasChildren = children && children.length > 0;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Children List</h1>
        <p className="text-muted-foreground">
          Manage and monitor your children's attendance and activities
        </p>
      </div>

      {!hasChildren ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No children found</p>
          <AddChildCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              id={child.id}
              name={child.fullName}
              class={child.class?.name ?? "Unknown"}
              isPresent={
                child.attendance[0]?.status === "ON_TIME" ||
                child.attendance[0]?.status === "LATE"
              }
              imageUrl={`/api/images/${child.id}`}
            />
          ))}
          <AddChildCard />
        </div>
      )}
    </div>
  );
};

export default ChildrenListPage;
