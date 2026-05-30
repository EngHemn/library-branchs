import { fakeAuthors } from "@/data/fake/fakeAuthors"

export function getAuthorViewHref(name: string): string | null {
  const author = fakeAuthors.find((item) => item.name === name)

  if (!author) {
    return null
  }

  return `/dashboard/authors/${author.id}`
}
