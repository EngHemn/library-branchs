"use client"

import { use } from "react"

import { TranslatorManagementFakeDataSource } from "@/data/datasources/TranslatorManagementFakeDataSource"
import { TranslatorManagementRepositoryImpl } from "@/data/repositories/TranslatorManagementRepositoryImpl"
import { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { ViewTranslatorScreen } from "@/presentation/screens/translators/ViewTranslatorScreen"

type ViewTranslatorPageProps = {
  params: Promise<{
    id: string
  }>
}

const translatorManagementFakeDataSource =
  new TranslatorManagementFakeDataSource()
const translatorManagementRepository = new TranslatorManagementRepositoryImpl(
  translatorManagementFakeDataSource
)
const getTranslatorsUseCase = new GetTranslatorsUseCase(
  translatorManagementRepository
)

export default function ViewTranslatorPage({
  params,
}: ViewTranslatorPageProps) {
  const { id } = use(params)

  return (
    <ViewTranslatorScreen
      translatorId={id}
      getTranslatorsUseCase={getTranslatorsUseCase}
    />
  )
}
