"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { ArrowLeftIcon, Loader2Icon, MapPinIcon, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getStepValues,
  type ShelfLocationOptions,
} from "@/domain/entities/shelf/ShelfLocationOptions"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import { formatShelfLocationParts } from "@/lib/shelfLocationDisplay"
import { cn } from "@/lib/utils"
import { ShelfLocationContentPanel } from "@/presentation/components/shelves/ShelfLocationContentPanel"
import { ShelfLocationStepsPanel } from "@/presentation/components/shelves/ShelfLocationStepsPanel"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type LocationFormValues = {
  locationValues: Record<string, string>
}

type ShelfLocationStepFlowProps = {
  form: UseFormReturn<LocationFormValues>
  locationOptions: ShelfLocationOptions
  locationStepIndex: number
  disabled?: boolean
  locationManageError: string | null
  isManagingLocation: boolean
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
  selectOnly?: boolean
  onStepBack?: () => void
  canStepBack?: boolean
  onAfterSelect?: () => void
}

type LocationSelectPanelProps = {
  currentStepId: string
  currentStepLabel: string
  currentValues: string[]
  selectedValue: string
  quickAddName: string
  disabled: boolean
  isManagingLocation: boolean
  emptyMessage: string
  onSelectValue: (value: string) => void
  onQuickAddNameChange: (value: string) => void
  onQuickAdd: () => void
}

function LocationSelectPanel({
  currentStepId,
  currentStepLabel,
  currentValues,
  selectedValue,
  quickAddName,
  disabled,
  isManagingLocation,
  emptyMessage,
  onSelectValue,
  onQuickAddNameChange,
  onQuickAdd,
}: LocationSelectPanelProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-3 text-sm font-medium">
          {t("shelves.location.selectStep", {
            step: currentStepLabel.toLowerCase(),
          })}
        </p>
        <RadioGroup
          value={selectedValue}
          onValueChange={onSelectValue}
          disabled={disabled || isManagingLocation}
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {currentValues.map((option) => (
            <OptionCard
              key={option}
              id={`${currentStepId}-${option}`}
              value={option}
              label={option}
              selected={selectedValue === option}
              disabled={disabled || isManagingLocation}
            />
          ))}
        </RadioGroup>
        {currentValues.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">{emptyMessage}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row">
        <Input
          value={quickAddName}
          onChange={(event) => onQuickAddNameChange(event.target.value)}
          placeholder={t("shelves.location.addNewAndSelect", {
            step: currentStepLabel.toLowerCase(),
          })}
          disabled={disabled || isManagingLocation}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              onQuickAdd()
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={
            disabled || isManagingLocation || quickAddName.trim().length === 0
          }
          onClick={onQuickAdd}
        >
          {isManagingLocation ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PlusIcon />
          )}
          {t("shelves.location.addAndSelect")}
        </Button>
      </div>
    </div>
  )
}

function OptionCard({
  id,
  value,
  label,
  selected,
  disabled,
}: {
  id: string
  value: string
  label: string
  selected: boolean
  disabled?: boolean
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <RadioGroupItem id={id} value={value} disabled={disabled} />
      <span className="text-sm font-medium">{label}</span>
    </Label>
  )
}

export function ShelfLocationStepFlow({
  form,
  locationOptions,
  locationStepIndex,
  disabled = false,
  locationManageError,
  isManagingLocation,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
  selectOnly = false,
  onStepBack,
  canStepBack = false,
  onAfterSelect,
}: ShelfLocationStepFlowProps) {
  const { t } = useTranslation()
  const [quickAddName, setQuickAddName] = useState("")
  const [addStepDialogOpen, setAddStepDialogOpen] = useState(false)
  const locationValues = form.watch("locationValues")
  const currentStep = locationOptions.steps[locationStepIndex]
  const currentStepId = currentStep?.id ?? ""
  const currentStepLabel =
    currentStep?.label ?? t("shelves.location.stepFallback")
  const currentValues = currentStepId
    ? getStepValues(locationOptions, currentStepId)
    : []
  const selectedValue = currentStepId
    ? (locationValues[currentStepId] ?? "")
    : ""

  const completedParts = locationOptions.steps
    .map((step) => ({
      stepLabel: step.label,
      value: (locationValues[step.id] ?? "").trim(),
    }))
    .filter((part) => part.value.length > 0)

  const handleSelectValue = (value: string) => {
    if (!currentStepId) return
    form.setValue(`locationValues.${currentStepId}`, value, {
      shouldValidate: true,
    })
    if (selectOnly) {
      onAfterSelect?.()
    }
  }

  const handleQuickAdd = async () => {
    const trimmed = quickAddName.trim()
    if (!trimmed || !currentStepId) return
    await onAddLocationValue(currentStepId, trimmed)
    form.setValue(`locationValues.${currentStepId}`, trimmed, {
      shouldValidate: true,
    })
    setQuickAddName("")
    if (selectOnly) {
      onAfterSelect?.()
    }
  }

  const handleUpdateValue = async (currentName: string, name: string) => {
    if (!currentStepId) return
    await onUpdateLocationValue(currentStepId, currentName, name)
    if ((locationValues[currentStepId] ?? "") === currentName) {
      form.setValue(`locationValues.${currentStepId}`, name, {
        shouldValidate: true,
      })
    }
  }

  const handleDeleteValue = async (name: string) => {
    if (!currentStepId) return
    await onDeleteLocationValue(currentStepId, name)
    if ((locationValues[currentStepId] ?? "") === name) {
      form.setValue(`locationValues.${currentStepId}`, "", {
        shouldValidate: true,
      })
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    await onDeleteLocationStep(stepId)
    const nextValues = { ...form.getValues("locationValues") }
    delete nextValues[stepId]
    form.setValue("locationValues", nextValues)
  }

  if (locationOptions.steps.length === 0) {
    if (selectOnly) {
      return (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t("shelves.location.noStepsConfigured")}
        </p>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            disabled={disabled || isManagingLocation}
            onClick={() => setAddStepDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t("shelves.location.addAtLeastOneStep")}
        </p>
        <AddLocationStepDialog
          open={addStepDialogOpen}
          onOpenChange={setAddStepDialogOpen}
          steps={locationOptions.steps}
          disabled={disabled}
          isSaving={isManagingLocation}
          onAddStep={onAddLocationStep}
          onUpdateStep={onUpdateLocationStep}
          onDeleteStep={handleDeleteStep}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {locationOptions.steps.map((step, index) => {
          const value = (locationValues[step.id] ?? "").trim()
          const isActive = index === locationStepIndex
          const isComplete = index < locationStepIndex || (isActive && value)

          return (
            <span
              key={step.id}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isComplete
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}. {step.label}
            </span>
          )
        })}
        {selectOnly && onStepBack ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            disabled={disabled || isManagingLocation || !canStepBack}
            onClick={onStepBack}
          >
            <ArrowLeftIcon className="size-4" />
          </Button>
        ) : null}
        {!selectOnly ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 rounded-full"
            disabled={disabled || isManagingLocation}
            onClick={() => setAddStepDialogOpen(true)}
          >
            <PlusIcon className="size-4" />
          </Button>
        ) : null}
      </div>

      {!selectOnly ? (
        <AddLocationStepDialog
          open={addStepDialogOpen}
          onOpenChange={setAddStepDialogOpen}
          steps={locationOptions.steps}
          disabled={disabled}
          isSaving={isManagingLocation}
          onAddStep={onAddLocationStep}
          onUpdateStep={onUpdateLocationStep}
          onDeleteStep={handleDeleteStep}
        />
      ) : null}

      {locationManageError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {locationManageError}
        </p>
      ) : null}

      {selectOnly ? (
        <LocationSelectPanel
          currentStepId={currentStepId}
          currentStepLabel={currentStepLabel}
          currentValues={currentValues}
          selectedValue={selectedValue}
          quickAddName={quickAddName}
          disabled={disabled}
          isManagingLocation={isManagingLocation}
          emptyMessage={t("shelves.location.noValuesYet")}
          onSelectValue={handleSelectValue}
          onQuickAddNameChange={setQuickAddName}
          onQuickAdd={() => void handleQuickAdd()}
        />
      ) : (
        <Tabs defaultValue="select" className="w-full">
          <TabsList className="grid w-full max-w-xl grid-cols-2">
            <TabsTrigger value="select">{t("shelves.location.select")}</TabsTrigger>
            <TabsTrigger value="content">{t("shelves.location.content")}</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="mt-4">
            <LocationSelectPanel
              currentStepId={currentStepId}
              currentStepLabel={currentStepLabel}
              currentValues={currentValues}
              selectedValue={selectedValue}
              quickAddName={quickAddName}
              disabled={disabled}
              isManagingLocation={isManagingLocation}
              emptyMessage={t("shelves.location.noValuesYetWithContent")}
              onSelectValue={handleSelectValue}
              onQuickAddNameChange={setQuickAddName}
              onQuickAdd={() => void handleQuickAdd()}
            />
          </TabsContent>

          <TabsContent value="content" className="mt-4">
            <ShelfLocationContentPanel
              stepLabel={currentStepLabel}
              items={currentValues}
              disabled={disabled}
              isSaving={isManagingLocation}
              onAdd={(name) => onAddLocationValue(currentStepId, name)}
              onUpdate={handleUpdateValue}
              onDelete={handleDeleteValue}
            />
          </TabsContent>
        </Tabs>
      )}

      {completedParts.length > 0 ? (
        <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{t("shelves.location.locationPreview")}</p>
            <p className="text-sm text-muted-foreground">
              {formatShelfLocationParts(completedParts)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

type AddLocationStepDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  steps: ShelfLocationOptions["steps"]
  disabled?: boolean
  isSaving?: boolean
  onAddStep: (label: string) => Promise<void>
  onUpdateStep: (stepId: string, label: string) => Promise<void>
  onDeleteStep: (stepId: string) => Promise<void>
}

function AddLocationStepDialog({
  open,
  onOpenChange,
  steps,
  disabled = false,
  isSaving = false,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
}: AddLocationStepDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("shelves.location.addStepDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("shelves.location.addStepDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <ShelfLocationStepsPanel
          steps={steps}
          disabled={disabled}
          isSaving={isSaving}
          onAddStep={onAddStep}
          onUpdateStep={onUpdateStep}
          onDeleteStep={onDeleteStep}
        />
      </DialogContent>
    </Dialog>
  )
}
