"use client"

import { Suspense, use } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import { BranchDetailRepositoryImpl } from "@/data/repositories/BranchDetailRepositoryImpl"
import { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import { ViewBranchScreen } from "@/presentation/screens/branch-management/ViewBranchScreen"

type ViewBranchPageProps = {
  params: Promise<{
    id: string
  }>
}

const branchDetailFakeDataSource = new BranchDetailFakeDataSource()
const branchDetailRepository = new BranchDetailRepositoryImpl(
  branchDetailFakeDataSource
)
const branchDetailUseCase = new BranchDetailUseCase(branchDetailRepository)

export default function ViewBranchPage({ params }: ViewBranchPageProps) {
  const { id } = use(params)

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <Skeleton className="mt-4 h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      }
    >
      <ViewBranchScreen
        branchId={id}
        branchDetailUseCase={branchDetailUseCase}
      />
    </Suspense>
  )
}
