// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Non connecté
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protéger route professionnelle
  if (pathname.startsWith("/dashboard/professional") && token.role !== "professional") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Protéger route client
  if (pathname.startsWith("/dashboard/client") && token.role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
