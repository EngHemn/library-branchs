import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { Result } from "@/domain/result/Result"

export function validateLoginCredentials(
  credentials: LoginCredentials
): Result<LoginCredentials> {
  if (!credentials.username.trim() || !credentials.password) {
    return {
      success: false,
      error: "Username and password are required",
    }
  }

  const branchType =
    credentials.branchType === "sub" ? "sub" : credentials.branchType === "main" ? "main" : null

  if (!branchType) {
    return {
      success: false,
      error: "Branch type is required",
    }
  }

  return {
    success: true,
    data: {
      username: credentials.username.trim(),
      password: credentials.password.trim(),
      branchType,
    },
  }
}
