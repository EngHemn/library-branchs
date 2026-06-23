"use client"

import { useState } from "react"
import { ArrowRightLeft, Minus, Plus } from "lucide-react"
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
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { StockRow } from "@/domain/entities/stock/Stock"

type TransferStockDialogProps = {
  isOpen: boolean
  stockRow: StockRow | null
  allRows: StockRow[]
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onSubmit: (
    bookId: string,
    fromBranchId: string,
    toBranchId: string,
    quantity: number,
    notes: string
  ) => void
}

export function TransferStockDialog({
  isOpen,
  stockRow,
  allRows,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: TransferStockDialogProps) {
  const [selectedFromId, setSelectedFromId] = useState<string>("")
  const [selectedToId, setSelectedToId] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")

  const uniqueMainBranchRows = allRows.filter((r) => r.subBranchId === null)
  const fromOptions = uniqueMainBranchRows.filter((r) => r.availableStock > 0)
  const fromRow =
    stockRow ??
    uniqueMainBranchRows.find((r) => r.id === selectedFromId) ??
    null
  const selectedFromBranchId = fromRow?.branchId ?? null
  const toOptionsMap = new Map<
    string,
    { branchId: string; branchName: string }
  >()
  for (const row of uniqueMainBranchRows) {
    if (
      row.branchId !== selectedFromBranchId &&
      !toOptionsMap.has(row.branchId)
    ) {
      toOptionsMap.set(row.branchId, {
        branchId: row.branchId,
        branchName: row.branchName,
      })
    }
  }
  const toOptions = Array.from(toOptionsMap.values())
  const maxQuantity = fromRow?.availableStock ?? 0
  const afterFrom = fromRow ? fromRow.currentStock - quantity : 0

  function handleClose() {
    setSelectedFromId("")
    setSelectedToId("")
    setQuantity(1)
    setNotes("")
    onClose()
  }

  function handleSubmit() {
    const from = fromRow?.branchId ?? null
    const book = stockRow?.bookId ?? fromRow?.bookId
    if (!book || !from || !selectedToId) return
    onSubmit(book, from, selectedToId, quantity, notes)
  }

  const isValid = !!(
    fromRow?.branchId &&
    selectedToId &&
    quantity >= 1 &&
    quantity <= maxQuantity
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            Transfer Stock
          </DialogTitle>
          <DialogDescription>
            Move inventory from one branch to another.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {stockRow ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Book</p>
              <p className="font-semibold text-slate-900">
                {stockRow.bookTitle}
              </p>
              <p className="text-xs text-slate-400">{stockRow.isbn}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Book (From Branch)</Label>
              <Combobox
                value={selectedFromId || null}
                onValueChange={(next) => setSelectedFromId(next ?? "")}
                onInputValueChange={() => undefined}
                filter={null}
              >
                <ComboboxInput
                  placeholder="Select source stock..."
                  disabled={false}
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {fromOptions.map((r) => (
                      <ComboboxItem key={r.id} value={r.id}>
                        {r.bookTitle} — {r.branchName} ({r.availableStock}{" "}
                        avail.)
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>From Branch</Label>
              <Input
                readOnly
                value={stockRow?.branchName ?? fromRow?.branchName ?? "—"}
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label>To Branch</Label>
              <Combobox
                value={selectedToId || null}
                onValueChange={(next) => setSelectedToId(next ?? "")}
                onInputValueChange={() => undefined}
                filter={null}
              >
                <ComboboxInput
                  placeholder="Select target..."
                  disabled={false}
                  className="w-full"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {toOptions.map((branch) => (
                      <ComboboxItem
                        key={branch.branchId}
                        value={branch.branchId}
                      >
                        {branch.branchName}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {fromRow && (
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-100 bg-white p-3 text-center">
              <div>
                <p className="text-xs text-slate-500">Available</p>
                <p className="text-lg font-bold text-slate-900">
                  {fromRow.availableStock}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Transferring</p>
                <p className="text-lg font-bold text-blue-600">{quantity}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Remaining</p>
                <p
                  className={`text-lg font-bold ${
                    afterFrom <= fromRow.minStock
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {Math.max(0, afterFrom)}
                </p>
              </div>
            </div>
          )}

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
                max={maxQuantity}
                value={quantity}
                onChange={(e) => {
                  const val = Math.max(
                    1,
                    Math.min(maxQuantity, parseInt(e.target.value) || 1)
                  )
                  setQuantity(val)
                }}
                className="h-9 w-20 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-slate-400">max {maxQuantity}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Reason for transfer..."
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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isValid}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            {isSubmitting ? "Transferring..." : "Transfer Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
