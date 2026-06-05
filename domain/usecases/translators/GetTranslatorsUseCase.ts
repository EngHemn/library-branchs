import type { Translator } from "@/domain/entities/translator/Translator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type {
  TranslatorManagementRepository,
  CreateTranslatorInput,
  UpdateTranslatorInput,
} from "@/domain/repositories/TranslatorManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetTranslatorsUseCase {
  constructor(
    private readonly translatorManagementRepository: TranslatorManagementRepository
  ) {}

  getTranslators(): Promise<Result<Translator[]>> {
    return this.translatorManagementRepository.getTranslators()
  }

  getTranslatorById(translatorId: string): Promise<Result<TranslatorDetail | null>> {
    return this.translatorManagementRepository.getTranslatorById(translatorId)
  }

  createTranslator(input: CreateTranslatorInput): Promise<Result<Translator>> {
    return this.translatorManagementRepository.createTranslator(input)
  }

  updateTranslator(input: UpdateTranslatorInput): Promise<Result<Translator>> {
    return this.translatorManagementRepository.updateTranslator(input)
  }

  deleteTranslator(translatorId: string): Promise<Result<null>> {
    return this.translatorManagementRepository.deleteTranslator(translatorId)
  }
}
