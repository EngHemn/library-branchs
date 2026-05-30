import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { User } from "@/domain/entities/User"
import type { Result } from "@/domain/result/Result"
import { fakeUsers } from "@/data/fake/fakeUsers"

const AUTH_SESSION_STORAGE_KEY = "liba.auth.current-user"

type UserShape = { id: string; username: string; fullName: string; role: string }

function isUserShape(value: unknown): value is UserShape {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "string" &&
    typeof (value as Record<string, unknown>).username === "string" &&
    typeof (value as Record<string, unknown>).fullName === "string" &&
    typeof (value as Record<string, unknown>).role === "string"
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class AuthFakeDataSource {
  private currentUser: User | null = null

  private readStoredUser(): User | null {
    if (typeof window === "undefined") {
      return this.currentUser
    }

    const storedUser = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY)

    if (!storedUser) {
      return null
    }

    try {
      const parsedUser: unknown = JSON.parse(storedUser)

      if (!isUserShape(parsedUser)) {
        return null
      }

      return {
        id: parsedUser.id,
        username: parsedUser.username,
        fullName: parsedUser.fullName,
        role: parsedUser.role,
      }
    } catch {
      return null
    }
  }

  private persistUser(user: User | null): void {
    this.currentUser = user

    if (typeof window === "undefined") {
      return
    }

    if (user) {
      window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user))
      return
    }

    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
  }

  async login(credentials: LoginCredentials): Promise<Result<User>> {
    await delay(700)

    const user = fakeUsers.find(
      (fakeUser) =>
        fakeUser.username === credentials.username &&
        fakeUser.password === credentials.password
    )

    if (!user) {
      return {
        success: false,
        error: "Invalid username or password",
      }
    }

    const currentUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    }

    this.persistUser(currentUser)

    return {
      success: true,
      data: currentUser,
    }
  }

  async logout(): Promise<Result<null>> {
    await delay(300)

    this.persistUser(null)

    return {
      success: true,
      data: null,
    }
  }

  async getCurrentUser(): Promise<Result<User | null>> {
    await delay(300)

    this.currentUser = this.readStoredUser()

    return {
      success: true,
      data: this.currentUser,
    }
  }
}
