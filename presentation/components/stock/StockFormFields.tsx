"use client"

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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  CreateStockFormValues,
  EditStockFormValues,
} from "@/domain/schemas/stockFormSchema"
import {
  StockBookSearchCombobox,
  type StockBookOption,
} from "@/presentation/components/stock/StockBookSearchCombobox"

type SelectOption = {
  id: string
  name: string
}

type CreateStockFormFieldsProps = {
  form: UseFormReturn<CreateStockFormValues>
  books: StockBookOption[]
  subBranches: SelectOption[]
  showSubBranchField: boolean
  disabled: boolean
  onSubmit: (values: CreateStockFormValues) => void
  children: React.ReactNode
}

type EditStockFormFieldsProps = {
  form: UseFormReturn<EditStockFormValues>
  disabled: boolean
  onSubmit: (values: EditStockFormValues) => void
  children: React.ReactNode
}

export function CreateStockFormFields({
  form,
  books,
  subBranches,
  showSubBranchField,
  disabled,
  onSubmit,
  children,
}: CreateStockFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="bookId"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Book</FormLabel>
                <FormControl>
                  <StockBookSearchCombobox
                    books={books}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showSubBranchField ? (
            <FormField
              control={form.control}
              name="subBranchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Branch (optional)</FormLabel>
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="No sub branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No sub branch</SelectItem>
                      {subBranches.map((subBranch) => (
                        <SelectItem key={subBranch.id} value={subBranch.id}>
                          {subBranch.name}
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
            name="initialStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input type="number" min={0} disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Alert Stock</FormLabel>
                <FormControl>
                  <Input type="number" min={1} disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {children}
      </form>
    </Form>
  )
}

export function EditStockFormFields({
  form,
  disabled,
  onSubmit,
  children,
}: EditStockFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min={0} disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Alert Stock</FormLabel>
                <FormControl>
                  <Input type="number" min={1} disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Optional adjustment note..."
                  disabled={disabled}
                  {...field}
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
