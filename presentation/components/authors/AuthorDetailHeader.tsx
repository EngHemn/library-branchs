"use client"

import { ArrowLeftIcon, PencilIcon, UserRoundIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Author } from "@/domain/entities/author/Author"

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
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-24">
        <UserRoundIcon className="size-10 text-muted-foreground" />
      </div>
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
              {author.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {author.nationality} · Born {author.dateOfBirth}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            Back to Authors
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            Edit Author
          </Button>
        </div>
      </div>
    </header>
  )
}
