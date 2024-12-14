"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

export type Option = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
}: MultiSelectProps) {
  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {selected.map((value) => (
          <Badge
            key={value}
            variant="secondary"
            onClick={() => handleUnselect(value)}
          >
            {options.find((opt) => opt.value === value)?.label}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={(e) => {
                e.stopPropagation();
                handleUnselect(value);
              }}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select classes" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-[200px]">
            <SelectGroup>
              <SelectLabel>Classes</SelectLabel>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={selected.includes(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
