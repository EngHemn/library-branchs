import { fakeTranslators } from "@/data/fake/fakeTranslators"

export function getTranslatorViewHref(name: string | null): string | null {
  if (!name) {
    return null
  }

  const translator = fakeTranslators.find((item) => item.name === name)

  if (!translator) {
    return null
  }

  return `/dashboard/translators/${translator.id}`
}
