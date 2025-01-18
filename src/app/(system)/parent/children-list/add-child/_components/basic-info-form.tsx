// parent/children-list/add-child/_components/basic-info-form.tsx
"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { StudentSchemaType } from "@/actions/student/schema";
import { useKindergartenClasses } from "@/hooks/useKindergartenClasses";
import { useClassAvailability } from "@/hooks/useClassAvailability";
import { ClassSelection } from "./class-selection";

interface BasicInfoFormProps {
  form: UseFormReturn<StudentSchemaType>;
}

export const BasicInfoForm = ({ form }: BasicInfoFormProps) => {
  const [selectedKindergarten, setSelectedKindergarten] = useState<string>("");
  const { data: kindergartens, isLoading } = useKindergartenClasses();
  const selectedClassId = form.watch("classId");
  const { data: availabilityData } = useClassAvailability(selectedClassId);

  console.log("Selected Kindergarten:", selectedKindergarten);
  console.log("Form ClassId Value:", form.watch("classId"));
  console.log(
    "Available Classes:",
    kindergartens?.find((k) => k.id === selectedKindergarten)?.classes
  );

  const availableClasses =
    kindergartens?.find((k) => k.id === selectedKindergarten)?.classes || [];

  // Reset class selection when kindergarten changes
  useEffect(() => {
    if (selectedKindergarten && form.getValues("classId")) {
      const classId = form.getValues("classId");
      const classExists = availableClasses.some((cls) => cls.id === classId);
      if (!classExists) {
        form.setValue("classId", "");
      }
    }
  }, [selectedKindergarten, form, availableClasses]);

  const availableClassOptions = availableClasses.map((cls) => ({
    ...cls,
    available: cls.capacity > cls._count.students,
  }));

  // Phone numbers handlers
  const addPhoneNumber = () => {
    const currentPhoneNumbers = form.getValues("phoneNumbers") || [];
    form.setValue("phoneNumbers", [...currentPhoneNumbers, ""]);
  };

  const removePhoneNumber = (index: number) => {
    const currentPhoneNumbers = form.getValues("phoneNumbers") || [];
    form.setValue(
      "phoneNumbers",
      currentPhoneNumbers.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name (as per IC)</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input
                type="date"
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Phone Numbers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Phone Numbers</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addPhoneNumber}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Phone Number
          </Button>
        </div>
        <FormDescription>
          Enter Malaysian phone numbers (Format: 01XXXXXXXX)
        </FormDescription>
        {form.watch("phoneNumbers")?.map((_, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`phoneNumbers.${index}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input placeholder="01XXXXXXXX" {...field} />
                  </FormControl>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhoneNumber(index)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
      {/* Kindergarten Selection */}
      <FormItem>
        <FormLabel>Kindergarten</FormLabel>
        <Select
          value={selectedKindergarten}
          onValueChange={(value) => {
            setSelectedKindergarten(value);
            form.setValue("classId", "");
            form.setValue("kindergartenId", value);
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a kindergarten" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <SelectItem value="loading" disabled>
                Loading kindergartens...
              </SelectItem>
            ) : kindergartens?.length ? (
              kindergartens.map((k) => (
                <SelectItem key={k.id} value={k.id}>
                  {k.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No kindergartens available
              </SelectItem>
            )}
          </SelectContent>
          {availabilityData?.data && (
            <div className="mt-2">
              <Badge
                variant={
                  availabilityData.data.isAvailable ? "positive" : "destructive"
                }
              >
                {availabilityData.data.currentCount} /{" "}
                {availabilityData.data.capacity} students
              </Badge>
            </div>
          )}
        </Select>
      </FormItem>
      {/* Class Selection */}
      <FormField
        control={form.control}
        name="classId"
        render={({ field }) => {
          // Debug logs
          console.log("Field in class selection:", {
            value: field.value,
            onChange: field.onChange,
          });
          console.log("Available class options:", availableClassOptions);

          return (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <FormControl>
                <ClassSelection
                  classes={availableClassOptions}
                  selectedValue={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={!selectedKindergarten || isLoading}
                />
              </FormControl>
              <FormMessage />
              {selectedKindergarten && availableClassOptions.length === 0 && (
                <FormDescription className="text-destructive">
                  No classes available for this kindergarten
                </FormDescription>
              )}
            </FormItem>
          );
        }}
      />
    </div>
  );
};
