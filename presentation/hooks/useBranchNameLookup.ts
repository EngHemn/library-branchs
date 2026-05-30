"use client"

import { useEffect, useState } from "react"

import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"

export function useBranchNameLookup(
  branchManagementUseCase: BranchManagementUseCase
): Record<string, string> {
  const [branchNameToId, setBranchNameToId] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false

    void branchManagementUseCase.getBranches().then((result) => {
      if (cancelled || !result.success) {
        return
      }

      setBranchNameToId(
        Object.fromEntries(result.data.map((branch) => [branch.branchName, branch.id]))
      )
    })

    return () => {
      cancelled = true
    }
  }, [branchManagementUseCase])

  return branchNameToId
}
