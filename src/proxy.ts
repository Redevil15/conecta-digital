import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";

// Instancia edge-safe (sin Prisma ni bcrypt) solo para leer la sesión y redirigir.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Rutas que requieren sesión.
  const protegidas = ["/inicio", "/modulo", "/leccion", "/admin"];
  const necesitaSesion = protegidas.some((p) => pathname.startsWith(p));

  if (necesitaSesion && !session) {
    return NextResponse.redirect(new URL("/acceso", req.url));
  }

  // /admin además exige rol ADMIN.
  if (
    pathname.startsWith("/admin") &&
    (session?.user as { role?: string })?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/inicio", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/inicio/:path*", "/modulo/:path*", "/leccion/:path*", "/admin/:path*"],
};
