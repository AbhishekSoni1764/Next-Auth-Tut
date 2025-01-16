import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET_TOKEN,
  });
  const { pathname } = request.nextUrl;

  if (
    token &&
    ["/sign-in", "/sign-up", "/verify"].some((path) =>
      pathname.startsWith(path)
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"],
};
