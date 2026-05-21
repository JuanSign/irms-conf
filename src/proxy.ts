import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isRegisterRoute = pathname.startsWith("/dashboard/register");

  if (isDashboardRoute && !isRegisterRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/register", req.nextUrl));
  }

  if (isRegisterRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};