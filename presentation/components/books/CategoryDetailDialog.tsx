"use client"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getCategoryByName } from "@/lib/categoryLookup"

type CategoryDetailDialogProps = {
  categoryName: string | null
  bookCount: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoryDetailDialog({
  categoryName,
  bookCount,
  open,
  onOpenChange,
}: CategoryDetailDialogProps) {
  const category = categoryName ? getCategoryByName(categoryName) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoryName ?? "Category"}</DialogTitle>
          <DialogDescription>
            Category details for books in this branch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {category ? (
            <>
              <div>
                <p className="text-sm text-muted-foreground">ID</p>
                <p className="mt-0.5 font-mono text-sm">{category.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="mt-0.5 text-sm">{category.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={category.status === "active" ? "default" : "outline"}
                  >
                    {category.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No detailed category record is available for this name.
            </p>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Books in branch</p>
            <p className="mt-0.5 text-lg font-semibold">
              {bookCount.toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
