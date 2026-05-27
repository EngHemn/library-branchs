import type { Author } from "@/domain/entities/author/Author"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type { Result } from "@/domain/result/Result"

export type CreateAuthorInput = {
  name: string
  nationality: string
  dateOfBirth: string
  status: "active" | "inactive"
  biography: string
}

export type UpdateAuthorInput = CreateAuthorInput & {
  id: string
}

export interface AuthorManagementRepository {
  getAuthors(): Promise<Result<Author[]>>
  getAuthorById(authorId: string): Promise<Result<AuthorDetail | null>>
  createAuthor(input: CreateAuthorInput): Promise<Result<Author>>
  updateAuthor(input: UpdateAuthorInput): Promise<Result<Author>>
  deleteAuthor(authorId: string): Promise<Result<null>>
}
