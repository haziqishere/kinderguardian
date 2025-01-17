// app/(auth)/setup/join/_components/verify-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VerifyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (verificationId: string) => void;
  kindergartenName: string;
  isLoading: boolean;
}

export function VerifyDialog({
  isOpen,
  onClose,
  onConfirm,
  kindergartenName,
  isLoading,
}: VerifyDialogProps) {
  const [verificationId, setVerificationId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(verificationId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription>
        Please enter the 5-character verification code for {kindergartenName} to
        proceed.
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Kindergarten ID</DialogTitle>
          <DialogDescription>
            Please enter the verification ID for {kindergartenName} to proceed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter verification code"
            value={verificationId}
            onChange={(e) => setVerificationId(e.target.value.substring(0, 5))}
            disabled={isLoading}
            maxLength={5}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!verificationId || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Join"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
