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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import type {
  BillBookOption,
  BillBranchOption,
} from "@/domain/repositories/BillManagementRepository"
import type { BillFormValues } from "@/domain/schemas/billFormSchema"
import { BillBooksSelector } from "@/presentation/components/bills/BillBooksSelector"

type BillFormFieldsProps = {
  form: UseFormReturn<BillFormValues>
  branchOptions: BillBranchOption[]
  bookOptions: BillBookOption[]
  createBookHref: string
  disabled: boolean
  onSubmit: (values: BillFormValues) => void
  children: React.ReactNode
}

export function BillFormFields({
  form,
  branchOptions,
  bookOptions,
  createBookHref,
  disabled,
  onSubmit,
  children,
}: BillFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
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
                      <SelectValue placeholder="Select branch to import products" />
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

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Supplier or vendor name"
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
            name="billDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 000-0000"
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
            name="price"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Total Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  label="Bill image"
                  previewAlt="Bill image preview"
                  value={field.value ?? null}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bookIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Products (Books)</FormLabel>
              <FormControl>
                <BillBooksSelector
                  bookOptions={bookOptions}
                  selectedBookIds={field.value}
                  onSelectedBookIdsChange={field.onChange}
                  disabled={disabled}
                  createBookHref={createBookHref}
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
