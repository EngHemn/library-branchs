"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import { AuthorBooksTable } from "@/presentation/components/authors/AuthorBooksTable"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type AuthorBooksTabsProps = {
  author: AuthorDetail
}

export function AuthorBooksTabs({ author }: AuthorBooksTabsProps) {
  const { t } = useTranslation()
  const hasTranslatedBooks = author.translatedBooks.length > 0

  if (!hasTranslatedBooks) {
    return (
      <AuthorBooksTable
        title={t("authors.books.authoredTitle")}
        description={t("authors.books.recordCount", {
          count: author.authoredBooks.length.toLocaleString(),
        })}
        books={author.authoredBooks}
        emptyDescription={t("authors.books.emptyAuthored")}
      />
    )
  }

  return (
    <Tabs defaultValue="authored" className="w-full">
      <TabsList>
        <TabsTrigger value="authored">
          {t("authors.books.authoredTab", {
            count: author.authoredBooks.length,
          })}
        </TabsTrigger>
        <TabsTrigger value="translated">
          {t("authors.books.translatedTab", {
            count: author.translatedBooks.length,
          })}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="authored" className="mt-4">
        <AuthorBooksTable
          title={t("authors.books.authoredTitle")}
          description={t("authors.books.recordCount", {
            count: author.authoredBooks.length.toLocaleString(),
          })}
          books={author.authoredBooks}
          emptyDescription={t("authors.books.emptyAuthored")}
        />
      </TabsContent>
      <TabsContent value="translated" className="mt-4">
        <AuthorBooksTable
          title={t("authors.books.translatedTitle")}
          description={t("authors.books.recordCount", {
            count: author.translatedBooks.length.toLocaleString(),
          })}
          books={author.translatedBooks}
          showAuthorColumn
          emptyDescription={t("authors.books.emptyTranslated")}
        />
      </TabsContent>
    </Tabs>
  )
}
