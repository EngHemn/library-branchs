import { TranslatorManagementFakeDataSource } from "@/data/datasources/TranslatorManagementFakeDataSource"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type {
  TranslatorManagementRepository,
  CreateTranslatorInput,
  UpdateTranslatorInput,
} from "@/domain/repositories/TranslatorManagementRepository"
import type { Result } from "@/domain/result/Result"

export class TranslatorManagementRepositoryImpl
  implements TranslatorManagementRepository
{
  constructor(
    private readonly translatorManagementFakeDataSource: TranslatorManagementFakeDataSource
  ) {}

  getTranslators(): Promise<Result<Translator[]>> {
    return this.translatorManagementFakeDataSource.getTranslators()
  }

  getTranslatorById(translatorId: string): Promise<Result<TranslatorDetail | null>> {
    return this.translatorManagementFakeDataSource.getTranslatorById(translatorId)
  }

  createTranslator(input: CreateTranslatorInput): Promise<Result<Translator>> {
    return this.translatorManagementFakeDataSource.createTranslator(input)
  }

  updateTranslator(input: UpdateTranslatorInput): Promise<Result<Translator>> {
    return this.translatorManagementFakeDataSource.updateTranslator(input)
  }

  deleteTranslator(translatorId: string): Promise<Result<null>> {
    return this.translatorManagementFakeDataSource.deleteTranslator(translatorId)
  }
}
