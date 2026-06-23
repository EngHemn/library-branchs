"use client"

import { ArrowLeftIcon, PencilIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import {
  formatBillDate,
  formatBillPrice,
  formatBillTime,
} from "@/presentation/components/bills/billDisplay"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BillDetailHeaderProps = {
  bill: BillDetail
  onBack: () => void
  onEdit: () => void
}

export function BillDetailHeader({
  bill,
  onBack,
  onEdit,
}: BillDetailHeaderProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  return (
    <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-mono text-xs text-muted-foreground">{bill.id}</p>
        <h1 className="text-2xl font-bold tracking-normal">
          {bill.companyName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("bills.detail.importBillFor", {
            branchName: bill.branchName,
            date: formatBillDate(bill.billDate, locale),
            time: formatBillTime(bill.billDate, locale),
          })}
        </p>
        <p className="mt-2 text-lg font-semibold text-emerald-700 dark:text-emerald-300">
          {formatBillPrice(bill.price, locale)}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeftIcon />
          {t("common.back")}
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <PencilIcon />
          {t("bills.detail.editBill")}
        </Button>
      </div>
    </section>
  )
}
