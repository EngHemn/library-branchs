"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EntityImage } from "@/components/ui/entity-image"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { BillDetailHeader } from "@/presentation/components/bills/BillDetailHeader"
import { BillProductsTable } from "@/presentation/components/bills/BillProductsTable"
import { BillSummaryCards } from "@/presentation/components/bills/BillSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useBillDetailViewModel } from "@/presentation/viewmodels/bills/useBillDetailViewModel"

type ViewBillScreenProps = {
  billId: string
  getBillsUseCase: GetBillsUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="min-h-64 rounded-lg" />
    </div>
  )
}

export function ViewBillScreen({ billId, getBillsUseCase }: ViewBillScreenProps) {
  const router = useRouter()
  const viewModel = useBillDetailViewModel(billId, getBillsUseCase)
  const { t } = useTranslation()
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.bills"), href: "/dashboard/bills" },
    { label: state.bill?.companyName ?? t("bills.view.breadcrumbFallback") },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("bills.notFoundTitle")}</CardTitle>
              <CardDescription>{t("bills.notFoundDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.push("/dashboard/bills")}>
                <ArrowLeftIcon />
                {t("bills.backToBills")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("bills.view.unavailable")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.bill ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              {t("common.back")}
            </Button>
          </div>

          <BillDetailHeader
            bill={state.bill}
            onEdit={() => router.push(`/dashboard/bills/${state.bill?.id}/edit`)}
          />

          {state.bill.imageUrl ? (
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>{t("bills.view.billImage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <EntityImage
                  src={state.bill.imageUrl}
                  alt={t("bills.view.billImageAlt", {
                    companyName: state.bill.companyName,
                  })}
                  width={800}
                  height={320}
                  className="mx-auto max-h-80 w-full rounded-lg border"
                  imageClassName="max-h-80 rounded-lg object-contain"
                  fallback={null}
                />
              </CardContent>
            </Card>
          ) : null}

          <BillSummaryCards bill={state.bill} />
          <TooltipProvider>
            <BillProductsTable
              products={state.bill.products}
              onView={(product) =>
                router.push(`/dashboard/books/${product.bookId}`)
              }
            />
          </TooltipProvider>
        </div>
      ) : null}
    </>
  )
}
