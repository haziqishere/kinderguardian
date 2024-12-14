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

export default function AlertItem({ name }: { name: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-l-4 border-yellow-400 bg-white p-4 rounded shadow">
      <div className="text-yellow-600 text-sm font-medium mb-4">
        PENDING RESPOND
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">
            Your child is not present at kindergarten. If your child is not
            absent, please provide us the reason
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Resolve</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Attendance Resolution</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Attendance Status
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="absent">Absence</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
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
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle save logic here
                      setOpen(false);
                    }}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
