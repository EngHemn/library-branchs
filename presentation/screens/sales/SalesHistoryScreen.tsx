"use client"

import Link from "next/link"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

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
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"
import { SalesHistoryTable } from "@/presentation/components/sales/SalesHistoryTable"
import { useSalesHistoryViewModel } from "@/presentation/viewmodels/sales/useSalesHistoryViewModel"

type SalesHistoryScreenProps = {
  salesUseCase: SalesUseCase
}

function LoadingSalesHistory() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function SalesHistoryScreen({ salesUseCase }: SalesHistoryScreenProps) {
  const viewModel = useSalesHistoryViewModel(salesUseCase)
  const { state } = viewModel

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
                  <BreadcrumbLink href="/dashboard/sales">Sales</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sales History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.status === "idle" || state.status === "loading" ? (
          <LoadingSalesHistory />
        ) : null}

        {state.status === "error" ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Sales history unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/sales">
                    <ArrowLeftIcon />
                    Back to sales
                  </Link>
                </Button>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.status === "success" ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-normal">
                  Sales History
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review completed sales for all branches.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Refresh
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/sales">
                    <ArrowLeftIcon />
                    Back to sales
                  </Link>
                </Button>
              </div>
            </section>

            {state.sales.length === 0 ? (
              <Card className="rounded-lg">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No sales have been registered yet.
                </CardContent>
              </Card>
            ) : (
              <SalesHistoryTable sales={state.sales} />
            )}
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
