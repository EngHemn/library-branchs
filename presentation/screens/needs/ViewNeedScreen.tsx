"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeftIcon,
  CheckIcon,
  FileTextIcon,
  HistoryIcon,
  MessageSquareIcon,
  PaperclipIcon,
  PencilIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { NeedActivityLogTab } from "@/presentation/components/needs/NeedActivityLogTab"
import { NeedAttachmentsTab } from "@/presentation/components/needs/NeedAttachmentsTab"
import { NeedDetailsTab } from "@/presentation/components/needs/NeedDetailsTab"
import { NeedNotesTab } from "@/presentation/components/needs/NeedNotesTab"
import { NeedPriorityBadge } from "@/presentation/components/needs/NeedPriorityBadge"
import { NeedRejectDialog } from "@/presentation/components/needs/NeedRejectDialog"
import { NeedStatusBadge } from "@/presentation/components/needs/NeedStatusBadge"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useNeedDetailViewModel } from "@/presentation/viewmodels/needs/useNeedDetailViewModel"

type ViewNeedScreenProps = {
  needId: string
  authUseCase: AuthUseCase
  needManagementUseCase: NeedManagementUseCase
}

const needDetailTabs = ["details", "notes", "attachments", "activity"] as const
type NeedDetailTab = (typeof needDetailTabs)[number]

function parseNeedDetailTab(tab: string | null): NeedDetailTab {
  if (tab && needDetailTabs.includes(tab as NeedDetailTab)) {
    return tab as NeedDetailTab
  }
  return "details"
}

export function ViewNeedScreen({
  needId,
  authUseCase,
  needManagementUseCase,
}: ViewNeedScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewModel = useNeedDetailViewModel(
    needId,
    authUseCase,
    needManagementUseCase
  )
  const { state } = viewModel
  const [activeTab, setActiveTab] = useState<NeedDetailTab>(() =>
    parseNeedDetailTab(searchParams.get("tab"))
  )

  useEffect(() => {
    setActiveTab(parseNeedDetailTab(searchParams.get("tab")))
  }, [searchParams])

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Needs Management", href: dashboardPaths.needs.list },
    { label: state.need?.name ?? "Need Details" },
  ])

  if (state.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <Skeleton className="mt-4 h-8 w-64" />
        <Skeleton className="h-10 w-full max-w-xl" />
        <Skeleton className="min-h-80 rounded-lg" />
      </div>
    )
  }

  if (state.status === "not_found") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg">
          <CardHeader>
            <CardTitle>Need request not found</CardTitle>
            <CardDescription>
              The requested need could not be found or may have been deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(dashboardPaths.needs.list)}>
              <ArrowLeftIcon />
              Back to Needs
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!state.need) return null

  const need = state.need

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{need.name}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <NeedStatusBadge status={need.status} />
            <NeedPriorityBadge priority={need.priority} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void viewModel.reload()}
          >
            <RefreshCwIcon />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(dashboardPaths.needs.list)}
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <Button
            size="sm"
            onClick={() => router.push(dashboardPaths.needs.edit(needId))}
          >
            <PencilIcon />
            Edit
          </Button>
          {need.status === "pending" ? (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={state.isApproving}
                onClick={() => void viewModel.approveNeed()}
              >
                <CheckIcon />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={state.isRejecting}
                onClick={viewModel.openRejectDialog}
              >
                <XIcon />
                Reject
              </Button>
            </>
          ) : null}
        </div>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as NeedDetailTab)}
      >
        <TabsList className="h-auto flex-wrap gap-1">
          <TabsTrigger value="details">
            <FileTextIcon className="size-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquareIcon className="size-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="attachments">
            <PaperclipIcon className="size-4" />
            Attachments
          </TabsTrigger>
          <TabsTrigger value="activity">
            <HistoryIcon className="size-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-5">
          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <NeedDetailsTab need={need} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <NeedNotesTab comments={need.comments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="mt-5">
          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <NeedAttachmentsTab attachments={need.attachments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <Card className="rounded-lg">
            <CardContent className="pt-6">
              <NeedActivityLogTab activityLog={need.activityLog} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NeedRejectDialog
        open={state.rejectNeedDialog}
        needName={need.name}
        reason={state.rejectReason}
        error={state.rejectError}
        isRejecting={state.isRejecting}
        onReasonChange={viewModel.setRejectReason}
        onClose={viewModel.closeRejectDialog}
        onConfirm={() => void viewModel.confirmRejectNeed()}
      />
    </div>
  )
}
