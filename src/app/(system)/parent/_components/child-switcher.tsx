// parent/_components/child-switcher.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface Child {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
}

interface ChildSwitcherProps {
  children: Child[];
  selectedChild: Child | null;
  onChildChange: (childId: string) => void;
  isLoading?: boolean;
}

export function ChildSwitcher({
  children,
  selectedChild,
  onChildChange,
  isLoading = false,
}: ChildSwitcherProps) {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (children.length === 0) {
    return (
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">No children</p>
          <p className="text-sm text-muted-foreground">Add your first child</p>
        </div>
      </div>
    );
  }

  return (
    <Select value={selectedChild?.id} onValueChange={onChildChange}>
      <SelectTrigger className="w-[250px] border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0">
        <SelectValue>
          <div className="flex items-center gap-4">
            <Avatar className="h-6 w-6 md:h-12 md:w-12">
              <AvatarFallback>
                {selectedChild ? getInitials(selectedChild.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{selectedChild?.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedChild?.class?.name}
              </p>
            </div>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {children.map((child) => (
          <SelectItem key={child.id} value={child.id}>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(child.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{child.name}</p>
                <p className="text-xs text-muted-foreground">
                  {child.class.name}
                </p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
