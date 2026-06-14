"use client"

import { ArrowLeftIcon, LanguagesIcon, PencilIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import type { Translator } from "@/domain/entities/translator/Translator"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <EntityImage
        src={translator.imageUrl}
        alt={translator.name}
        fill
        sizes="96px"
        className="size-20 rounded-lg sm:size-24"
        imageClassName="rounded-lg"
        fallback={<LanguagesIcon className="size-10 text-muted-foreground" />}
      />
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
              {translator.status === "active"
                ? t("common.active")
                : t("common.inactive")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {translator.language}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeftIcon />
            {t("translators.view.backToTranslators")}
          </Button>
          <Button variant="outline" onClick={onEdit}>
            <PencilIcon />
            {t("translators.view.editTranslator")}
          </Button>
        </div>
      </div>
    </header>
  )
}
