import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { User } from "@/domain/entities/User"
import type { AuthRepository } from "@/domain/repositories/AuthRepository"
import type { Result } from "@/domain/result/Result"
import { validateLoginCredentials } from "@/domain/validators/auth/validateLoginCredentials"

export class AuthUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(credentials: LoginCredentials): Promise<Result<User>> {
    const validationResult = validateLoginCredentials(credentials)

    if (!validationResult.success) {
      return validationResult
    }

    return this.authRepository.login(validationResult.data)
  }

  logout(): Promise<Result<null>> {
    return this.authRepository.logout()
  }

  getCurrentUser(): Promise<Result<User | null>> {
    return this.authRepository.getCurrentUser()
  }

  async isAuthenticated(): Promise<Result<boolean>> {
    const currentUserResult = await this.authRepository.getCurrentUser()

    if (!currentUserResult.success) {
      return currentUserResult
    }

    return {
      success: true,
      data: currentUserResult.data !== null,
    }
  }
}
