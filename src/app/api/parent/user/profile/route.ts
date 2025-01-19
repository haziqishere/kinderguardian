// api/parent/profile/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { firebaseId } = await request.json();

  try {
    const parentWithChildren = await db.parent.findUnique({
      where: { firebaseId },
      include: {
        students: {
          include: {
            class: true,
            phoneNumbers: true
          }
        }
      }
    });

    if (!parentWithChildren) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    const formattedData = {
      id: parentWithChildren.id,
      name: parentWithChildren.name,
      email: parentWithChildren.email,
      children: parentWithChildren.students.map(student => ({
        id: student.id,
        name: student.fullName,
        age: student.age,
        class: student.class?.name,
        phoneNumbers: student.phoneNumbers.map(p => p.phoneNumber)
      }))
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('[GET_PARENT_PROFILE]', error);
    return NextResponse.json({ error: 'Failed to fetch parent profile' }, { status: 500 });
  }
}