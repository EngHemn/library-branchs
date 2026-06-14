"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfFormStep = 1 | 2 | 3

type ShelfFormStepIndicatorProps = {
  currentStep: ShelfFormStep
}

const steps: Array<{ step: ShelfFormStep; labelKey: TranslationKey }> = [
  { step: 1, labelKey: "shelves.form.steps.details" },
  { step: 2, labelKey: "shelves.form.steps.location" },
  { step: 3, labelKey: "shelves.form.steps.review" },
]

export function ShelfFormStepIndicator({
  currentStep,
}: ShelfFormStepIndicatorProps) {
  const { t } = useTranslation()

  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-4">
      {steps.map((item, index) => {
        const isComplete = currentStep > item.step
        const isActive = currentStep === item.step

        return (
          <li key={item.step} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-sm font-semibold",
                  isComplete &&
                    "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary text-primary",
                  !isComplete &&
                    !isActive &&
                    "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isComplete ? <CheckIcon className="size-4" /> : item.step}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {t(item.labelKey)}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div className="hidden h-px w-8 bg-border sm:block" />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
