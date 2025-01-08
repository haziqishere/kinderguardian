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
import { updateClass } from "@/actions/class";
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

interface EditClassPageProps {
  params: {
    classId: string;
    orgId: string;
  };
}

export default function EditClassPage({ params }: EditClassPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateClassSchemaType>({
    resolver: zodResolver(UpdateClassSchema),
    defaultValues: {
      id: params.classId,
      name: "",
      capacity: 25,
    },
  });

  // Fetch class data when component mounts
  useEffect(() => {
    const fetchClass = async () => {
      try {
        // TODO: Add getClass action and implement fetching
        // const response = await getClass(params.classId);
        // if (response.error) {
        //   toast.error(response.error);
        //   return;
        // }
        // form.reset({
        //   id: response.data.id,
        //   name: response.data.name,
        //   capacity: response.data.capacity,
        // });
      } catch (error) {
        toast.error("Failed to fetch class details");
        router.push(`/kindergarten/${params.orgId}/classes`);
      }
    };

    fetchClass();
  }, [params.classId, params.orgId]);

  const onSubmit = async (data: UpdateClassSchemaType) => {
    try {
      setLoading(true);
      const response = await updateClass(data);

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
                    <FormLabel>Student Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
