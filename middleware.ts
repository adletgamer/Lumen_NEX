import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard")

  // Redirect to login if accessing dashboard without session
  if (isDashboard && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Redirect to dashboard if accessing auth pages with active session
  if (isAuthPage && sessionToken && !request.nextUrl.pathname.includes("/callback")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
