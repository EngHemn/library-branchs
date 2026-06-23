"use client"

import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type TranslatorProfileCardProps = {
  translator: TranslatorDetail
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
  | "language"
  | "branchAdded"
  | "translatorCreated"
  | "status"

export function TranslatorProfileCard({
  translator,
}: TranslatorProfileCardProps) {
  const { t } = useTranslation()

  const rows: { key: ProfileRowKey; value: string }[] = [
    { key: "id", value: translator.id },
    { key: "language", value: translator.language },
    { key: "branchAdded", value: translator.branchName },
    { key: "translatorCreated", value: translator.createdAt },
    {
      key: "status",
      value:
        translator.status === "active"
          ? t("common.active")
          : t("common.inactive"),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("translators.profile.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col">
          {rows.map((row, index) => (
            <div key={row.key}>
              {index > 0 ? <Separator /> : null}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="shrink-0 text-sm text-muted-foreground">
                  {t(`translators.profile.${row.key}`)}
                </dt>
                <dd className="text-right text-sm font-medium">
                  {row.key === "status" ? (
                    <Badge
                      variant="outline"
                      className={
                        translator.status === "active"
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                          : "border-muted bg-muted text-muted-foreground"
                      }
                    >
                      {row.value}
                    </Badge>
                  ) : row.key === "branchAdded" ? (
                    <BranchLink
                      branchId={translator.branchId}
                      branchName={translator.branchName}
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
              {t("translators.profile.addedBy")}
            </dt>
            <dd>
              <Link
                href={`/dashboard/staff/${translator.createdBy.staffId}`}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">
                    {getInitials(translator.createdBy.staffName)}
                  </AvatarFallback>
                </Avatar>
                {translator.createdBy.staffName}
              </Link>
            </dd>
          </div>
          <Separator />
          <div className="py-3">
            <dt className="text-sm text-muted-foreground">
              {t("translators.profile.biography")}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed">
              {translator.biography}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
