"use client"

import Link from "next/link"
import { ArrowLeftIcon, Building2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"

export function MainBranchOnlyScreen() {
  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Access restricted" },
  ])

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
            <Building2Icon className="size-5 text-muted-foreground" />
          </div>
          <CardTitle>Main branch only</CardTitle>
          <CardDescription>
            This page is only available to main branch users. Sub branches do not
            have permission to access branch management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard">
              <ArrowLeftIcon />
              Back to dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
