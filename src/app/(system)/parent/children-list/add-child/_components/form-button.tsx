import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export const FormButtons = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLastStep = false,
  isSubmitting = false,
}: FormButtonsProps) => {
  return (
    <div className="flex justify-between pt-6">
      {currentStep > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
      )}
      {currentStep < totalSteps - 1 ? (
        <Button
          type="button"
          onClick={onNext}
          className="ml-auto"
          disabled={isSubmitting}
        >
          Next
        </Button>
      ) : (
        <Button type="submit" className="ml-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      )}
    </div>
  );
};
