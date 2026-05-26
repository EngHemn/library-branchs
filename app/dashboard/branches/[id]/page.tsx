"use client"

import { use } from "react"

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
    <ViewBranchScreen
      branchId={id}
      branchDetailUseCase={branchDetailUseCase}
    />
  )
}
