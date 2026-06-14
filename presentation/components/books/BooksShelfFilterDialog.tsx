"use client"

import { useEffect } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"
import { BookFormLocationField } from "@/presentation/components/books/BookFormLocationField"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfFilterFormValues = {
  locationValues: Record<string, string>
}

type BooksShelfFilterDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationOptions: ShelfLocationOptions | null
  locationValues: Record<string, string>
  locationManageError: string | null
  isManagingLocation: boolean
  onApply: (locationValues: Record<string, string>) => void
  onAddLocationValue: (stepId: string, value: string) => Promise<void>
  onUpdateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  onDeleteLocationValue: (stepId: string, value: string) => Promise<void>
  onAddLocationStep: (label: string) => Promise<void>
  onUpdateLocationStep: (stepId: string, label: string) => Promise<void>
  onDeleteLocationStep: (stepId: string) => Promise<void>
}

export function BooksShelfFilterDialog({
  open,
  onOpenChange,
  locationOptions,
  locationValues,
  locationManageError,
  isManagingLocation,
  onApply,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
}: BooksShelfFilterDialogProps) {
  const { t } = useTranslation()
  const form = useForm<ShelfFilterFormValues>({
    defaultValues: { locationValues: {} },
  })

  useEffect(() => {
    if (!open) return
    form.reset({ locationValues })
  }, [open, locationValues, form])

  function handleApply(): void {
    onApply(form.getValues("locationValues"))
    onOpenChange(false)
  }

  function handleClear(): void {
    form.reset({ locationValues: {} })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("books.shelfFilter.title")}</DialogTitle>
          <DialogDescription>
            {t("books.shelfFilter.description")}
          </DialogDescription>
        </DialogHeader>

        <BookFormLocationField
          form={form as unknown as UseFormReturn<BookFormValues>}
          locationOptions={locationOptions}
          disabled={isManagingLocation}
          locationManageError={locationManageError}
          isManagingLocation={isManagingLocation}
          onAddLocationValue={onAddLocationValue}
          onUpdateLocationValue={onUpdateLocationValue}
          onDeleteLocationValue={onDeleteLocationValue}
          onAddLocationStep={onAddLocationStep}
          onUpdateLocationStep={onUpdateLocationStep}
          onDeleteLocationStep={onDeleteLocationStep}
        />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClear}>
            {t("books.shelfFilter.clear")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button type="button" onClick={handleApply}>
            {t("books.shelfFilter.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
