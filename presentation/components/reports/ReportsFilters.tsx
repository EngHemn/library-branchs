"use client"

import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ReportPeriod } from "@/domain/entities/reports/Reports"
import type {
  ReportBranchFilter,
  ReportBranchFilterOption,
} from "@/presentation/viewmodels/reports/ReportsViewModelState"

type ReportsFiltersProps = {
  period: ReportPeriod
  onPeriodChange: (period: ReportPeriod) => void
  branchId: ReportBranchFilter
  onBranchChange: (branchId: ReportBranchFilter) => void
  branchFilterOptions: ReportBranchFilterOption[]
  showBranchFilter?: boolean
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  periodLabel?: string
  branchName?: string
  generatedAt?: string
}

const periodOptions: { value: ReportPeriod; labelKey: TranslationKey }[] = [
  { value: "7d", labelKey: "reports.periods.7d" as TranslationKey },
  { value: "30d", labelKey: "reports.periods.30d" as TranslationKey },
  { value: "90d", labelKey: "reports.periods.90d" as TranslationKey },
  { value: "ytd", labelKey: "reports.periods.ytd" as TranslationKey },
]

const PERIOD_VALUES = new Set<string>(periodOptions.map((o) => o.value))
function isReportPeriod(value: string): value is ReportPeriod {
  return PERIOD_VALUES.has(value)
}

function formatGeneratedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

function DatePickerField({
  id,
  label,
  value,
  onChange,
  maxDate,
  minDate,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  maxDate?: Date
  minDate?: Date
}) {
  const { t } = useTranslation()
  const selected = value ? parseISO(value) : undefined

  return (
    <div className="w-full sm:w-auto">
      <Label htmlFor={id} className="mb-1.5 block text-sm">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal sm:w-[160px]",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="size-4" />
            {value
              ? format(parseISO(value), "MMM d, yyyy")
              : t("reports.filters.pickDate")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) =>
              onChange(date ? format(date, "yyyy-MM-dd") : "")
            }
            disabled={(date) => {
              if (maxDate && date > maxDate) {
                return true
              }
              if (minDate && date < minDate) {
                return true
              }
              return false
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function ReportsFilters({
  period,
  onPeriodChange,
  branchId,
  onBranchChange,
  branchFilterOptions,
  showBranchFilter = true,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  periodLabel,
  branchName,
  generatedAt,
}: ReportsFiltersProps) {
  const { t } = useTranslation()
  const dateToMax = new Date()
  const dateToMin = dateFrom ? parseISO(dateFrom) : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        {periodLabel ? (
          <p className="text-sm font-medium text-foreground">{periodLabel}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {branchName ? `${branchName} · ` : null}
          {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : null}
          {generatedAt
            ? ` · ${t("reports.filters.generated", { date: formatGeneratedAt(generatedAt) })}`
            : null}
        </p>
      </div>

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2",
          showBranchFilter ? "lg:grid-cols-5" : "lg:grid-cols-4"
        )}
      >
        <div className="w-full">
          <Label htmlFor="report-period" className="mb-1.5 block text-sm">
            {t("reports.filters.quickPeriod")}
          </Label>
          <Select
            value={period}
            onValueChange={(value) => {
              if (isReportPeriod(value)) onPeriodChange(value)
            }}
          >
            <SelectTrigger id="report-period" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showBranchFilter ? (
          <div className="w-full">
            <Label htmlFor="report-branch" className="mb-1.5 block text-sm">
              {t("reports.filters.branch")}
            </Label>
            <Select value={branchId} onValueChange={onBranchChange}>
              <SelectTrigger id="report-branch" className="w-full">
                <SelectValue placeholder={t("reports.filters.currentBranch")} />
              </SelectTrigger>
              <SelectContent>
                {branchFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <DatePickerField
          id="report-date-from"
          label={t("reports.filters.from")}
          value={dateFrom}
          onChange={onDateFromChange}
          maxDate={dateTo ? parseISO(dateTo) : dateToMax}
        />

        <DatePickerField
          id="report-date-to"
          label={t("reports.filters.to")}
          value={dateTo}
          onChange={onDateToChange}
          minDate={dateToMin}
          maxDate={dateToMax}
        />
      </div>
    </div>
  )
}
