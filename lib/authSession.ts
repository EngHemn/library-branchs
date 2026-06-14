import type { User } from "@/domain/entities/User"
import type { LoginType } from "@/domain/entities/LoginType"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"

export const AUTH_SESSION_STORAGE_KEY = "liba.auth.current-user"

type UserShape = {
  id: string
  username: string
  fullName: string
  role: string
  branchType: "main" | "sub"
  loginType?: LoginType
  branchId?: string
}

function isLoginType(value: string): value is LoginType {
  return value === "main" || value === "main_no_sub" || value === "sub"
}

function resolveLoginType(
  branchType: UserShape["branchType"],
  loginType: LoginType | undefined
): LoginType {
  if (loginType && isLoginType(loginType)) {
    return loginType
  }

  return branchType === "sub" ? "sub" : "main"
}

function isUserShape(value: unknown): value is UserShape {
  const record = value as Record<string, unknown>
  const branchType = record.branchType
  const loginType = record.loginType

  return (
    typeof value === "object" &&
    value !== null &&
    typeof record.id === "string" &&
    typeof record.username === "string" &&
    typeof record.fullName === "string" &&
    typeof record.role === "string" &&
    (branchType === "main" || branchType === "sub") &&
    (loginType === undefined ||
      loginType === "main" ||
      loginType === "main_no_sub" ||
      loginType === "sub")
  )
}

export function readStoredSessionUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const storedUser = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    const parsedUser: unknown = JSON.parse(storedUser)

    if (!isUserShape(parsedUser)) {
      return null
    }

    return {
      id: parsedUser.id,
      username: parsedUser.username,
      fullName: parsedUser.fullName,
      role: parsedUser.role,
      branchType: parsedUser.branchType,
      loginType: resolveLoginType(parsedUser.branchType, parsedUser.loginType),
      branchId: resolveUserBranchId({
        branchType: parsedUser.branchType,
        branchId: parsedUser.branchId,
      }),
    }
  } catch {
    return null
  }
}
