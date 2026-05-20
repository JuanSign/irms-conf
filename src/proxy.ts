import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isPortalRoute = req.nextUrl.pathname.startsWith("/dashboard/portal");

  if (isPortalRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/register", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};