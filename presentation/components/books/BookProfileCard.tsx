"use client"

import Link from "next/link"
import { UserRoundIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { BookDetail } from "@/domain/entities/book/BookDetail"

type BookProfileCardProps = {
  book: BookDetail
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

type ProfileRow = {
  label: string
  value: string
}

export function BookProfileCard({ book }: BookProfileCardProps) {
  const rows: ProfileRow[] = [
    { label: "ID", value: book.id },
    { label: "ISBN", value: book.isbn },
    { label: "Author", value: book.author },
    { label: "Translator", value: book.translator ?? "—" },
    { label: "Category", value: book.category },
    { label: "Language", value: book.language },
    { label: "Pages", value: book.pages.toLocaleString() },
    { label: "Publication Date", value: book.publicationDate },
    { label: "First Added Branch", value: book.firstAddedBranch },
    { label: "Book Created", value: book.createdAt },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Book Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col">
          {rows.map((row, index) => (
            <div key={row.label}>
              {index > 0 ? <Separator /> : null}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="shrink-0 text-sm text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="text-right text-sm font-medium">
                  {row.value}
                </dd>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="shrink-0 text-sm text-muted-foreground">
              Added By
            </dt>
            <dd>
              <Link
                href={`/dashboard/staff/${book.createdBy.staffId}`}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(book.createdBy.staffName)}
                  </AvatarFallback>
                </Avatar>
                {book.createdBy.staffName}
              </Link>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
