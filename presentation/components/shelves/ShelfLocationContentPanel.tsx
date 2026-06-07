"use client"

import { useState } from "react"
import { Loader2Icon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ShelfLocationContentPanelProps = {
  stepLabel: string
  items: string[]
  disabled?: boolean
  isSaving?: boolean
  onAdd: (name: string) => Promise<void>
  onUpdate: (currentName: string, name: string) => Promise<void>
  onDelete: (name: string) => Promise<void>
}

export function ShelfLocationContentPanel({
  stepLabel,
  items,
  disabled = false,
  isSaving = false,
  onAdd,
  onUpdate,
  onDelete,
}: ShelfLocationContentPanelProps) {
  const [newName, setNewName] = useState("")
  const [editingName, setEditingName] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAdd = async () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    await onAdd(trimmed)
    setNewName("")
  }

  const startEdit = (name: string) => {
    setEditingName(name)
    setEditValue(name)
  }

  const cancelEdit = () => {
    setEditingName(null)
    setEditValue("")
  }

  const saveEdit = async () => {
    if (!editingName) return
    const trimmed = editValue.trim()
    if (!trimmed) return
    await onUpdate(editingName, trimmed)
    setEditingName(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder={`Add new ${stepLabel.toLowerCase()}...`}
          disabled={disabled || isSaving}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              void handleAdd()
            }
          }}
        />
        <Button
          type="button"
          disabled={disabled || isSaving || newName.trim().length === 0}
          onClick={() => void handleAdd()}
        >
          {isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No {stepLabel.toLowerCase()} values yet. Add one above.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingName === item ? (
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
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={disabled || isSaving}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-sm font-medium">{item}</span>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={disabled || isSaving}
                      onClick={() => startEdit(item)}
                    >
                      <PencilIcon />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={disabled || isSaving}
                      onClick={() => void onDelete(item)}
                    >
                      <Trash2Icon />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
