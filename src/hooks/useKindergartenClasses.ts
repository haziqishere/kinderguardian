// src/hooks/useKindergartenClasses.ts
import { useQuery } from "@tanstack/react-query";

interface Class {
  id: string;
  name: string;
  capacity: number;
  _count: {
    students: number;
  }
}

interface Kindergarten {
  id: string;
  name: string;
  classes: Class[];
}

export function useKindergartenClasses() {
  return useQuery<Kindergarten[]>({
    queryKey: ['kindergartens'],
    queryFn: async () => {
      const response = await fetch('/api/parent/kindergartens');
      if (!response.ok) {
        throw new Error('Failed to fetch kindergartens');
      }
      const data = await response.json();
      return data.data;
    }
  });
}