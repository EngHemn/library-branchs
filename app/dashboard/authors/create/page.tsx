"use client"

import { AuthorManagementFakeDataSource } from "@/data/datasources/AuthorManagementFakeDataSource"
import { AuthorManagementRepositoryImpl } from "@/data/repositories/AuthorManagementRepositoryImpl"
import { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { CreateAuthorScreen } from "@/presentation/screens/authors/CreateAuthorScreen"

const authorManagementFakeDataSource = new AuthorManagementFakeDataSource()
const authorManagementRepository = new AuthorManagementRepositoryImpl(
  authorManagementFakeDataSource
)
const getAuthorsUseCase = new GetAuthorsUseCase(authorManagementRepository)

export default function CreateAuthorPage() {
  return <CreateAuthorScreen getAuthorsUseCase={getAuthorsUseCase} />
}
