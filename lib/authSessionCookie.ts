import type { BranchType } from "@/domain/entities/branch/Branch"
import type { NextRequest } from "next/server"

export const AUTH_BRANCH_TYPE_COOKIE = "liba.auth.branch-type"

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function readBranchTypeFromRequest(
  request: NextRequest
): BranchType | null {
  const value = request.cookies.get(AUTH_BRANCH_TYPE_COOKIE)?.value

  if (value === "main" || value === "sub") {
    return value
  }

  return null
}

export function setAuthBranchTypeCookie(branchType: BranchType): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_BRANCH_TYPE_COOKIE}=${branchType}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function clearAuthBranchTypeCookie(): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${AUTH_BRANCH_TYPE_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
