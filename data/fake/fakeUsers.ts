import type { User } from "@/domain/entities/User"

export type FakeUser = User & {
  password: string
}

export const fakeUsers: FakeUser[] = [
  {
    id: "user-1",
    username: "hemn",
    password: "1234",
    branchType: "main",
    branchId: "BR-001",
    fullName: "Hemn Software",
    role: "admin",
  },
  {
    id: "user-2",
    username: "hemn",
    password: "1234",
    branchType: "sub",
    branchId: "BR-002",
    fullName: "Hemn Software",
    role: "sub_branch_admin",
  },
]
