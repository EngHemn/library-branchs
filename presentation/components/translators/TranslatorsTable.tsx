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
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import type { Translator } from "@/domain/entities/translator/Translator"
<<<<<<< HEAD
import { LanguageBadge } from "@/presentation/components/translators/LanguageBadge"
import { TranslatorActionButton } from "@/presentation/components/translators/TranslatorActionButton"
import { TranslatorLink } from "@/presentation/components/translators/TranslatorLink"
=======
import { TranslatorActionButton } from "@/presentation/components/translators/TranslatorActionButton"
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013

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

const statusLabels = {
  active: "active",
  inactive: "inactive",
}

export function TranslatorsTable({
  translators,
  onView,
  onEdit,
  onDelete,
}: TranslatorsTableProps) {
  const columns: DataTableColumn<Translator, TranslatorColumnKey>[] = [
    {
      key: "name",
      header: "Name",
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
<<<<<<< HEAD
          <TranslatorLink
            translatorId={translator.id}
            translatorName={translator.name}
          />
=======
          <span className="font-semibold">{translator.name}</span>
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
        </div>
      ),
    },
    {
      key: "language",
      header: "Language",
      sortable: true,
      sortValue: (translator) => translator.language,
<<<<<<< HEAD
      cell: (translator) => <LanguageBadge language={translator.language} />,
=======
      cell: (translator) => translator.language,
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    },
    {
      key: "totalBooks",
      header: "Books Count",
      sortable: true,
      sortValue: (translator) => translator.totalBooks,
      cell: (translator) => (
        <Badge
          variant="secondary"
          className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        >
          Translated {translator.totalBooks}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortValue: (translator) => statusLabels[translator.status],
      cell: (translator) => (
        <Badge
          variant="outline"
          className={
            translator.status === "active"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
              : "border-muted bg-muted text-muted-foreground"
          }
        >
          {statusLabels[translator.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (translator) => (
        <div className="flex justify-end gap-1">
          <TranslatorActionButton
            icon={EyeIcon}
            label="View"
            variant="outline"
            onClick={() => onView(translator)}
          />
          <TranslatorActionButton
            icon={PencilIcon}
            label="Edit"
            variant="outline"
            onClick={() => onEdit(translator)}
          />
          <TranslatorActionButton
            icon={Trash2Icon}
            label="Delete"
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
        <CardTitle>All Translators</CardTitle>
        <CardDescription>
          {translators.length.toLocaleString()} translator records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={translators}
          columns={columns}
          getRowId={(translator) => translator.id}
          emptyTitle="No translators found"
          emptyDescription="Try changing or clearing the active filters."
          initialSort={{ key: "name", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[800px]"
        />
      </CardContent>
    </Card>
  )
}
