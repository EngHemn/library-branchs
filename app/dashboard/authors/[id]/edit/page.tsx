"use client"

import { use } from "react"

import { AuthorManagementFakeDataSource } from "@/data/datasources/AuthorManagementFakeDataSource"
import { AuthorManagementRepositoryImpl } from "@/data/repositories/AuthorManagementRepositoryImpl"
import { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { EditAuthorScreen } from "@/presentation/screens/authors/EditAuthorScreen"

type EditAuthorPageProps = {
  params: Promise<{
    id: string
  }>
}

const authorManagementFakeDataSource = new AuthorManagementFakeDataSource()
const authorManagementRepository = new AuthorManagementRepositoryImpl(
  authorManagementFakeDataSource
)
const getAuthorsUseCase = new GetAuthorsUseCase(authorManagementRepository)

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  const { id } = use(params)

  return <EditAuthorScreen authorId={id} getAuthorsUseCase={getAuthorsUseCase} />
}
