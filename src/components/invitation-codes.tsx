// src/components/invitation-codes.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Copy, Shield, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InvitationCodesProps {
  kindergartenId: string;
  isSuper?: boolean;
}

// src/components/invitation-codes.tsx
export function InvitationCodes({
  kindergartenId,
  isSuper = false,
}: InvitationCodesProps) {
  const [open, setOpen] = useState(false);

  const adminCode = kindergartenId.substring(0, 5);
  const parentCode = kindergartenId.slice(-5);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} code copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Invitation Codes</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitation Codes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <h4 className="font-medium">Admin Code</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share with new administrators
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(adminCode, "Admin")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="mt-3 p-2 bg-muted rounded-md font-mono text-center">
              {adminCode}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <h4 className="font-medium">Parent Code</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share with parents for registration
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(parentCode, "Parent")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="mt-3 p-2 bg-muted rounded-md font-mono text-center">
              {parentCode}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
