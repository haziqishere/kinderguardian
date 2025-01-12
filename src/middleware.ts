import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value || "";

  // Verify session cookie
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(session, true);
    
    // Check user role for protected routes
    if (request.nextUrl.pathname.startsWith("/kindergarten")) {
      const admin = await prisma?.admin.findUnique({
        where: { firebaseId: decodedClaims.uid },
      });
      
      if (!admin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    "/parent/:path*",
    "/kindergarten/:path*",
  ],
};