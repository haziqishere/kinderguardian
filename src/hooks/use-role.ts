// src/hooks/use-role.ts
import { useQuery } from "@tanstack/react-query";
import { AdminRole } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useRole(kindergartenId: string | null) {
  const router = useRouter();

  return useQuery({
    queryKey: ['adminRole', kindergartenId],
    queryFn: async () => {
      if (!kindergartenId) return null;
      
      try {
        const response = await fetch('/api/auth/role');
        
        if (response.status === 401) {
          // Session expired - redirect to login
          router.push('/sign-in');
          return null;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch role');
        }
        
        const data = await response.json();
        return data.role as AdminRole;
      } catch (error) {
        console.error('Role fetch error:', error);
        if (error instanceof Error && error.message !== 'Session expired') {
          toast.error("Failed to fetch admin role");
        }
        return null;
      }
    },
    enabled: !!kindergartenId,
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}