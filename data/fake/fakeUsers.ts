import type { LoginType } from "@/domain/entities/LoginType"
import type { User } from "@/domain/entities/User"

export type FakeUser = User & {
  password: string
  loginType: LoginType
}

export const fakeUsers: FakeUser[] = [
  {
    id: "user-1",
    username: "hemn",
    password: "1234",
    loginType: "main",
    branchType: "main",
    branchId: "BR-001",
    fullName: "Hemn Software",
    role: "admin",
  },
  {
    id: "user-2",
    username: "hemn",
    password: "1234",
    loginType: "sub",
    branchType: "sub",
    branchId: "BR-002",
    fullName: "Hemn Software",
    role: "sub_branch_admin",
  },
  {
    id: "user-3",
    username: "hemn",
    password: "1234",
    loginType: "main_no_sub",
    branchType: "main",
    branchId: "BR-011",
    fullName: "Hemn Software",
    role: "admin",
  },
]
