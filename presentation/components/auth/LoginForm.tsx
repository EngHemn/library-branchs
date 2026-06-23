"use client"

import type { FormEvent } from "react"
import { LogIn, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { LoginType } from "@/domain/entities/LoginType"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type LoginFormProps = {
  username: string
  password: string
  loginType: LoginType
  isLoading: boolean
  canLogout: boolean
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onLoginTypeChange: (value: LoginType) => void
  onSubmit: () => Promise<void>
  onLogout: () => Promise<void>
}

function isLoginType(value: string): value is LoginType {
  return value === "main" || value === "main_no_sub" || value === "sub"
}

export function LoginForm({
  username,
  password,
  loginType,
  isLoading,
  canLogout,
  onUsernameChange,
  onPasswordChange,
  onLoginTypeChange,
  onSubmit,
  onLogout,
}: LoginFormProps) {
  const { t } = useTranslation()

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    try {
      await onSubmit()
    } catch {
      // Login errors are surfaced via view model state, not thrown to the UI runtime.
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="login-type">{t("auth.loginType")}</FieldLabel>
          <Select
            value={loginType}
            disabled={isLoading}
            onValueChange={(value) => {
              if (isLoginType(value)) {
                onLoginTypeChange(value)
              }
            }}
          >
            <SelectTrigger id="login-type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">{t("auth.mainBranch")}</SelectItem>
              <SelectItem value="main_no_sub">
                {t("auth.mainBranchNoSub")}
              </SelectItem>
              <SelectItem value="sub">{t("auth.subBranch")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="username">{t("auth.username")}</FieldLabel>
          <Input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            disabled={isLoading}
            onChange={(event) => onUsernameChange(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">{t("auth.password")}</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={isLoading}
            onChange={(event) => onPasswordChange(event.target.value)}
          />
        </Field>
        <Button type="submit" className="h-10 w-full" disabled={isLoading}>
          {isLoading ? <Spinner /> : <LogIn />}
          {t("auth.signIn")}
        </Button>
        {canLogout && (
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full"
            disabled={isLoading}
            onClick={onLogout}
          >
            <LogOut />
            {t("auth.signOut")}
          </Button>
        )}
      </FieldGroup>
    </form>
  )
}
