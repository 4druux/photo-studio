import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("token");

  if (pathname.startsWith("/auth") && tokenCookie) {
    try {
      await jwtVerify(tokenCookie.value, JWT_SECRET);
      return NextResponse.redirect(new URL("/admin/booking", request.url));
    } catch (error) {}
  }

  if (pathname.startsWith("/admin")) {
    if (!tokenCookie) {
      return NextResponse.redirect(new URL("/auth/redirecting", request.url));
    }

    try {
      await jwtVerify(tokenCookie.value, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/auth/redirecting", request.url)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
