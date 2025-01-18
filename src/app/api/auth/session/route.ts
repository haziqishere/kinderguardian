// src/app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jwtDecode } from "jwt-decode";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Decode token to get expiration
    const decodedToken = jwtDecode<{ exp: number }>(idToken);
    const expiresIn = (decodedToken.exp * 1000) - Date.now();
    
    // Set cookie with proper expiration
    cookies().set('session', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(expiresIn / 1000),
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session] Creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Delete the session cookie
    cookies().delete('session');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Session] Deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}