"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { LoginForm } from "@/presentation/components/auth/LoginForm"
import { LoginStatusMessage } from "@/presentation/components/auth/LoginStatusMessage"
import { useLoginViewModel } from "@/presentation/viewmodels/auth/useLoginViewModel"

type LoginScreenProps = {
  authUseCase: AuthUseCase
}

export function LoginScreen({ authUseCase }: LoginScreenProps) {
  const router = useRouter()
  const viewModel = useLoginViewModel(authUseCase)

  useEffect(() => {
    if (viewModel.state.status === "success") {
      router.replace("/dashboard")
    }
  }, [router, viewModel.state.status])

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border bg-background shadow-sm lg:grid-cols-[1fr_420px]">
        <div className="hidden flex-col justify-between border-r bg-foreground p-8 text-background lg:flex">
          <div>
            <p className="text-sm font-medium text-background/70">Liba</p>
            <h1 className="mt-6 max-w-md text-3xl font-semibold tracking-normal">
              Secure access for your workspace
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-6 text-background/70">
            Work confidently with a protected workspace built for focused daily
            operations.
          </p>
        </div>
        <div className="flex items-center justify-center p-4 sm:p-8">
          <Card className="w-full max-w-sm rounded-lg">
            <CardHeader>
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Access your account. Demo: username{" "}
                <span className="font-medium text-foreground">hemn</span>, password{" "}
                <span className="font-medium text-foreground">1234</span> — match the
                branch type you select.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {viewModel.state.status === "loading" && (
                <LoginStatusMessage
                  status="loading"
                  message="Checking credentials"
                />
              )}
              {viewModel.state.error && (
                <LoginStatusMessage
                  status="error"
                  message={viewModel.state.error}
                />
              )}
              {viewModel.state.successMessage && (
                <LoginStatusMessage
                  status="success"
                  message={viewModel.state.successMessage}
                />
              )}
              <LoginForm
                username={viewModel.state.username}
                password={viewModel.state.password}
                branchType={viewModel.state.branchType}
                isLoading={viewModel.state.isLoading}
                canLogout={viewModel.state.user !== null}
                onUsernameChange={viewModel.updateUsername}
                onPasswordChange={viewModel.updatePassword}
                onBranchTypeChange={viewModel.updateBranchType}
                onSubmit={viewModel.submit}
                onLogout={viewModel.logout}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
