"use client"

import { RotateCcwIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type StockFiltersProps = {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedMainBranchId: string | null
  onMainBranchChange: (id: string | null) => void
  selectedSubBranchId: string | null
  onSubBranchChange: (id: string | null) => void
  selectedCategory: string | null
  onCategoryChange: (cat: string | null) => void
  showLowStock: boolean
  onShowLowStockChange: (val: boolean) => void
  showOutOfStock: boolean
  onShowOutOfStockChange: (val: boolean) => void
  availableMainBranches: { id: string; name: string }[]
  availableSubBranches: { id: string; name: string }[]
  availableCategories: string[]
}

type StockStatusFilter = "all" | "low_stock" | "out_of_stock"

export function StockFilters({
  searchQuery,
  onSearchChange,
  selectedMainBranchId,
  onMainBranchChange,
  selectedSubBranchId,
  onSubBranchChange,
  selectedCategory,
  onCategoryChange,
  showLowStock,
  onShowLowStockChange,
  showOutOfStock,
  onShowOutOfStockChange,
  availableMainBranches,
  availableSubBranches,
  availableCategories,
}: StockFiltersProps) {
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
    selectedMainBranchId !== null ||
    selectedSubBranchId !== null ||
    selectedCategory !== null ||
    showLowStock ||
    showOutOfStock

  function handleReset() {
    onSearchChange("")
    onMainBranchChange(null)
    onSubBranchChange(null)
    onCategoryChange(null)
    onShowLowStockChange(false)
    onShowOutOfStockChange(false)
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[minmax(200px,1fr)_180px_180px_160px_160px_auto] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="stock-search">Search</Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="stock-search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search book or ISBN..."
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="main-branch-filter">Main Branch</Label>
            <Select
              value={selectedMainBranchId ?? "all"}
              onValueChange={(v) => onMainBranchChange(v === "all" ? null : v)}
            >
              <SelectTrigger id="main-branch-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableMainBranches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sub-branch-filter">Sub Branch</Label>
            <Select
              value={selectedSubBranchId ?? "all"}
              onValueChange={(v) => onSubBranchChange(v === "all" ? null : v)}
              disabled={availableSubBranches.length === 0}
            >
              <SelectTrigger id="sub-branch-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableSubBranches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={selectedCategory ?? "all"}
              onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}
            >
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Stock Status</Label>
            <Select
              value={statusFilterValue}
              onValueChange={(v) =>
                handleStatusChange(v as StockStatusFilter)
              }
            >
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
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
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
