"use client"

import type { FormEvent } from "react"
import { LogIn, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

type LoginFormProps = {
  username: string
  password: string
  isLoading: boolean
  canLogout: boolean
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => Promise<void>
  onLogout: () => Promise<void>
}

export function LoginForm({
  username,
  password,
  isLoading,
  canLogout,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onLogout,
}: LoginFormProps) {
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
          Sign in
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
            Sign out
          </Button>
        )}
      </FieldGroup>
    </form>
  )
}
