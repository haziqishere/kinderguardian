"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  UpdateClassSchemaType,
  UpdateClassSchema,
} from "@/actions/class/schema";
import { getClass, updateClass } from "@/actions/class";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface EditClassPageProps {
  params: {
    classId: string;
    orgId: string;
  };
}

type ClassData = {
  id: string;
  name: string;
  capacity: number;
  kindergartenId: string;
  description?: string;
  studentCount: number;
  _count: { students: number };
  createdAt: Date;
  updatedAt: Date;
};

export default function EditClassPage({ params }: EditClassPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);

  const form = useForm<UpdateClassSchemaType>({
    resolver: zodResolver(UpdateClassSchema),
    defaultValues: {
      id: params.classId,
      name: "",
      capacity: 25,
      kindergartenId: params.orgId,
    },
  });

  // Fetch class data when component mounts
  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await getClass(params.classId);
        if (response.error || !response.data) {
          toast.error(response.error || "No data found");
          return;
        }
        // Update form with fetched data
        setClassData({
          ...response.data,
          description: response.data.description ?? undefined,
        });
        form.reset({
          id: params.classId,
          name: response.data.name,
          capacity: response.data.capacity,
          kindergartenId: params.orgId,
        });
      } catch (error) {
        toast.error("Failed to fetch class details");
        router.push(`/kindergarten/${params.orgId}/classes`);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchClass();
  }, [params.classId, params.orgId, form]);

  const onSubmit = async (data: UpdateClassSchemaType) => {
    try {
      setLoading(true);
      const response = await updateClass({
        ...data,
        kindergartenId: params.orgId,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success("Class updated successfully");
      router.push(`/kindergarten/${params.orgId}/classes`);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //Loading state
  if (isInitializing) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="space-y-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">
                Loading class details...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Class</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 Kenyala" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  type="button"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
