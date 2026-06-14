"use client"

import type { UseFormReturn } from "react-hook-form"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CategoryFormValues } from "@/domain/schemas/categoryFormSchema"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type CategoryFormDialogProps = {
  open: boolean
  mode: "create" | "edit"
  form: UseFormReturn<CategoryFormValues>
  isSaving: boolean
  error: string | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: CategoryFormValues) => void
}

export function CategoryFormDialog({
  open,
  mode,
  form,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: CategoryFormDialogProps) {
  const { t } = useTranslation()

  const title =
    mode === "create"
      ? t("categories.form.createTitle")
      : t("categories.form.editTitle")
  const description =
    mode === "create"
      ? t("categories.form.createDescription")
      : t("categories.form.editDescription")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("categories.form.nameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("categories.form.namePlaceholder")}
                      disabled={isSaving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("categories.form.descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("categories.form.descriptionPlaceholder")}
                      disabled={isSaving}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2Icon className="animate-spin" /> : null}
                {isSaving
                  ? mode === "create"
                    ? t("common.creating")
                    : t("common.saving")
                  : mode === "create"
                    ? t("categories.form.createButton")
                    : t("categories.form.saveButton")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
