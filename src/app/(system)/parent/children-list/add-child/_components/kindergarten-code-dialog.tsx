// src/components/kindergarten-code-dialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// src/components/kindergarten-code-dialog.tsx
interface KindergartenCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (kindergartenId: string) => void;
  kindergartenData: {
    id: string;
    name: string;
  };
}

export function KindergartenCodeDialog({
  isOpen,
  onClose,
  onSuccess,
  kindergartenData,
}: KindergartenCodeDialogProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    try {
      const parentCode = kindergartenData.id.slice(-5);

      if (code !== parentCode) {
        toast.error("Invalid code");
        setIsVerifying(false);
        return;
      }

      // First call onSuccess to update the form
      onSuccess(kindergartenData.id);
      // Then close the dialog
      onClose();
      // Clear the code input
      setCode("");
    } catch (error) {
      toast.error("Failed to verify code");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Parent Code</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please enter the parent code for {kindergartenData.name}
          </p>
          <Input
            placeholder="Enter 5-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={5}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying || code.length !== 5}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
