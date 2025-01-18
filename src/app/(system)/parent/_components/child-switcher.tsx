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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Child {
  id: string;
  name: string;
  class: {
    id: string;
    name: string;
  };
  imageUrl?: string;
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
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedChild?.imageUrl} />
              <AvatarFallback>{selectedChild?.name?.[0] || "?"}</AvatarFallback>
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
                <AvatarImage src={child.imageUrl} />
                <AvatarFallback>{child.name[0]}</AvatarFallback>
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
