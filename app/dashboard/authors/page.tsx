"use client"

import { AuthorManagementFakeDataSource } from "@/data/datasources/AuthorManagementFakeDataSource"
import { AuthorManagementRepositoryImpl } from "@/data/repositories/AuthorManagementRepositoryImpl"
import { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { AuthorsScreen } from "@/presentation/screens/authors/AuthorsScreen"

const authorManagementFakeDataSource = new AuthorManagementFakeDataSource()
const authorManagementRepository = new AuthorManagementRepositoryImpl(
  authorManagementFakeDataSource
)
const getAuthorsUseCase = new GetAuthorsUseCase(authorManagementRepository)

export default function Page() {
  return <AuthorsScreen getAuthorsUseCase={getAuthorsUseCase} />
}
