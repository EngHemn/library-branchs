"use client"

import { use } from "react"

import { AuthorManagementFakeDataSource } from "@/data/datasources/AuthorManagementFakeDataSource"
import { AuthorManagementRepositoryImpl } from "@/data/repositories/AuthorManagementRepositoryImpl"
import { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { ViewAuthorScreen } from "@/presentation/screens/authors/ViewAuthorScreen"

type ViewAuthorPageProps = {
  params: Promise<{
    id: string
  }>
}

const authorManagementFakeDataSource = new AuthorManagementFakeDataSource()
const authorManagementRepository = new AuthorManagementRepositoryImpl(
  authorManagementFakeDataSource
)
const getAuthorsUseCase = new GetAuthorsUseCase(authorManagementRepository)

export default function ViewAuthorPage({ params }: ViewAuthorPageProps) {
  const { id } = use(params)

  return <ViewAuthorScreen authorId={id} getAuthorsUseCase={getAuthorsUseCase} />
}
