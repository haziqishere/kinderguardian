import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastStep?: boolean;
}

export const FormButtons = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLastStep = false,
}: FormButtonsProps) => {
  return (
    <div className="flex justify-between pt-6">
      {currentStep > 0 && (
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
      )}
      {currentStep < totalSteps - 1 ? (
        <Button type="button" onClick={onNext} className="ml-auto">
          Next
        </Button>
      ) : (
        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      )}
    </div>
  );
};
