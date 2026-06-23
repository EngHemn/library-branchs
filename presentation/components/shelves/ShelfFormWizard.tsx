"use client"

import type { UseFormReturn } from "react-hook-form"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2Icon,
  SaveIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import { ShelfDetailsFields } from "@/presentation/components/shelves/ShelfDetailsFields"
import { ShelfFormStepIndicator } from "@/presentation/components/shelves/ShelfFormStepIndicator"
import {
  ShelfLocationStepFlow,
  type LocationFormValues,
} from "@/presentation/components/shelves/ShelfLocationStepFlow"
import { ShelfReviewSummary } from "@/presentation/components/shelves/ShelfReviewSummary"
import type { ShelfFormStep } from "@/presentation/viewmodels/shelves/CreateShelfViewModelState"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfFormWizardProps = {
  title: string
  description: string
  backHref: string
  form: UseFormReturn<ShelfFormValues>
  currentStep: ShelfFormStep
  locationStepIndex: number
  branchOptions: Array<{ id: string; name: string }>
  canSelectBranch: boolean
  locationOptions: ShelfLocationOptions | null
  selectedBranchName: string
  isSaving: boolean
  error: string | null
  locationManageError: string | null
  isManagingLocation: boolean
  submitLabel: string
  onBack: () => void
  onNext: () => void
  onSave: () => void
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

export function ShelfFormWizard({
  title,
  description,
  backHref,
  form,
  currentStep,
  locationStepIndex,
  branchOptions,
  canSelectBranch,
  locationOptions,
  selectedBranchName,
  isSaving,
  error,
  locationManageError,
  isManagingLocation,
  submitLabel,
  onBack,
  onNext,
  onSave,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
}: ShelfFormWizardProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const stepTitle =
    currentStep === 1
      ? t("shelves.form.stepTitles.details")
      : currentStep === 2
        ? t("shelves.form.stepTitles.buildLocation")
        : t("shelves.form.stepTitles.reviewSave")

  const stepDescription =
    currentStep === 1
      ? t("shelves.form.stepDescriptions.details")
      : currentStep === 2
        ? t("shelves.form.stepDescriptions.location")
        : t("shelves.form.stepDescriptions.review")

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="outline" onClick={() => router.push(backHref)}>
          <ArrowLeftIcon />
          {t("shelves.form.back")}
        </Button>
      </section>

      <ShelfFormStepIndicator currentStep={currentStep} />

      {error ? (
        <Card className="rounded-lg border-destructive/40">
          <CardContent className="py-3">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>{stepTitle}</CardTitle>
          <CardDescription>{stepDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 ? (
            <ShelfDetailsFields
              form={form}
              branchOptions={branchOptions}
              canSelectBranch={canSelectBranch}
              disabled={isSaving}
            />
          ) : null}

          {currentStep === 2 && locationOptions ? (
            <ShelfLocationStepFlow
              form={form as unknown as UseFormReturn<LocationFormValues>}
              locationOptions={locationOptions}
              locationStepIndex={locationStepIndex}
              disabled={isSaving}
              locationManageError={locationManageError}
              isManagingLocation={isManagingLocation}
              onAddLocationValue={onAddLocationValue}
              onUpdateLocationValue={onUpdateLocationValue}
              onDeleteLocationValue={onDeleteLocationValue}
              onAddLocationStep={onAddLocationStep}
              onUpdateLocationStep={onUpdateLocationStep}
              onDeleteLocationStep={onDeleteLocationStep}
            />
          ) : null}

          {currentStep === 3 && locationOptions ? (
            <ShelfReviewSummary
              values={form.getValues()}
              branchName={selectedBranchName}
              locationSteps={locationOptions.steps}
            />
          ) : null}

          <div className="flex flex-wrap justify-between gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving || currentStep === 1}
              onClick={onBack}
            >
              <ArrowLeftIcon />
              {t("shelves.form.previous")}
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                disabled={isSaving}
                onClick={() => void onNext()}
              >
                {t("shelves.form.next")}
                <ArrowRightIcon />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isSaving}
                onClick={() => void onSave()}
              >
                {isSaving ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <SaveIcon />
                )}
                {isSaving ? t("shelves.form.saving") : submitLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
