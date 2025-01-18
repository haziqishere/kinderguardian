// lib/utils/dashboard-calculations.ts
export function calculateAttendanceRate(present: number, total: number): number {
    if (total === 0) return 0;
    return (present / total) * 100;
  }
  
  export function calculateUtilizationRate(enrolled: number, capacity: number): number {
    if (capacity === 0) return 0;
    return (enrolled / capacity) * 100;
  }
  
  export function formatChartData(stats: any[]) {
    return stats.map(stat => ({
      month: new Date(stat.date).toLocaleString('default', { month: 'short' }),
      value: Math.round(stat.attendanceRate * 100)
    }));
  }