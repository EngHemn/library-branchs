import type { ValidationKey } from "@/domain/i18n/validationKeys"

export type TranslationKey = ValidationKey | (string & {})

export type TranslateParams = Record<string, string | number>

export type Translate = (
  key: TranslationKey,
  params?: TranslateParams
) => string
