import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Como não usamos mais Supabase Auth,
 * basta deixar o middleware “vazio” para remover os warnings.
 */
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

/* Matcheia tudo menos assets/_next */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
