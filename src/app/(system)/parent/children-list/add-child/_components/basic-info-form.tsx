"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  AddChildSchemaType,
  BasicInfoSchemaType,
} from "@/actions/student/schema";
import { Plus, Minus } from "lucide-react";

interface BasicInfoFormProps {
  form: UseFormReturn<AddChildSchemaType>;
}

export const BasicInfoForm = ({ form }: BasicInfoFormProps) => {
  // Use BasicInfoSchemaType for the field array since we're in basic info step
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phoneNumbers",
    rules: { minLength: 1 },
  });

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name (as per IC)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4-kenyala">4 Kenyala</SelectItem>
                  <SelectItem value="4-kenari">4 Kenari</SelectItem>
                  <SelectItem value="4-mutiara">4 Mutiara</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Phone Numbers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Parent's Phone Numbers</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Phone Number
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name={`phoneNumbers.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <div className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input placeholder="e.g., 0123456789" {...field} />
                    </FormControl>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
