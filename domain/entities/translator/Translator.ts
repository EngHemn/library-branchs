export type TranslatorStatus = "active" | "inactive"

export type Translator = {
  id: string
  name: string
  language: string
  totalBooks: number
  status: TranslatorStatus
  branchId: string
}
