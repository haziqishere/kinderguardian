// utils/parent-checks.ts
import { db } from "@/lib/db";

export async function canAddMoreChildren(parentId: string): Promise<{
  canAdd: boolean;
  reason?: string;
}> {
  try {
    const childrenCount = await db.student.count({
      where: { parentId }
    });

    // You can adjust this limit based on your requirements
    const MAX_CHILDREN = 5;

    return {
      canAdd: childrenCount < MAX_CHILDREN,
      reason: childrenCount >= MAX_CHILDREN ? 
        `Maximum number of children (${MAX_CHILDREN}) reached` : undefined
    };
  } catch (error) {
    console.error("[CAN_ADD_CHILDREN_CHECK]", error);
    return { canAdd: false, reason: "Failed to check children limit" };
  }
}