"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import { AuthorBooksTable } from "@/presentation/components/authors/AuthorBooksTable"

type AuthorBooksTabsProps = {
  author: AuthorDetail
}

export function AuthorBooksTabs({ author }: AuthorBooksTabsProps) {
  const hasTranslatedBooks = author.translatedBooks.length > 0

  if (!hasTranslatedBooks) {
    return (
      <AuthorBooksTable
        title="Authored Books"
        description={`${author.authoredBooks.length.toLocaleString()} book records`}
        books={author.authoredBooks}
        emptyDescription="This author has not authored any books yet."
      />
    )
  }

  return (
    <Tabs defaultValue="authored" className="w-full">
      <TabsList>
        <TabsTrigger value="authored">
          Authored ({author.authoredBooks.length})
        </TabsTrigger>
        <TabsTrigger value="translated">
          Translated ({author.translatedBooks.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="authored" className="mt-4">
        <AuthorBooksTable
          title="Authored Books"
          description={`${author.authoredBooks.length.toLocaleString()} book records`}
          books={author.authoredBooks}
          emptyDescription="This author has not authored any books yet."
        />
      </TabsContent>
      <TabsContent value="translated" className="mt-4">
        <AuthorBooksTable
          title="Translated Books"
          description={`${author.translatedBooks.length.toLocaleString()} book records`}
          books={author.translatedBooks}
          showAuthorColumn
          emptyDescription="This author has not translated any books yet."
        />
      </TabsContent>
    </Tabs>
  )
}
