import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth, isAdminAuthInitialized } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!isAdminAuthInitialized(adminAuth)) {
      return NextResponse.json({ error: "Auth not initialized" }, { status: 500 });
    }

    const session = cookies().get('session')?.value || '';
    
    if (!session) {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    
    return NextResponse.json({ 
      isValid: true,
      uid: decodedClaims.uid 
    });
  } catch (error) {
    return NextResponse.json({ isValid: false }, { status: 401 });
  }
}