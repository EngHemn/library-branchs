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

  const loginType =
    credentials.loginType === "sub"
      ? "sub"
      : credentials.loginType === "main"
        ? "main"
        : credentials.loginType === "main_no_sub"
          ? "main_no_sub"
          : null

  if (!loginType) {
    return {
      success: false,
      error: "Login type is required",
    }
  }

  return {
    success: true,
    data: {
      username: credentials.username.trim(),
      password: credentials.password.trim(),
      loginType,
    },
  }
}
