"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"
import { MemberFormFields } from "@/presentation/components/members/MemberFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useCreateMemberViewModel } from "@/presentation/viewmodels/members/useCreateMemberViewModel"

type CreateMemberScreenProps = {
  authUseCase: AuthUseCase
  memberManagementUseCase: MemberManagementUseCase
  branchManagementUseCase: BranchManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card className="rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function CreateMemberScreen({
  authUseCase,
  memberManagementUseCase,
  branchManagementUseCase,
}: CreateMemberScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/members"
  const viewModel = useCreateMemberViewModel(
    authUseCase,
    memberManagementUseCase,
    branchManagementUseCase
  )
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Members", href: "/dashboard/members" },
    { label: "Add Member" },
  ])

  const goBack = () => router.push(returnTo)

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.error && !state.isReady ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to members
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Add Member</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Register a new library member.
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </section>

          {state.isSaved ? (
            <Card className="rounded-lg border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardContent className="flex items-center gap-3 py-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Member created successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to members
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {state.error && state.isReady ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {state.error}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Member Details</CardTitle>
              <CardDescription>Fill in the information for the new member.</CardDescription>
            </CardHeader>
            <CardContent>
              <MemberFormFields
                form={form}
                disabled={state.isSaving || state.isSaved}
                onSubmit={viewModel.save}
              >
                <Separator />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={state.isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                    {state.isSaving ? "Creating..." : "Create Member"}
                  </Button>
                </div>
              </MemberFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
