import { AuthorManagementFakeDataSource } from "@/data/datasources/AuthorManagementFakeDataSource"
import type { Author } from "@/domain/entities/author/Author"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type {
  AuthorManagementRepository,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "@/domain/repositories/AuthorManagementRepository"
import type { Result } from "@/domain/result/Result"

export class AuthorManagementRepositoryImpl implements AuthorManagementRepository {
  constructor(
    private readonly authorManagementFakeDataSource: AuthorManagementFakeDataSource
  ) {}

  getAuthors(): Promise<Result<Author[]>> {
    return this.authorManagementFakeDataSource.getAuthors()
  }

  getAuthorById(authorId: string): Promise<Result<AuthorDetail | null>> {
    return this.authorManagementFakeDataSource.getAuthorById(authorId)
  }

  createAuthor(input: CreateAuthorInput): Promise<Result<Author>> {
    return this.authorManagementFakeDataSource.createAuthor(input)
  }

  updateAuthor(input: UpdateAuthorInput): Promise<Result<Author>> {
    return this.authorManagementFakeDataSource.updateAuthor(input)
  }

  deleteAuthor(authorId: string): Promise<Result<null>> {
    return this.authorManagementFakeDataSource.deleteAuthor(authorId)
  }
}
