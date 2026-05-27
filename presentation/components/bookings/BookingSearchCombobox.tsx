"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export type BookingComboboxOption = {
  value: string
  label: string
  searchText?: string
}

type BookingSearchComboboxProps = {
  id?: string
  options: BookingComboboxOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  disabled?: boolean
  createHref: string
  addLabel: string
  onNavigateToCreate?: () => void
}

function matchesQuery(option: BookingComboboxOption, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  return (
    option.label.toLowerCase().includes(normalizedQuery) ||
    (option.searchText?.toLowerCase().includes(normalizedQuery) ?? false)
  )
}

export function BookingSearchCombobox({
  id,
  options,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  createHref,
  addLabel,
  onNavigateToCreate,
}: BookingSearchComboboxProps) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")

  const optionMap = useMemo(() => {
    const map = new Map<string, BookingComboboxOption>()
    for (const option of options) {
      map.set(option.value, option)
    }
    return map
  }, [options])

  const selectedOption = value ? optionMap.get(value) : undefined

  const filteredOptions = useMemo(() => {
    // Custom filtering is enabled by passing `filter={null}` to the Combobox.
    return options.filter((option) => matchesQuery(option, inputValue))
  }, [inputValue, options])

  const hasSearchQuery = inputValue.trim().length > 0
  const showAddAction =
    hasSearchQuery &&
    !options.some(
      (option) =>
        option.label.trim().toLowerCase() === inputValue.trim().toLowerCase()
    )

  // Maps a value id to its display label so Base UI's internal
  // `stringifyAsLabel` returns the correct label after selection.
  // Without this, Base UI would write the raw id back into the input on close,
  // breaking the controlled state.
  const itemToStringLabel = useCallback(
    (itemValue: string) => optionMap.get(itemValue)?.label ?? itemValue,
    [optionMap]
  )

  const handleValueChange = useCallback(
    (nextValue: string | null) => {
      onValueChange(nextValue ?? "")
    },
    [onValueChange]
  )

  const handleInputValueChange = useCallback(
    (nextInput: string, eventDetails?: { reason?: string }) => {
      setInputValue(nextInput)

      // If the user starts typing while something is selected, clear selection.
      // Only do this for direct input edits; Base UI also calls this callback
      // for item selection/close lifecycle updates.
      // Compare against the label (not the raw id) since Base UI fills the
      // input with the label via `itemToStringLabel`.
      if (
        eventDetails?.reason === "input-change" &&
        value &&
        selectedOption &&
        nextInput.trim().toLowerCase() !==
          selectedOption.label.trim().toLowerCase()
      ) {
        onValueChange("")
      }
    },
    [onValueChange, selectedOption, value]
  )

  const handleNavigateToCreate = useCallback(() => {
    onNavigateToCreate?.()
    router.push(createHref)
  }, [createHref, onNavigateToCreate, router])

  return (
    <Combobox
      value={value || null}
      onValueChange={handleValueChange}
      onInputValueChange={handleInputValueChange}
      itemToStringLabel={itemToStringLabel}
      filter={null}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
      <ComboboxContent className="z-200 rounded-md border border-border/60 bg-background shadow-sm">
        {filteredOptions.length > 0 ? (
          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        ) : (
          <div className="flex flex-col items-center gap-3 px-3 py-6">
            <p className="text-sm text-muted-foreground">
              {hasSearchQuery ? "Not found" : "No items available"}
            </p>
            {showAddAction ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onMouseDown={(event) => {
                  // Prevent input blur before the click navigation happens,
                  // otherwise the popup closes on mousedown and the click is lost.
                  event.preventDefault()
                  handleNavigateToCreate()
                }}
              >
                <PlusIcon className="mr-2 size-4" />
                {addLabel}
              </Button>
            ) : null}
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}
