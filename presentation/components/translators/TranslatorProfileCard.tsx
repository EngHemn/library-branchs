"use client"

import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { TranslatorDetail } from "@/domain/entities/translator/TranslatorDetail"

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

type ProfileRow = {
  label: string
  value: string
}

export function TranslatorProfileCard({ translator }: TranslatorProfileCardProps) {
  const rows: ProfileRow[] = [
    { label: "ID", value: translator.id },
    { label: "Language", value: translator.language },
    { label: "Branch Added", value: translator.branchName },
    { label: "Translator Created", value: translator.createdAt },
    { label: "Status", value: translator.status },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Translator Profile</CardTitle>
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
                  {row.label === "Status" ? (
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
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="shrink-0 text-sm text-muted-foreground">Added By</dt>
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
            <dt className="text-sm text-muted-foreground">Biography</dt>
            <dd className="mt-2 text-sm leading-relaxed">{translator.biography}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
