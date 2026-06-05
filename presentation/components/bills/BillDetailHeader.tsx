"use client"

import { PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"

type BillDetailHeaderProps = {
  bill: BillDetail
  onEdit: () => void
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function BillDetailHeader({ bill, onEdit }: BillDetailHeaderProps) {
  return (
    <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-xs text-muted-foreground">{bill.id}</p>
        <h1 className="text-2xl font-bold tracking-normal">{bill.companyName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Import bill for {bill.branchName} · {bill.billDate}
        </p>
        <p className="mt-2 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          {formatPrice(bill.price)}
        </p>
      </div>
      <Button variant="outline" onClick={onEdit}>
        <PencilIcon />
        Edit Bill
      </Button>
    </section>
  )
}
