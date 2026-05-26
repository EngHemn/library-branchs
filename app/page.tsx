"use client"

import { AuthFakeDataSource } from "@/data/datasources/AuthFakeDataSource"
import { AuthRepositoryImpl } from "@/data/repositories/AuthRepositoryImpl"
import { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { LoginScreen } from "@/presentation/screens/auth/LoginScreen"

const authFakeDataSource = new AuthFakeDataSource()
const authRepository = new AuthRepositoryImpl(authFakeDataSource)
const authUseCase = new AuthUseCase(authRepository)

export default function Page() {
  return <LoginScreen authUseCase={authUseCase} />
}
