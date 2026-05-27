"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, RefreshCwIcon, SaveIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorFormFields } from "@/presentation/components/translators/TranslatorFormFields"
import { useEditTranslatorViewModel } from "@/presentation/viewmodels/translators/useEditTranslatorViewModel"

type EditTranslatorScreenProps = {
  translatorId: string
  getTranslatorsUseCase: GetTranslatorsUseCase
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
          {Array.from({ length: 4 }).map((_, index) => (
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

export function EditTranslatorScreen({
  translatorId,
  getTranslatorsUseCase,
}: EditTranslatorScreenProps) {
  const router = useRouter()
  const viewModel = useEditTranslatorViewModel(translatorId, getTranslatorsUseCase)
  const { state, form } = viewModel

  const goBack = () => {
    router.back()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/translators">
                    Translators
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Translator</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingState /> : null}

        {state.isNotFound ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Translator not found</CardTitle>
                <CardDescription>
                  The translator you are looking for does not exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/translators")}
                >
                  <ArrowLeftIcon />
                  Back to translators
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isError && !state.isReady ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/translators")}
                >
                  <ArrowLeftIcon />
                  Back to translators
                </Button>
                <Button onClick={() => router.refresh()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isReady || state.isSaving || state.isSaved ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex items-center justify-between pt-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal">
                  Edit Translator
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update the translator information.
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
                    Translator updated successfully.
                  </p>
                  <Button size="sm" variant="outline" onClick={goBack}>
                    Back to translator
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
                <CardTitle>Translator Details</CardTitle>
                <CardDescription>
                  Modify the translator details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TranslatorFormFields
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
                    <Button
                      type="submit"
                      disabled={state.isSaving || state.isSaved}
                    >
                      {state.isSaving ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <SaveIcon />
                      )}
                      {state.isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </TranslatorFormFields>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
