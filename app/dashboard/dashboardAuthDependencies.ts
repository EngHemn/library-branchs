import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)

export const dashboardAuthUseCase = new AuthUseCase(authRepository)
