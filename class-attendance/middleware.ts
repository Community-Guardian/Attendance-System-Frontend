import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // For simplicity in this demo, we'll check localStorage in client components instead
  // This middleware will just allow all routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

