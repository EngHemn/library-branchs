"use client"

import { useState } from "react"
import { Loader2Icon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ShelfLocationStepDefinition } from "@/domain/entities/shelf/ShelfLocationOptions"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfLocationStepsPanelProps = {
  steps: ShelfLocationStepDefinition[]
  disabled?: boolean
  isSaving?: boolean
  onAddStep: (label: string) => Promise<void>
  onUpdateStep: (stepId: string, label: string) => Promise<void>
  onDeleteStep: (stepId: string) => Promise<void>
}

export function ShelfLocationStepsPanel({
  steps,
  disabled = false,
  isSaving = false,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
}: ShelfLocationStepsPanelProps) {
  const { t } = useTranslation()
  const [newStepLabel, setNewStepLabel] = useState("")
  const [editingStepId, setEditingStepId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAddStep = async () => {
    const trimmed = newStepLabel.trim()
    if (!trimmed) return
    await onAddStep(trimmed)
    setNewStepLabel("")
  }

  const startEdit = (step: ShelfLocationStepDefinition) => {
    setEditingStepId(step.id)
    setEditValue(step.label)
  }

  const cancelEdit = () => {
    setEditingStepId(null)
    setEditValue("")
  }

  const saveEdit = async () => {
    if (!editingStepId) return
    const trimmed = editValue.trim()
    if (!trimmed) return
    await onUpdateStep(editingStepId, trimmed)
    setEditingStepId(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t("shelves.location.stepsPanel.description")}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={newStepLabel}
          onChange={(event) => setNewStepLabel(event.target.value)}
          placeholder={t("shelves.location.stepsPanel.placeholder")}
          disabled={disabled || isSaving}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void handleAddStep()
            }
          }}
        />
        <Button
          type="button"
          disabled={disabled || isSaving || newStepLabel.trim().length === 0}
          onClick={() => void handleAddStep()}
        >
          {isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          {t("shelves.location.stepsPanel.addStep")}
        </Button>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            {editingStepId === step.id ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <Input
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  disabled={disabled || isSaving}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={disabled || isSaving}
                    onClick={() => void saveEdit()}
                  >
                    {t("common.save")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || isSaving}
                    onClick={cancelEdit}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium">
                    {index + 1}. {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.id}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled || isSaving}
                    onClick={() => startEdit(step)}
                  >
                    <PencilIcon />
                    {t("common.edit")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    disabled={disabled || isSaving || steps.length <= 1}
                    onClick={() => void onDeleteStep(step.id)}
                  >
                    <Trash2Icon />
                    {t("common.delete")}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
