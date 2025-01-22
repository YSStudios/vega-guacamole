import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for login page
    if (request.nextUrl.pathname === "/admin") {
      return NextResponse.next();
    }

    // Check for admin session
    const adminSession = request.cookies.get("adminSession");

    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
