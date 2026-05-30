"use client"

import type { ReactNode } from "react"
import type { UseFormReturn } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { EventStatus } from "@/domain/entities/event/Event"
import type { EventBranchOption } from "@/domain/repositories/EventRepository"
import type { EventFormValues } from "@/domain/schemas/eventFormSchema"

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
]

type EventFormFieldsProps = {
  form: UseFormReturn<EventFormValues>
  branchOptions: EventBranchOption[]
  disabled?: boolean
  onSubmit: (values: EventFormValues) => void
  children?: ReactNode
}

export function EventFormFields({
  form,
  branchOptions,
  disabled = false,
  onSubmit,
  children,
}: EventFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter event name"
                  disabled={disabled}
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter event description"
                  disabled={disabled}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branchIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participating branches</FormLabel>
              <FormControl>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                  {branchOptions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No active branches available.
                    </p>
                  ) : (
                    branchOptions.map((branch) => {
                      const isChecked = field.value.includes(branch.id)

                      return (
                        <label
                          key={branch.id}
                          className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            checked={isChecked}
                            disabled={disabled}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, branch.id])
                                return
                              }

                              field.onChange(
                                field.value.filter(
                                  (branchId) => branchId !== branch.id
                                )
                              )
                            }}
                          />
                          <span className="min-w-0 flex-1 font-medium">
                            {branch.name}
                          </span>
                        </label>
                      )
                    })
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  )
}
