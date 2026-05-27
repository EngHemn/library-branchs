import type { Translator } from "@/domain/entities/translator/Translator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type { Result } from "@/domain/result/Result"

export type CreateTranslatorInput = {
  name: string
  language: string
  status: "active" | "inactive"
  biography: string
}

export type UpdateTranslatorInput = CreateTranslatorInput & {
  id: string
}

export interface TranslatorManagementRepository {
  getTranslators(): Promise<Result<Translator[]>>
  getTranslatorById(translatorId: string): Promise<Result<TranslatorDetail | null>>
  createTranslator(input: CreateTranslatorInput): Promise<Result<Translator>>
  updateTranslator(input: UpdateTranslatorInput): Promise<Result<Translator>>
  deleteTranslator(translatorId: string): Promise<Result<null>>
}
