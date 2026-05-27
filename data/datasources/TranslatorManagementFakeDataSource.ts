import { fakeTranslators } from "@/data/fake/fakeTranslators"
import { toTranslatorDetail } from "@/data/mappers/translatorDetailMapper"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import type {
  CreateTranslatorInput,
  UpdateTranslatorInput,
} from "@/domain/repositories/TranslatorManagementRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let nextTranslatorId = 200

export class TranslatorManagementFakeDataSource {
  private translators: Translator[] = fakeTranslators.map((translator) => ({
    ...translator,
  }))

  async getTranslators(): Promise<Result<Translator[]>> {
    await delay(300)
    return {
      success: true,
      data: this.translators.map((translator) => ({ ...translator })),
    }
  }

  async getTranslatorById(
    translatorId: string
  ): Promise<Result<TranslatorDetail | null>> {
    await delay(250)
    const translator = this.translators.find((item) => item.id === translatorId)
    return {
      success: true,
      data: translator ? toTranslatorDetail({ ...translator }) : null,
    }
  }

  async createTranslator(input: CreateTranslatorInput): Promise<Result<Translator>> {
    await delay(350)
    const newTranslator: Translator = {
      id: `TR-${String(nextTranslatorId++)}`,
      name: input.name,
      language: input.language,
      biography: input.biography,
      totalBooks: 0,
      status: input.status,
      branchId: "BR-001",
    }
    this.translators.push(newTranslator)
    return { success: true, data: { ...newTranslator } }
  }

  async updateTranslator(input: UpdateTranslatorInput): Promise<Result<Translator>> {
    await delay(350)
    const translatorIndex = this.translators.findIndex(
      (item) => item.id === input.id
    )
    if (translatorIndex === -1) {
      return { success: false, error: "Translator not found." }
    }

    const currentTranslator = this.translators[translatorIndex]
    const updatedTranslator: Translator = {
      ...currentTranslator,
      name: input.name,
      language: input.language,
      biography: input.biography,
      status: input.status,
    }
    this.translators[translatorIndex] = updatedTranslator
    return { success: true, data: { ...updatedTranslator } }
  }

  async deleteTranslator(translatorId: string): Promise<Result<null>> {
    await delay(250)
    const exists = this.translators.some((translator) => translator.id === translatorId)
    if (!exists) {
      return { success: false, error: "Translator could not be found." }
    }

    this.translators = this.translators.filter(
      (translator) => translator.id !== translatorId
    )
    return { success: true, data: null }
  }
}
