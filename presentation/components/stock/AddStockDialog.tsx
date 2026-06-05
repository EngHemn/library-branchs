"use client"

import { useState } from "react"
import { Minus, Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import type { StockRow } from "@/domain/entities/stock/Stock"

type AddStockDialogProps = {
  isOpen: boolean
  mode: "add" | "reduce"
  stockRow: StockRow | null
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (stockId: string, quantity: number, notes: string) => void
}

export function AddStockDialog({
  isOpen,
  mode,
  stockRow,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: AddStockDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")

  function handleClose() {
    setQuantity(1)
    setNotes("")
    onClose()
  }

  function handleSubmit() {
    if (!stockRow || quantity < 1) return
    onSubmit(stockRow.id, quantity, notes)
  }

  const previewStock =
    stockRow !== null
      ? mode === "add"
        ? stockRow.currentStock + quantity
        : Math.max(0, stockRow.currentStock - quantity)
      : 0

  const isReduce = mode === "reduce"
  const maxReduce = stockRow?.availableStock ?? 0

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isReduce ? (
              <Minus className="h-5 w-5 text-orange-500" />
            ) : (
              <Plus className="h-5 w-5 text-emerald-600" />
            )}
            {isReduce ? "Reduce Stock" : "Add Stock"}
          </DialogTitle>
          <DialogDescription>
            {isReduce
              ? "Remove units from this stock record."
              : "Add new units to this stock record."}
          </DialogDescription>
        </DialogHeader>

        {stockRow && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Book</p>
              <p className="font-semibold text-slate-900">{stockRow.bookTitle}</p>
              <p className="text-xs text-slate-400">{stockRow.isbn}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-white p-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Current</p>
                <p className="text-lg font-bold text-slate-900">
                  {stockRow.currentStock}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-slate-300">→</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">After</p>
                <p
                  className={`text-lg font-bold ${
                    isReduce && previewStock <= stockRow.minStock
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {previewStock}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={isReduce ? maxReduce : undefined}
                  value={quantity}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 1)
                    setQuantity(isReduce ? Math.min(val, maxReduce) : val)
                  }}
                  className="h-9 w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() =>
                    setQuantity((q) =>
                      isReduce ? Math.min(maxReduce, q + 1) : q + 1
                    )
                  }
                  disabled={isReduce && quantity >= maxReduce}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                {isReduce && (
                  <span className="text-xs text-slate-400">
                    max {maxReduce}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !stockRow}
            className={
              isReduce
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          >
            <Package className="mr-2 h-4 w-4" />
            {isSubmitting
              ? "Saving..."
              : isReduce
                ? "Reduce Stock"
                : "Add Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
