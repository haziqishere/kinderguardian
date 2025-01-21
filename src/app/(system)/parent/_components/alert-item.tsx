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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AlertItemProps {
  id: string;
  name: string;
  alertType: string;
  alertTime: string;
  parentAction: string;
  reason: string | null;
}

interface AlertUpdateResponse {
  success: boolean;
  data?: {
    id: string;
    status: string;
    reason: string;
  };
  error?: string;
}

export default function AlertItem({
  id,
  name,
  alertType,
  alertTime,
  parentAction,
  reason,
}: AlertItemProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate: updateAlert, isPending } = useMutation<
    AlertUpdateResponse,
    Error,
    void,
    unknown
  >({
    mutationFn: async () => {
      const response = await fetch(`/api/parent/alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          reason: remarks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update alert");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Alert updated successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: () => {
      toast.error("Failed to update alert");
    },
  });

  const handleSubmit = () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    updateAlert();
  };

  return (
    <div className="border-l-4 border-yellow-400 bg-white p-3 md:p-4 rounded shadow">
      <div className="text-yellow-600 text-xs md:text-sm font-medium mb-3">
        {parentAction === "NO_RESPONSE" ? "PENDING RESPONSE" : parentAction}
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src="" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-medium">{name}</h3>
            <p className="text-xs md:text-sm text-gray-500">
              {format(new Date(alertTime), "PPpp")}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {parentAction === "NO_RESPONSE" && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Respond</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Alert Response</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ABSENT">Absent</SelectItem>
                        <SelectItem value="LATE">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason & Remarks
                    </label>
                    <Textarea
                      placeholder="Enter your reason here..."
                      className="min-h-[100px]"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isPending}>
                      {isPending ? "Saving..." : "Save changes"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      {reason && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-medium">Reason:</span> {reason}
        </div>
      )}
    </div>
  );
}
