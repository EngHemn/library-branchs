"use client"

import { getParentBranchViewHref } from "@/lib/branchLink"
import { BranchAdminLink } from "@/presentation/components/branch-management/BranchAdminLink"
import {
  BranchDetailLink,
  DashboardEntityLink,
} from "@/presentation/components/shared/DashboardEntityLink"

type EventBranchNameCellProps = {
  branchId: string
  branchName: string
  showParentBranch?: boolean
  parentBranchName?: string | null
}

export function EventBranchNameCell({
  branchId,
  branchName,
  showParentBranch = true,
  parentBranchName,
}: EventBranchNameCellProps) {
  const parentHref = showParentBranch ? getParentBranchViewHref(branchId) : null

  return (
    <div className="space-y-0.5">
      <BranchDetailLink branchId={branchId} branchName={branchName} />
      {parentHref && parentBranchName ? (
        <p className="text-xs text-muted-foreground">
          Main branch:{" "}
          <DashboardEntityLink
            href={parentHref}
            className="text-xs font-normal text-muted-foreground hover:text-primary"
          >
            {parentBranchName}
          </DashboardEntityLink>
        </p>
      ) : null}
    </div>
  )
}

type EventCoordinatorCellProps = {
  branchId: string
  coordinatorName: string
}

export function EventCoordinatorCell({
  branchId,
  coordinatorName,
}: EventCoordinatorCellProps) {
  return <BranchAdminLink branchId={branchId} adminName={coordinatorName} />
}
