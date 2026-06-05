"use client"

import { useRouter } from "next/navigation"
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
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { AuthorFormFields } from "@/presentation/components/authors/AuthorFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useCreateAuthorViewModel } from "@/presentation/viewmodels/authors/useCreateAuthorViewModel"

type CreateAuthorScreenProps = {
  getAuthorsUseCase: GetAuthorsUseCase
}

export function CreateAuthorScreen({ getAuthorsUseCase }: CreateAuthorScreenProps) {
  const router = useRouter()
  const viewModel = useCreateAuthorViewModel(getAuthorsUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Authors", href: "/dashboard/authors" },
    { label: "Add Author" },
  ])

  const goBack = () => router.back()

  useFormSubmitSuccess(state.isSaved, "Author created successfully.")

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Add Author</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a new author to the library.
          </p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeftIcon />
          Back
        </Button>
      </section>

      {state.error ? (
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
          <CardTitle>Author Details</CardTitle>
          <CardDescription>Fill in the information for the new author.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthorFormFields
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
                {state.isSaving ? "Creating..." : "Create Author"}
              </Button>
            </div>
          </AuthorFormFields>
        </CardContent>
      </Card>
    </div>
  )
}
