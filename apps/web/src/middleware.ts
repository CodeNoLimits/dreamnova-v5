import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication (dashboard + portal)
const PROTECTED_PREFIXES = [
  "/overview",
  "/orders",
  "/hafatsa",
  "/nfc",
  "/settings",
  "/unlock",
  "/tikkun",
  "/azamra",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only gate protected routes (dashboard + portal)
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for access cookie on protected routes
  const hasAccess = request.cookies.get("nova-access");
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
