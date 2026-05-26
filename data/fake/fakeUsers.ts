import type { User } from "@/domain/entities/User"

export type FakeUser = User & {
  password: string
}

export const fakeUsers: FakeUser[] = [
  {
    id: "user-1",
    username: "hemn",
    password: "1234",
    fullName: "Hemn Software",
    role: "admin",
  },
]
