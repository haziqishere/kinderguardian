// parent/_components/child-switcher.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Child {
  id: string;
  name: string;
  class: string;
  imageUrl?: string;
}

interface ChildSwitcherProps {
  children: Child[];
  selectedChild: Child;
  onChildChange: (childId: string) => void;
}

export const ChildSwitcher = ({
  children,
  selectedChild,
  onChildChange,
}: ChildSwitcherProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedChild.imageUrl} />
              <AvatarFallback>{selectedChild.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{selectedChild.name}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedChild.class}
              </p>
            </div>
          </div>
          <Select value={selectedChild.id} onValueChange={onChildChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Switch child" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{child.name[0]}</AvatarFallback>
                      </Avatar>
                      {child.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
