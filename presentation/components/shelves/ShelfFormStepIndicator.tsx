"use client"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ShelfFormStep = 1 | 2 | 3

type ShelfFormStepIndicatorProps = {
  currentStep: ShelfFormStep
}

const steps = [
  { step: 1 as const, label: "Details" },
  { step: 2 as const, label: "Location" },
  { step: 3 as const, label: "Review" },
]

export function ShelfFormStepIndicator({
  currentStep,
}: ShelfFormStepIndicatorProps) {
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
                {item.label}
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
