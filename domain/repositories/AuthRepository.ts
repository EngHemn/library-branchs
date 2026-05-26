import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { User } from "@/domain/entities/User"
import type { Result } from "@/domain/result/Result"

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<Result<User>>
  logout(): Promise<Result<null>>
  getCurrentUser(): Promise<Result<User | null>>
}
