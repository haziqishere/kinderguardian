"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DayOfWeek } from "@prisma/client";
import {
  KindergartenSettingsSchemaType,
  KindergartenSettingsSchema,
} from "@/actions/kindergarten/schema";
import { getSettings, updateSettings } from "@/actions/settings";
import { getKindergarten, updateKindergarten } from "@/actions/kindergarten";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Clock, Bell, Save, Loader2 } from "lucide-react";
import { InvitationCodes } from "@/components/invitation-codes";

interface SettingsPageProps {
  params: {
    orgId: string;
  };
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const dayNames: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default function SettingsPage({ params }: SettingsPageProps) {
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<KindergartenSettingsSchemaType>({
    resolver: zodResolver(KindergartenSettingsSchema),
    defaultValues: {
      id: params.orgId,
      name: "",
      address: "",
      messageAlertThreshold: "09:00",
      callAlertThreshold: "10:00",
      operatingHours: Object.values(DayOfWeek).map((day) => ({
        dayOfWeek: day,
        startTime: "08:00",
        endTime: "17:00",
      })),
    },
  });

  useEffect(() => {
    let isMounted = true; // Add this

    async function loadSettings() {
      try {
        const result = await getSettings(params.orgId);

        if (!isMounted) return; // Check if still mounted

        if (result.error) {
          toast.error(result.error);
          return;
        }

        const settings = result.data;
        if (!settings) {
          toast.error("Failed to load settings");
          return;
        }

        const formattedData = {
          id: settings.id,
          name: settings.name,
          address: settings.address,
          messageAlertThreshold: formatTime(settings.messageAlertThreshold),
          callAlertThreshold: formatTime(settings.callAlertThreshold),
          operatingHours: settings.operatingHours.map((oh) => ({
            dayOfWeek: oh.dayOfWeek,
            startTime: formatTime(oh.startTime),
            endTime: formatTime(oh.endTime),
          })),
        };

        form.reset(formattedData);
      } catch (error) {
        if (!isMounted) return; // Check if still mounted
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
      } finally {
        if (isMounted) {
          // Check if still mounted
          setIsInitializing(false);
        }
      }
    }

    loadSettings();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [params.orgId]);

  // Add loading state UI
  if (isInitializing) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: KindergartenSettingsSchemaType) => {
    try {
      setLoading(true);
      const result = await updateKindergarten(data);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your kindergarten settings
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
          size="lg"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs
        defaultValue="general"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="operating-hours"
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Operating Hours
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form className="space-y-6">
            <TabsContent value="general">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>
                      Basic details about your kindergarten
                    </CardDescription>
                  </div>
                  <InvitationCodes kindergartenId={params.orgId} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kindergarten Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter kindergarten name"
                          />
                        </FormControl>
                        <FormDescription>
                          This name will be displayed to parents and staff
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full address" />
                        </FormControl>
                        <FormDescription>
                          Physical location of your kindergarten
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="operating-hours">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Operating Hours</CardTitle>
                    <CardDescription>
                      Set your kindergarten's operating hours for each day
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {form.watch("operatingHours").map((oh, index) => (
                      <div
                        key={index}
                        className="grid gap-6 p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {dayNames[oh.dayOfWeek]}
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.startTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Opening Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`operatingHours.${index}.endTime`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Closing Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Settings</CardTitle>
                  <CardDescription>
                    Configure when to send alerts to parents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="messageAlertThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message Alert Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            First notification will be sent via message at this
                            time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="callAlertThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Call Alert Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            If no response to message, a call will be made at
                            this time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
