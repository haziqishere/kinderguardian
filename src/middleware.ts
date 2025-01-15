// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

interface FirebaseJwtPayload {
  user_id: string;
  sub: string;
  email: string;
  email_verified: boolean;
  firebase: {
    identities: {
      email?: string[];
    };
    sign_in_provider: string;
  };
  exp: number;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for API routes
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // Define public routes
  const isPublicRoute = ["/", "/sign-in", "/sign-up"].includes(path);
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check session
  const token = request.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    // Decode token once
    const decodedToken = jwtDecode<FirebaseJwtPayload>(token);
    
    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      console.log("[Middleware] Token expired");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const firebaseId = decodedToken.user_id;

    // Only check user type for protected routes
    if (path.startsWith("/parent") || path.startsWith("/kindergarten")) {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/auth/user-type`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebaseId }),
        });

        if (!response.ok) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const { userType } = await response.json();

        // Redirect if wrong route type
        const isParentRoute = path.startsWith("/parent");
        const isKindergartenRoute = path.startsWith("/kindergarten");

        if ((isParentRoute && userType !== "parent") || 
            (isKindergartenRoute && userType !== "kindergarten")) {
          const redirectPath = userType === "parent" 
            ? "/parent/children-list"
            : "/kindergarten/dashboard"; // TODO: Change to dynamic route
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      } catch (error) {
        console.error("[Middleware] Route protection error:", error);
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Token validation error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};