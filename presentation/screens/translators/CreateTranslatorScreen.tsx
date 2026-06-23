"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorFormFields } from "@/presentation/components/translators/TranslatorFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateTranslatorViewModel } from "@/presentation/viewmodels/translators/useCreateTranslatorViewModel"

type CreateTranslatorScreenProps = {
  getTranslatorsUseCase: GetTranslatorsUseCase
}

export function CreateTranslatorScreen({
  getTranslatorsUseCase,
}: CreateTranslatorScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useCreateTranslatorViewModel(getTranslatorsUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.translators"), href: "/dashboard/translators" },
    { label: t("translators.addTitle") },
  ])

  const goBack = () => router.back()

  useFormSubmitSuccess(state.isSaved, t("translators.createSuccess"))

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">
            {t("translators.addTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("translators.addDescription")}
          </p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeftIcon />
          {t("common.back")}
        </Button>
      </section>

      {state.error ? (
        <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <CardContent className="py-3">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {state.error}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{t("translators.detailsTitle")}</CardTitle>
          <CardDescription>
            {t("translators.detailsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TranslatorFormFields
            form={form}
            disabled={state.isSaving || state.isSaved}
            onSubmit={viewModel.save}
          >
            <Separator />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={state.isSaving}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={state.isSaving || state.isSaved}>
                {state.isSaving ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlusIcon />
                )}
                {state.isSaving
                  ? t("common.creating")
                  : t("translators.createButton")}
              </Button>
            </div>
          </TranslatorFormFields>
        </CardContent>
      </Card>
    </div>
  )
}
