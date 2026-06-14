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
import { getAuthorViewHref } from "@/lib/authorLink"
import { getTranslatorViewHref } from "@/lib/translatorLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  href?: string | null
}

function ProfileValue({ value, href }: { value: string; href?: string | null }) {
  if (!href) {
    return <span className="text-sm font-medium">{value}</span>
  }

  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {value}
    </Link>
  )
}

export function BookProfileCard({ book }: BookProfileCardProps) {
  const { t } = useTranslation()

  const rows: ProfileRow[] = [
    { label: t("books.profile.id"), value: book.id },
    { label: t("books.profile.isbn"), value: book.isbn },
    {
      label: t("books.profile.author"),
      value: book.author,
      href: getAuthorViewHref(book.author),
    },
    {
      label: t("books.profile.translator"),
      value: book.translator ?? "—",
      href: book.translator ? getTranslatorViewHref(book.translator) : null,
    },
    { label: t("books.profile.category"), value: book.category },
    {
      label: t("books.profile.location"),
      value: book.shelfHint.trim().length > 0 ? book.shelfHint : "—",
    },
    { label: t("books.profile.language"), value: book.language },
    { label: t("books.profile.pages"), value: book.pages.toLocaleString() },
    { label: t("books.profile.publicationDate"), value: book.publicationDate },
    {
      label: t("books.profile.firstAddedBranch"),
      value: book.firstAddedBranch,
      href: `/dashboard/branches/${book.branchId}`,
    },
    { label: t("books.profile.bookCreated"), value: book.createdAt },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("books.profile.title")}</CardTitle>
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
                <dd className="text-right">
                  <ProfileValue value={row.value} href={row.href} />
                </dd>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="shrink-0 text-sm text-muted-foreground">
              {t("books.profile.addedBy")}
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
