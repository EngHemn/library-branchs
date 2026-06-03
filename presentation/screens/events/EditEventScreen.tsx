"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, RefreshCwIcon, SaveIcon } from "lucide-react"

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
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import { EventFormFields } from "@/presentation/components/events/EventFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useEditEventViewModel } from "@/presentation/viewmodels/events/useEditEventViewModel"

type EditEventScreenProps = {
  eventId: string
  getEventsUseCase: GetEventsUseCase
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
          {Array.from({ length: 5 }).map((_, index) => (
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

export function EditEventScreen({
  eventId,
  getEventsUseCase,
}: EditEventScreenProps) {
  const router = useRouter()
  const viewModel = useEditEventViewModel(eventId, getEventsUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Event Management", href: dashboardPaths.events.list },
    { label: "Edit Event" },
  ])

  const goBack = () => router.push(dashboardPaths.events.detail(eventId))

  useFormSubmitSuccess(state.isSaved, "Event updated successfully.")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Event not found</CardTitle>
              <CardDescription>
                The event you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeftIcon />
                Back to events
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeftIcon />
                Back to events
              </Button>
              <Button onClick={viewModel.reload}>
                <RefreshCwIcon />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Edit Event
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update event details and branch participation.
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
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Update the information for this event.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventFormFields
                form={form}
                branchOptions={state.branchOptions}
                disabled={state.isSaving || state.isSaved}
                onSubmit={(values) => void viewModel.save(values)}
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
              </EventFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
