"use client"

import { EyeIcon, LanguagesIcon, PencilIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EntityImage } from "@/components/ui/entity-image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DataTable, type DataTableColumn } from "@/components/ui/data-table"
import type { Translator } from "@/domain/entities/translator/Translator"
import { TranslatorActionButton } from "@/presentation/components/translators/TranslatorActionButton"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type TranslatorsTableProps = {
  translators: Translator[]
  onView: (translator: Translator) => void
  onEdit: (translator: Translator) => void
  onDelete: (translator: Translator) => void
}

type TranslatorColumnKey =
  | "name"
  | "language"
  | "totalBooks"
  | "status"
  | "actions"

export function TranslatorsTable({
  translators,
  onView,
  onEdit,
  onDelete,
}: TranslatorsTableProps) {
  const { t } = useTranslation()

  const statusLabel = (status: Translator["status"]) =>
    status === "active" ? t("common.active") : t("common.inactive")

  const columns: DataTableColumn<Translator, TranslatorColumnKey>[] = [
    {
      key: "name",
      header: t("translators.table.name"),
      sortable: true,
      sortValue: (translator) => translator.name,
      cell: (translator) => (
        <div className="flex items-center gap-3">
          <EntityImage
            src={translator.imageUrl}
            alt={translator.name}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
            imageClassName="rounded-full"
            fallback={
              <LanguagesIcon className="size-5 text-muted-foreground" />
            }
          />
          <span className="font-semibold">{translator.name}</span>
        </div>
      ),
    },
    {
      key: "language",
      header: t("translators.table.language"),
      sortable: true,
      sortValue: (translator) => translator.language,
      cell: (translator) => translator.language,
    },
    {
      key: "totalBooks",
      header: t("translators.table.booksCount"),
      sortable: true,
      sortValue: (translator) => translator.totalBooks,
      cell: (translator) => (
        <Badge
          variant="secondary"
          className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          {t("translators.table.translatedCount", {
            count: translator.totalBooks,
          })}
        </Badge>
      ),
    },
    {
      key: "status",
      header: t("translators.table.status"),
      sortable: true,
      sortValue: (translator) => statusLabel(translator.status),
      cell: (translator) => (
        <Badge
          variant="outline"
          className={
            translator.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabel(translator.status)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("translators.table.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (translator) => (
        <div className="table-action-content">
          <TranslatorActionButton
            icon={EyeIcon}
            label={t("translators.table.viewTranslator")}
            variant="outline"
            onClick={() => onView(translator)}
          />
          <TranslatorActionButton
            icon={PencilIcon}
            label={t("translators.table.editTranslator")}
            variant="outline"
            onClick={() => onEdit(translator)}
          />
          <TranslatorActionButton
            icon={Trash2Icon}
            label={t("translators.table.deleteTranslator")}
            variant="destructive"
            onClick={() => onDelete(translator)}
          />
        </div>
      ),
    },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("translators.table.title")}</CardTitle>
        <CardDescription>
          {t("translators.table.recordCount", {
            count: translators.length.toLocaleString(),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={translators}
          columns={columns}
          getRowId={(translator) => translator.id}
          emptyTitle={t("translators.table.emptyTitle")}
          emptyDescription={t("translators.table.emptyDescription")}
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[800px]"
        />
      </CardContent>
    </Card>
  )
}
