"use client"

import { RotateCcwIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type StockFiltersProps = {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedSubBranchId: string | null
  onSubBranchChange: (id: string | null) => void
  selectedCategory: string | null
  onCategoryChange: (cat: string | null) => void
  showLowStock: boolean
  onShowLowStockChange: (val: boolean) => void
  showOutOfStock: boolean
  onShowOutOfStockChange: (val: boolean) => void
  availableSubBranches: { id: string; name: string }[]
  availableCategories: string[]
  showSubBranchFilter: boolean
}

type StockStatusFilter = "all" | "low_stock" | "out_of_stock"

const STOCK_STATUS_VALUES = new Set<string>([
  "all",
  "low_stock",
  "out_of_stock",
])
function isStockStatusFilter(value: string): value is StockStatusFilter {
  return STOCK_STATUS_VALUES.has(value)
}

export function StockFilters({
  searchQuery,
  onSearchChange,
  selectedSubBranchId,
  onSubBranchChange,
  selectedCategory,
  onCategoryChange,
  showLowStock,
  onShowLowStockChange,
  showOutOfStock,
  onShowOutOfStockChange,
  availableSubBranches,
  availableCategories,
  showSubBranchFilter,
}: StockFiltersProps) {
  const { t } = useTranslation()

  const statusFilterValue: StockStatusFilter = showOutOfStock
    ? "out_of_stock"
    : showLowStock
      ? "low_stock"
      : "all"

  function handleStatusChange(value: StockStatusFilter) {
    onShowLowStockChange(value === "low_stock")
    onShowOutOfStockChange(value === "out_of_stock")
  }

  const canReset =
    searchQuery !== "" ||
    selectedSubBranchId !== null ||
    selectedCategory !== null ||
    showLowStock ||
    showOutOfStock

  function handleReset() {
    onSearchChange("")
    onSubBranchChange(null)
    onCategoryChange(null)
    onShowLowStockChange(false)
    onShowOutOfStockChange(false)
  }

  const gridClassName = showSubBranchFilter
    ? "grid gap-3 lg:grid-cols-[minmax(200px,1fr)_180px_160px_160px_auto] lg:items-end"
    : "grid gap-3 lg:grid-cols-[minmax(200px,1fr)_160px_160px_auto] lg:items-end"

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("stock.filters.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={gridClassName}>
          <div className="space-y-2">
            <Label htmlFor="stock-search">{t("common.search")}</Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="stock-search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("stock.filters.searchPlaceholder")}
                className="pl-8"
              />
            </div>
          </div>

          {showSubBranchFilter ? (
            <div className="space-y-2">
              <Label htmlFor="sub-branch-filter">
                {t("stock.table.subBranch")}
              </Label>
              <Select
                value={selectedSubBranchId ?? "all"}
                onValueChange={(v) => onSubBranchChange(v === "all" ? null : v)}
                disabled={availableSubBranches.length === 0}
              >
                <SelectTrigger id="sub-branch-filter" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("common.all")}</SelectItem>
                  {availableSubBranches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="category-filter">{t("stock.table.category")}</Label>
            <Select
              value={selectedCategory ?? "all"}
              onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}
            >
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">
              {t("stock.filters.stockStatus")}
            </Label>
            <Select
              value={statusFilterValue}
              onValueChange={(v) => {
                if (isStockStatusFilter(v)) handleStatusChange(v)
              }}
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="low_stock">
                  {t("stock.filters.lowStock")}
                </SelectItem>
                <SelectItem value="out_of_stock">
                  {t("stock.filters.outOfStock")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!canReset}
            className="w-full lg:w-auto"
          >
            <RotateCcwIcon />
            {t("stock.filters.reset")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
