"use client"

import { ArrowLeftIcon, LanguagesIcon, PencilIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Translator } from "@/domain/entities/translator/Translator"

type TranslatorDetailHeaderProps = {
  translator: Translator
  onBack: () => void
  onEdit: () => void
}

export function TranslatorDetailHeader({
  translator,
  onBack,
  onEdit,
}: TranslatorDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-24">
        <LanguagesIcon className="size-10 text-muted-foreground" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-normal">
              {translator.name}
            </h1>
            <Badge
              variant="outline"
              className={
                translator.status === "active"
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                  : "border-muted bg-muted text-muted-foreground"
              }
            >
              {translator.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {translator.language}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            Back to Translators
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            Edit Translator
          </Button>
        </div>
      </div>
    </header>
  )
}
