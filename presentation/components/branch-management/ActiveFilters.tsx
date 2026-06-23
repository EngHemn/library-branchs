import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ActiveFilterId = "search" | "type" | "status"

type ActiveFilter = {
  id: ActiveFilterId
  label: string
  value: string
}

type ActiveFiltersProps = {
  filters: ActiveFilter[]
  onClearFilter: (filterId: ActiveFilterId) => void
}

const filterLabelKeys: Record<ActiveFilterId, TranslationKey> = {
  search: "common.search",
  type: "branches.filters.type",
  status: "common.status",
}

function getFilterDisplayValue(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
  filter: ActiveFilter
): string {
  if (filter.id === "type") {
    return t(`branches.types.${filter.value}` as TranslationKey)
  }
  if (filter.id === "status") {
    return t(`common.${filter.value}` as TranslationKey)
  }
  return filter.value
}

export function ActiveFilters({ filters, onClearFilter }: ActiveFiltersProps) {
  const { t } = useTranslation()

  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("branches.filters.activeFilters")}
      </span>
      {filters.map((filter) => {
        const label = t(filterLabelKeys[filter.id])
        const displayValue = getFilterDisplayValue(t, filter)

        return (
          <Badge
            key={filter.id}
            variant="secondary"
            className="h-7 rounded-lg pr-1"
          >
            <span className="font-medium">{label}:</span>
            <span>{displayValue}</span>
            <button
              type="button"
              aria-label={t("branches.filters.clearFilter", { label })}
              className="ml-0.5 inline-flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => onClearFilter(filter.id)}
            >
              <XIcon className="size-3" />
            </button>
          </Badge>
        )
      })}
    </div>
  )
}
