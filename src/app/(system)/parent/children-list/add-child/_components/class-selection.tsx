// parent/children-list/add-child/_components/class-selection.tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ClassOption {
  id: string;
  name: string;
  capacity: number;
  _count: {
    students: number;
  };
  available: boolean;
}

interface ClassSelectionProps {
  classes: ClassOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const ClassSelection = ({
  classes,
  selectedValue,
  onValueChange,
  disabled,
}: ClassSelectionProps) => {
  console.log("ClassSelection rendered with:", {
    classesCount: classes.length,
    selectedValue,
    disabled,
  });

  // If no classes are available, show a message
  if (classes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center border rounded-lg">
        No classes available
      </div>
    );
  }

  return (
    <RadioGroup
      onValueChange={(value) => {
        console.log("RadioGroup value changed to:", value);
        onValueChange(value);
      }}
      value={selectedValue}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      disabled={disabled}
    >
      {classes.map((cls) => {
        const isAvailable = cls.capacity > cls._count.students;
        const isSelected = selectedValue === cls.id;

        return (
          <label key={cls.id}>
            <Card
              className={`relative p-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary"
                  : !isAvailable
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-primary"
              }`}
            >
              <RadioGroupItem
                value={cls.id}
                className="sr-only"
                disabled={!isAvailable || disabled}
              />
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{cls.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {cls._count.students} / {cls.capacity} students
                  </p>
                  {!isAvailable && (
                    <p className="text-sm text-destructive mt-1">Class full</p>
                  )}
                </div>
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </div>
            </Card>
          </label>
        );
      })}
    </RadioGroup>
  );
};
