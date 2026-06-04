import type { LoginCredentials } from "@/domain/entities/LoginCredentials"
import type { User } from "@/domain/entities/User"
import type { Result } from "@/domain/result/Result"
import { fakeUsers } from "@/data/fake/fakeUsers"
import {
  clearAuthBranchTypeCookie,
  setAuthBranchTypeCookie,
} from "@/lib/authSessionCookie"
import {
  AUTH_SESSION_STORAGE_KEY,
  readStoredSessionUser,
} from "@/lib/authSession"

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

    return readStoredSessionUser()
  }

  private persistUser(user: User | null): void {
    this.currentUser = user

    if (typeof window === "undefined") {
      return
    }

    if (user) {
      window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user))
      setAuthBranchTypeCookie(user.branchType)
      return
    }

    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY)
    clearAuthBranchTypeCookie()
  }

  async login(credentials: LoginCredentials): Promise<Result<User>> {
    await delay(700)

    const username = credentials.username.trim().toLowerCase()
    const password = credentials.password.trim()
    const branchType = credentials.branchType === "sub" ? "sub" : "main"

    const user = fakeUsers.find(
      (fakeUser) =>
        fakeUser.username.toLowerCase() === username &&
        fakeUser.password === password &&
        fakeUser.branchType === branchType
    )

    if (!user) {
      const accountExists = fakeUsers.some(
        (fakeUser) =>
          fakeUser.username.toLowerCase() === username &&
          fakeUser.password === password
      )

      return {
        success: false,
        error: accountExists
          ? "Invalid credentials for the selected branch type"
          : "Invalid username or password",
      }
    }

    const currentUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      branchType: user.branchType,
      branchId: user.branchId,
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
