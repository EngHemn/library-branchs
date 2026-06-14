import type { LoginType } from "@/domain/entities/LoginType"

export type LoginCredentials = {
  username: string
  password: string
  loginType: LoginType
}
