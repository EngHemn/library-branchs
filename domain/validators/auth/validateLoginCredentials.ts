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

  return {
    success: true,
    data: credentials,
  }
}
