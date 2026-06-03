"use client"

import { Building2Icon, CalendarIcon, PhoneIcon } from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"

type BillSummaryCardsProps = {
  bill: BillDetail
}

export function BillSummaryCards({ bill }: BillSummaryCardsProps) {
  const items = [
    {
      icon: Building2Icon,
      label: "Branch",
      value: bill.branchName,
    },
    {
      icon: CalendarIcon,
      label: "Bill Date",
      value: bill.billDate,
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: bill.phoneNumber,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="rounded-lg">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <item.icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
