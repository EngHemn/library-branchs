import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { readBranchTypeFromRequest } from "@/lib/authSessionCookie"
import {
  isMainBranchOnlyPath,
  MAIN_BRANCH_ONLY_DENIED_PATH,
} from "@/lib/mainBranchRouteAccess"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isMainBranchOnlyPath(pathname)) {
    return NextResponse.next()
  }

  const branchType = readBranchTypeFromRequest(request)

  if (branchType === "sub") {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = MAIN_BRANCH_ONLY_DENIED_PATH
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/branches", "/dashboard/branches/:path*"],
}
