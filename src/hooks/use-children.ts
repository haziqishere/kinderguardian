import { useQuery } from "@tanstack/react-query";

interface Student {
  id: string;
  fullName: string;
  age: number;
  class: {
    id: string;
    name: string;
  } | null;
  attendance: Array<{
    status: 'PENDING' | 'ON_TIME' | 'LATE' | 'ABSENT';
    date: string;
  }>;
}

interface ChildrenResponse {
  data?: Student[];
  error?: string;
}

const fetchChildren = async (): Promise<Student[]> => {
  try {
    const response = await fetch('/api/parent/children');
    const data: ChildrenResponse = await response.json();
    
    if (!response.ok) {
      console.error('Server error:', data.error);
      throw new Error(data.error || 'Failed to fetch children');
    }

    if (!data.data) {
      console.error('No data in response:', data);
      throw new Error('No data received from server');
    }

    return data.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const useChildren = () => {
  return useQuery({
    queryKey: ['children'],
    queryFn: fetchChildren,
    retry: (failureCount, error) => {
      console.log('Query failed:', { failureCount, error });
      // Don't retry on 404 errors
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });
}; 