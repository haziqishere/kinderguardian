// src/hooks/useNotifications.ts
import { useMutation } from "@tanstack/react-query";

export function useSendNotification() {
  return useMutation({
    mutationFn: async ({ 
      studentId,
      type = 'EMAIL'
    }: { 
      studentId: string;
      type?: 'EMAIL' | 'INFO';
    }) => {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      return response.json();
    }
  });
}