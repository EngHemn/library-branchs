export const BUILT_IN_LANGUAGES = [
  "English",
  "Kurdish",
  "Arabic",
  "Persian",
  "Turkish",
] as const

export type BuiltInLanguage = (typeof BUILT_IN_LANGUAGES)[number]

export function isBuiltInLanguage(language: string): boolean {
  return BUILT_IN_LANGUAGES.includes(language as BuiltInLanguage)
}
