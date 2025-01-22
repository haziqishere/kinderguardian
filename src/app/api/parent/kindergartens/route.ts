// app/api/parent/kindergartens/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("[KINDERGARTENS_GET] Starting kindergarten fetch");
    
    const kindergartens = await db.kindergarten.findMany({
      select: {
        id: true,
        name: true,
        classes: {
          select: {
            id: true,
            name: true,
            capacity: true,
            students: {
              select: {
                id: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Show newest first
      }
    });

    console.log("[KINDERGARTENS_GET] Found kindergartens:", kindergartens.length);

    // Transform with better logging
    const formattedKindergartens = kindergartens.map(k => {
      console.log(`[KINDERGARTENS_GET] Processing ${k.name}, classes: ${k.classes.length}`);
      
      const availableClasses = k.classes.map(c => {
        const studentCount = c.students.length;
        const hasSpace = c.capacity > studentCount;
        
        console.log(`[KINDERGARTENS_GET] Class ${c.name}: capacity=${c.capacity}, students=${studentCount}, available=${hasSpace}`);
        
        return {
          id: c.id,
          name: c.name,
          capacity: c.capacity,
          _count: {
            students: studentCount
          },
          available: hasSpace
        };
      });

      // Include all kindergartens, even those without available classes
      return {
        id: k.id,
        name: k.name,
        classes: availableClasses,
        hasAvailableSpots: availableClasses.some(c => c.available)
      };
    });

    console.log("[KINDERGARTENS_GET] Formatted response:", 
      JSON.stringify(formattedKindergartens, null, 2));

    return NextResponse.json({ 
      success: true,
      data: formattedKindergartens,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[KINDERGARTENS_GET] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch kindergartens",
      timestamp: new Date().toISOString()
    }, { 
      status: 500 
    });
  }
}