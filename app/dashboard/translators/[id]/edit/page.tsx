"use client"

import { use } from "react"

import { TranslatorManagementFakeDataSource } from "@/data/datasources/TranslatorManagementFakeDataSource"
import { TranslatorManagementRepositoryImpl } from "@/data/repositories/TranslatorManagementRepositoryImpl"
import { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { EditTranslatorScreen } from "@/presentation/screens/translators/EditTranslatorScreen"

type EditTranslatorPageProps = {
  params: Promise<{
    id: string
  }>
}

const translatorManagementFakeDataSource = new TranslatorManagementFakeDataSource()
const translatorManagementRepository = new TranslatorManagementRepositoryImpl(
  translatorManagementFakeDataSource
)
const getTranslatorsUseCase = new GetTranslatorsUseCase(translatorManagementRepository)

export default function EditTranslatorPage({ params }: EditTranslatorPageProps) {
  const { id } = use(params)

  return (
    <EditTranslatorScreen
      translatorId={id}
      getTranslatorsUseCase={getTranslatorsUseCase}
    />
  )
}
