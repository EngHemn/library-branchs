import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { User } from "@/domain/entities/User"
import type { AuthRepository } from "@/domain/repositories/AuthRepository"
import type { Result } from "@/domain/result/Result"
import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authFakeDataSource: AuthFakeDataSource) {}

  login(credentials: LoginCredentials): Promise<Result<User>> {
    return this.authFakeDataSource.login(credentials)
  }

  logout(): Promise<Result<null>> {
    return this.authFakeDataSource.logout()
  }

  getCurrentUser(): Promise<Result<User | null>> {
    return this.authFakeDataSource.getCurrentUser()
  }
}
