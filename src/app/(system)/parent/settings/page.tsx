// app/(system)/parent/settings/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/firebase/auth";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Child {
  id: string;
  name: string;
  age: number;
  class: string;
  phoneNumbers: string[];
}

interface ParentProfile {
  id: string;
  name: string;
  email: string;
  children: Child[];
}

const SettingsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [deletingChild, setDeletingChild] = useState<Child | null>(null);
  const [updatedData, setUpdatedData] = useState<Record<string, any>>({});

  const { data: profile, isLoading } = useQuery<ParentProfile>({
    queryKey: ["parentProfile"],
    queryFn: async () => {
      const firebaseId = await getCurrentUser();
      const response = await fetch("/api/parent/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      return response.json();
    },
  });

  const handleUpdate = async (childId: string) => {
    try {
      const response = await fetch("/api/parent/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: childId,
          updates: updatedData[childId],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      await queryClient.invalidateQueries({ queryKey: ["parentProfile"] });
      toast.success("Updated successfully");
      setEditingChild(null);
    } catch (error) {
      toast.error("Failed to update information");
    }
  };

  const handleDelete = async () => {
    if (!deletingChild) return;

    try {
      const response = await fetch("/api/parent/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: deletingChild.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      await queryClient.invalidateQueries({ queryKey: ["parentProfile"] });
      toast.success("Child removed successfully");
      setDeletingChild(null);
    } catch (error) {
      toast.error("Failed to remove child");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-6 text-center">
          Settings
        </h1>

        <div className="space-y-6">
          {profile?.children.map((child) => (
            <Card key={child.id} className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">
                  {editingChild === child.id
                    ? "Edit Child Information"
                    : child.name}
                </CardTitle>
                {editingChild !== child.id && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDeletingChild(child)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingChild === child.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        type="text"
                        defaultValue={child.name}
                        className="w-full"
                        onChange={(e) =>
                          setUpdatedData({
                            ...updatedData,
                            [child.id]: {
                              ...updatedData[child.id],
                              name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        type="number"
                        defaultValue={child.age}
                        className="w-full"
                        onChange={(e) =>
                          setUpdatedData({
                            ...updatedData,
                            [child.id]: {
                              ...updatedData[child.id],
                              age: parseInt(e.target.value),
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Numbers</Label>
                      <div className="space-y-2">
                        {child.phoneNumbers.map((phone, index) => (
                          <Input
                            key={index}
                            type="text"
                            defaultValue={phone}
                            className="w-full"
                            onChange={(e) => {
                              const newPhones = [...child.phoneNumbers];
                              newPhones[index] = e.target.value;
                              setUpdatedData({
                                ...updatedData,
                                [child.id]: {
                                  ...updatedData[child.id],
                                  phoneNumbers: newPhones,
                                },
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => handleUpdate(child.id)}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => setEditingChild(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium">{child.age}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-medium">{child.class}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        Phone Numbers
                      </p>
                      <ul className="space-y-1">
                        {child.phoneNumbers.map((phone, index) => (
                          <li key={index} className="font-medium">
                            {phone}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={() => setEditingChild(child.id)}
                    >
                      Edit Information
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog
        open={!!deletingChild}
        onOpenChange={() => setDeletingChild(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {deletingChild?.name}'s information from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;
