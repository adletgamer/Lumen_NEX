import { NextRequest, NextResponse } from "next/server"

// This callback route is no longer needed for Supabase OAuth.
// With custom Neon auth (email/password), auth is handled directly
// in Server Actions. This route simply redirects to dashboard.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = searchParams.get("next") ?? "/dashboard"
  return NextResponse.redirect(`${origin}${next}`)
}
