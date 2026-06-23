"use client"

import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { AuthorDetail } from "@/domain/entities/author/AuthorDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type AuthorProfileCardProps = {
  author: AuthorDetail
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

type ProfileRowKey =
  | "id"
  | "nationality"
  | "dateOfBirth"
  | "branchAdded"
  | "authorCreated"
  | "status"

export function AuthorProfileCard({ author }: AuthorProfileCardProps) {
  const { t } = useTranslation()

  const rows: { key: ProfileRowKey; value: string }[] = [
    { key: "id", value: author.id },
    { key: "nationality", value: author.nationality },
    { key: "dateOfBirth", value: author.dateOfBirth },
    { key: "branchAdded", value: author.branchName },
    { key: "authorCreated", value: author.createdAt },
    {
      key: "status",
      value:
        author.status === "active" ? t("common.active") : t("common.inactive"),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("authors.profile.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col">
          {rows.map((row, index) => (
            <div key={row.key}>
              {index > 0 ? <Separator /> : null}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="shrink-0 text-sm text-muted-foreground">
                  {t(`authors.profile.${row.key}`)}
                </dt>
                <dd className="text-right text-sm font-medium">
                  {row.key === "status" ? (
                    <Badge
                      variant="outline"
                      className={
                        author.status === "active"
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                          : "border-muted bg-muted text-muted-foreground"
                      }
                    >
                      {row.value}
                    </Badge>
                  ) : row.key === "branchAdded" ? (
                    <BranchLink
                      branchId={author.branchId}
                      branchName={author.branchName}
                    />
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="shrink-0 text-sm text-muted-foreground">
              {t("authors.profile.addedBy")}
            </dt>
            <dd>
              <Link
                href={`/dashboard/staff/${author.createdBy.staffId}`}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(author.createdBy.staffName)}
                  </AvatarFallback>
                </Avatar>
                {author.createdBy.staffName}
              </Link>
            </dd>
          </div>
          <Separator />
          <div className="py-3">
            <dt className="text-sm text-muted-foreground">
              {t("authors.profile.biography")}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed">{author.biography}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
