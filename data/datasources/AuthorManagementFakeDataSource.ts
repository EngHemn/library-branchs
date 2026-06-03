import { fakeAuthors } from "@/data/fake/fakeAuthors"
import { toAuthorDetail } from "@/data/mappers/authorDetailMapper"
import type { Author } from "@/domain/entities/author/Author"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type {
  CreateAuthorInput,
  UpdateAuthorInput,
} from "@/domain/repositories/AuthorManagementRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let nextAuthorId = 200

export class AuthorManagementFakeDataSource {
  private authors: Author[] = fakeAuthors.map((author) => ({ ...author }))

  async getAuthors(): Promise<Result<Author[]>> {
    await delay(300)
    return { success: true, data: this.authors.map((author) => ({ ...author })) }
  }

  async getAuthorById(authorId: string): Promise<Result<AuthorDetail | null>> {
    await delay(250)
    const author = this.authors.find((item) => item.id === authorId)
    return {
      success: true,
      data: author ? toAuthorDetail({ ...author }) : null,
    }
  }

  async createAuthor(input: CreateAuthorInput): Promise<Result<Author>> {
    await delay(350)
    const newAuthor: Author = {
      id: `AU-${String(nextAuthorId++)}`,
      name: input.name,
      nationality: input.nationality,
      dateOfBirth: input.dateOfBirth,
      biography: input.biography,
      totalBooks: 0,
      status: input.status,
      branchId: "BR-001",
      imageUrl: input.imageUrl ?? null,
    }
    this.authors.push(newAuthor)
    return { success: true, data: { ...newAuthor } }
  }

  async updateAuthor(input: UpdateAuthorInput): Promise<Result<Author>> {
    await delay(350)
    const authorIndex = this.authors.findIndex((item) => item.id === input.id)
    if (authorIndex === -1) {
      return { success: false, error: "Author not found." }
    }

    const currentAuthor = this.authors[authorIndex]
    const updatedAuthor: Author = {
      ...currentAuthor,
      name: input.name,
      nationality: input.nationality,
      dateOfBirth: input.dateOfBirth,
      biography: input.biography,
      status: input.status,
      imageUrl: input.imageUrl ?? currentAuthor.imageUrl ?? null,
    }
    this.authors[authorIndex] = updatedAuthor
    return { success: true, data: { ...updatedAuthor } }
  }

  async deleteAuthor(authorId: string): Promise<Result<null>> {
    await delay(250)
    const exists = this.authors.some((author) => author.id === authorId)
    if (!exists) {
      return { success: false, error: "Author could not be found." }
    }

    this.authors = this.authors.filter((author) => author.id !== authorId)
    return { success: true, data: null }
  }
}
