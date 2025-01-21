// src/app/api/cron/route.ts
import { initializeScheduler } from '@/lib/scheduler';

// Initialize scheduler when the app starts
if (process.env.NODE_ENV === 'production') {
  initializeScheduler();
}

export async function GET() {
  return new Response('Scheduler running');
}