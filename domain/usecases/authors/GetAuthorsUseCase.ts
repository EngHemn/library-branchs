import type { Author } from "@/domain/entities/author/Author"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import type {
  AuthorManagementRepository,
  CreateAuthorInput,
  UpdateAuthorInput,
} from "@/domain/repositories/AuthorManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetAuthorsUseCase {
  constructor(
    private readonly authorManagementRepository: AuthorManagementRepository
  ) {}

  getAuthors(): Promise<Result<Author[]>> {
    return this.authorManagementRepository.getAuthors()
  }

  getAuthorById(authorId: string): Promise<Result<AuthorDetail | null>> {
    return this.authorManagementRepository.getAuthorById(authorId)
  }

  createAuthor(input: CreateAuthorInput): Promise<Result<Author>> {
    return this.authorManagementRepository.createAuthor(input)
  }

  updateAuthor(input: UpdateAuthorInput): Promise<Result<Author>> {
    return this.authorManagementRepository.updateAuthor(input)
  }

  deleteAuthor(authorId: string): Promise<Result<null>> {
    return this.authorManagementRepository.deleteAuthor(authorId)
  }
}
