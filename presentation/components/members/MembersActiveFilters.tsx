import { XIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type {
  MemberActiveFilter,
  MemberActiveFilterId,
} from "@/presentation/viewmodels/members/useMembersViewModel"

type MembersActiveFiltersProps = {
  filters: MemberActiveFilter[]
  onClearFilter: (filterId: MemberActiveFilterId) => void
}

export function MembersActiveFilters({
  filters,
  onClearFilter,
}: MembersActiveFiltersProps) {
  if (filters.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters</span>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="h-7 rounded-lg pr-1"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            type="button"
            aria-label={`Clear ${filter.label} filter`}
            className="ml-0.5 inline-flex size-5 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => onClearFilter(filter.id)}
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
