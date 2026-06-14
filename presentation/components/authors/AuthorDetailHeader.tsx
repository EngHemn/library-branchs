"use client"

import { ArrowLeftIcon, PencilIcon, UserRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import type { Author } from "@/domain/entities/author/Author"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type AuthorDetailHeaderProps = {
  author: Author
  onBack: () => void
  onEdit: () => void
}

export function AuthorDetailHeader({
  author,
  onBack,
  onEdit,
}: AuthorDetailHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <EntityImage
        src={author.imageUrl}
        alt={author.name}
        fill
        sizes="96px"
        className="size-20 rounded-lg sm:size-24"
        imageClassName="rounded-lg"
        fallback={<UserRoundIcon className="size-10 text-muted-foreground" />}
      />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-normal">
              {author.name}
            </h1>
            <Badge
              variant="outline"
              className={
                author.status === "active"
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                  : "border-muted bg-muted text-muted-foreground"
              }
            >
              {author.status === "active"
                ? t("common.active")
                : t("common.inactive")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("authors.view.bornOn", {
              nationality: author.nationality,
              dateOfBirth: author.dateOfBirth,
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            {t("authors.view.backToAuthors")}
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            {t("authors.view.editAuthor")}
          </Button>
        </div>
      </div>
    </header>
  )
}
