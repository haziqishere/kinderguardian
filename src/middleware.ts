import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value || '';

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    // Verify session through API route instead of direct Firebase Admin usage
    const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        Cookie: `session=${session}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid session');
    }

    if (request.nextUrl.pathname.startsWith('/kindergarten')) {
      const userTypeResponse = await fetch(
        `${request.nextUrl.origin}/api/auth/user-type`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firebaseId: (await response.json()).uid,
          }),
        }
      );

      if (!userTypeResponse.ok) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

export const config = {
  matcher: ['/parent/:path*', '/kindergarten/:path*'],
};