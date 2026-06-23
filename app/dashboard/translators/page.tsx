"use client"

import { TranslatorManagementFakeDataSource } from "@/data/datasources/TranslatorManagementFakeDataSource"
import { TranslatorManagementRepositoryImpl } from "@/data/repositories/TranslatorManagementRepositoryImpl"
import { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorsScreen } from "@/presentation/screens/translators/TranslatorsScreen"

const translatorManagementFakeDataSource =
  new TranslatorManagementFakeDataSource()
const translatorManagementRepository = new TranslatorManagementRepositoryImpl(
  translatorManagementFakeDataSource
)
const getTranslatorsUseCase = new GetTranslatorsUseCase(
  translatorManagementRepository
)

export default function Page() {
  return <TranslatorsScreen getTranslatorsUseCase={getTranslatorsUseCase} />
}
