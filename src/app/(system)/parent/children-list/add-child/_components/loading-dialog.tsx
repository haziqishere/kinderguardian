// parent/children-list/add-child/_components/loading-dialog.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface LoadingDialogProps {
  open: boolean;
}

const LOADING_STATES = [
  "Validating your information...",
  "Uploading photos to secure storage...",
  "Creating student profile...",
  "Setting up communication preferences...",
  "Almost there...",
];

export function LoadingDialog({ open }: LoadingDialogProps) {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!open) {
      setCurrentState(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentState((prev) =>
        prev < LOADING_STATES.length - 1 ? prev + 1 : prev
      );
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-center">
            {LOADING_STATES[currentState]}
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Please don't close this window
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
