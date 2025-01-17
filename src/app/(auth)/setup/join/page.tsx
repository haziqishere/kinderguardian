// app/(auth)/setup/join/page.tsx
"use client";

import { useState } from "react";
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

  // Fetch available kindergartens
  const { data: kindergartens, isLoading } = useQuery({
    queryKey: ["kindergartens"],
    queryFn: getAvailableKindergartens,
  });

  // Filter kindergartens based on search
  const filteredKindergartens = kindergartens?.data?.filter(
    (k) =>
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoinRequest = async (kindergartenId: string) => {
    try {
      setJoiningId(kindergartenId);
      // We'll need to get the adminId from context/session
      const result = await joinKindergarten({
        kindergartenId,
        adminId: "current-admin-id", // This needs to be dynamic
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Successfully joined kindergarten!");
      router.push(`/kindergarten/${kindergartenId}/dashboard`);
    } catch (error) {
      toast.error("Failed to join kindergarten");
    } finally {
      setJoiningId(null);
    }
  };

  return (
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
        <h1 className="text-2xl font-bold tracking-tight">Join Kindergarten</h1>
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
                          onClick={() => handleJoinRequest(kindergarten.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}
