// app/(auth)/setup/join/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, School } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  getAvailableKindergartens,
  joinKindergarten,
} from "@/actions/kindergarten";
import { getCurrentUser } from "@/lib/firebase/auth";
import { VerifyDialog } from "../_components/verify-dialog";

interface Kindergarten {
  id: string;
  name: string;
  address: string;
  _count: {
    classes: number;
    admins: number;
  };
}

export default function JoinKindergartenPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [manualJoinId, setManualJoinId] = useState("");

  const [selectedKindergarten, setSelectedKindergarten] =
    useState<Kindergarten | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  // Add useEffect to fetch adminId
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await fetch("/api/auth/user-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firebaseId: await getCurrentUser(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin ID");
        }

        const data = await response.json();

        // Check if user already has a kindergarten
        if (data.kindergartenId) {
          toast.error("You are already part of a kindergarten");
          router.push(`/kindergarten/${data.kindergartenId}/dashboard`);
          return;
        }

        if (data.userId) {
          setAdminId(data.userId);
        }
      } catch (error) {
        console.error("Error fetching admin ID", error);
        toast.error("Failed to fetch admin ID");
        router.push("/sign-in");
      } finally {
        setIsLoadingAdmin(false);
      }
    };
    fetchAdminId();
  }, [router]);

  // Fetch available kindergartens
  const {
    data: kindergartens,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["kindergartens"],
    queryFn: async () => {
      const result = await getAvailableKindergartens();
      console.log("Fetched kindergartens:", result); // For debugging
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },
    enabled: !!adminId,
    retry: 1,
  });

  // Error handling if can't fetch kindergartens
  if (error) {
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="py-20 text-center">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-destructive">
              Error Loading Kindergartens
            </h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load kindergartens"}
            </p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>;
  }

  // Filter kindergartens based on search
  const filteredKindergartens = kindergartens?.data?.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinRequest = async (kindergartenId: string) => {
    if (!adminId) {
      toast.error("Please sign in again");
      router.push("/sign-in");
      return;
    }

    try {
      setJoiningId(kindergartenId);
      // We'll need to get the adminId from context/session
      const result = await joinKindergarten({
        kindergartenId,
        adminId: adminId,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Successfully joined kindergarten!");
      router.push(`/kindergarten/${kindergartenId}/dashboard`);
    } catch (error) {
      console.error("Join error:", error);
      toast.error("Failed to join kindergarten");
    } finally {
      setJoiningId(null);
      setShowVerifyDialog(false);
      setManualJoinId("");
    }
  };

  // Add verification handler
  const handleVerification = async (verificationId: string) => {
    if (!selectedKindergarten) return;

    // Get first 5 charactes of kindergarten ID
    const shortId = selectedKindergarten.id.substring(0, 5);

    if (verificationId !== shortId) {
      toast.error("Invalid verificaiton ID");
      return;
    }

    await handleJoinRequest(selectedKindergarten.id);
  };

  // Show loading state while checking admin status
  if (isLoadingAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-20 text-center">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Loading...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we check your details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="container max-w-5xl py-10">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Join Kindergarten
          </h1>
          <p className="text-muted-foreground mt-2">
            Browse and join an existing kindergarten
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Kindergartens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search kindergartens..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading kindergartens...
              </div>
            ) : !filteredKindergartens?.length ? (
              <div className="text-center py-12">
                <School className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">
                  No kindergartens found
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {search
                    ? "Try a different search term"
                    : "No kindergartens are available to join"}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Admins</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKindergartens.map((kindergarten) => (
                      <TableRow key={kindergarten.id}>
                        <TableCell className="font-medium">
                          {kindergarten.name}
                        </TableCell>
                        <TableCell>{kindergarten.address}</TableCell>
                        <TableCell>{kindergarten._count.classes}</TableCell>
                        <TableCell>{kindergarten._count.admins}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={joiningId === kindergarten.id}
                            onClick={() => {
                              setSelectedKindergarten(kindergarten);
                              setShowVerifyDialog(true);
                            }}
                          >
                            {joiningId === kindergarten.id
                              ? "Joining..."
                              : "Join"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mb-6 mt-4 p-4 border rounded-lg">
              <h3 className="text-sm font-medium mb-2">
                Have a kindergarten code?
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter kindergarten code"
                  value={manualJoinId}
                  onChange={(e) => setManualJoinId(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!manualJoinId || joiningId !== null}
                  onClick={() => {
                    const found = kindergartens?.data?.find(
                      (k) => k.id === manualJoinId
                    );
                    setSelectedKindergarten(found || null);
                    setShowVerifyDialog(true);
                  }}
                >
                  Join
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <VerifyDialog
        isOpen={showVerifyDialog}
        onClose={() => {
          setShowVerifyDialog(false);
          setSelectedKindergarten(null);
        }}
        onConfirm={handleVerification}
        kindergartenName={selectedKindergarten?.name || ""}
        isLoading={joiningId === selectedKindergarten?.id}
      />
    </div>
  );
}
