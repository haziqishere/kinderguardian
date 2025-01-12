import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public routes that don't need authentication
  const isPublicRoute = ["/", "/sign-in", "/sign-up"].includes(path);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get the token from the session cookie
  const token = request.cookies.get("session")?.value;

  // For protected routes, check authentication
  if (!token) {
    // Redirect to sign-in if trying to access protected route without token
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Verify session by calling our session API endpoint
    const sessionResponse = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      method: 'GET',
      headers: {
        Cookie: `session=${token}`,
      },
    });

    if (!sessionResponse.ok) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const { uid: firebaseId } = await sessionResponse.json();

    // Check user type for protected routes
    if (path.startsWith("/parent") || path.startsWith("/kindergarten")) {
      try {
        // Get user type from API
        const response = await fetch(`${request.nextUrl.origin}/api/auth/user-type`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseId,
          }),
        });

        if (!response.ok) {
          // If user type check fails, redirect to sign-in
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const { userType } = await response.json();

        // Check if user is trying to access the wrong route type
        if (path.startsWith("/parent") && userType !== "parent") {
          return NextResponse.redirect(new URL("/kindergarten/dashboard", request.url));
        }

        if (path.startsWith("/kindergarten") && userType !== "kindergarten") {
          return NextResponse.redirect(new URL("/parent/children-list", request.url));
        }
      } catch (error) {
        // If there's an error checking user type, redirect to sign-in
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // If session verification fails, redirect to sign-in
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};