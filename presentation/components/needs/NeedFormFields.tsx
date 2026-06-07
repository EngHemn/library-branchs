"use client"

import type { ReactNode } from "react"
import type { UseFormReturn } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/image-upload"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  NEED_CATEGORIES,
  getNeedCategoryLabel,
} from "@/domain/entities/need/NeedCategory"
import {
  NEED_PRIORITIES,
  getNeedPriorityLabel,
} from "@/domain/entities/need/NeedPriority"
import type {
  NeedBranchOption,
  NeedRequestedByOption,
} from "@/domain/repositories/NeedRepository"
import type { NeedFormValues } from "@/domain/schemas/needFormSchema"

type NeedFormFieldsProps = {
  form: UseFormReturn<NeedFormValues>
  branchOptions: NeedBranchOption[]
  requestedByOptions: NeedRequestedByOption[]
  showBranchField?: boolean
  disabled?: boolean
  onSubmit: (values: NeedFormValues) => void
  children?: ReactNode
}

export function NeedFormFields({
  form,
  branchOptions,
  requestedByOptions,
  showBranchField = true,
  disabled = false,
  onSubmit,
  children,
}: NeedFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Need Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Laptop, Printer, Office Supplies"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEED_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getNeedCategoryLabel(category)}
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
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEED_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {getNeedPriorityLabel(priority)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showBranchField ? (
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchOptions.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="requestedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested By</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select requester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {requestedByOptions.map((option) => (
                      <SelectItem key={option.id} value={option.name}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the item or equipment needed..."
                  rows={4}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes or specifications..."
                  rows={3}
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
          name="attachmentUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment / Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
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
