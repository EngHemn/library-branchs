import type { User } from "@/domain/entities/User"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"

export const AUTH_SESSION_STORAGE_KEY = "liba.auth.current-user"

type UserShape = {
  id: string
  username: string
  fullName: string
  role: string
  branchType: "main" | "sub"
  branchId?: string
}

function isUserShape(value: unknown): value is UserShape {
  const record = value as Record<string, unknown>
  const branchType = record.branchType

  return (
    typeof value === "object" &&
    value !== null &&
    typeof record.id === "string" &&
    typeof record.username === "string" &&
    typeof record.fullName === "string" &&
    typeof record.role === "string" &&
    (branchType === "main" || branchType === "sub")
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
      branchId: resolveUserBranchId({
        branchType: parsedUser.branchType,
        branchId: parsedUser.branchId,
      }),
    }
  } catch {
    return null
  }
}
