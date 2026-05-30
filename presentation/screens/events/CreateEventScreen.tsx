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
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"
import { EventFormFields } from "@/presentation/components/events/EventFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useCreateEventViewModel } from "@/presentation/viewmodels/events/useCreateEventViewModel"

type CreateEventScreenProps = {
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

export function CreateEventScreen({ getEventsUseCase }: CreateEventScreenProps) {
  const router = useRouter()
  const viewModel = useCreateEventViewModel(getEventsUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Event Management", href: dashboardPaths.events.list },
    { label: "Add Event" },
  ])

  const goBack = () => router.push(dashboardPaths.events.list)

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isReady || state.isSaving || state.isSaved ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Add Event
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new library event and assign participating branches.
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
                  Event created successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to events
                </Button>
              </CardContent>
            </Card>
          ) : null}

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
                Fill in the information for the new event.
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
                      <PlusIcon />
                    )}
                    {state.isSaving ? "Creating..." : "Create Event"}
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
