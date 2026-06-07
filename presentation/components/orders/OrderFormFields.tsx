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
import { Textarea } from "@/components/ui/textarea"
import {
  ORDER_STATUSES,
  getOrderStatusLabel,
} from "@/domain/entities/order/OrderStatus"
import type {
  OrderBookOption,
  OrderBranchOption,
} from "@/domain/repositories/OrderManagementRepository"
import type { OrderFormValues } from "@/domain/schemas/orderFormSchema"
import { OrderBooksSelector } from "@/presentation/components/orders/OrderBooksSelector"
import { OrderFormLocationField } from "@/presentation/components/orders/OrderFormLocationField"

type OrderFormFieldsProps = {
  form: UseFormReturn<OrderFormValues>
  branchOptions: OrderBranchOption[]
  bookOptions: OrderBookOption[]
  createBookHref: string
  showBranchField?: boolean
  disabled: boolean
  onSubmit: (values: OrderFormValues) => void
  children: React.ReactNode
}

export function OrderFormFields({
  form,
  branchOptions,
  bookOptions,
  createBookHref,
  showBranchField = true,
  disabled,
  onSubmit,
  children,
}: OrderFormFieldsProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {showBranchField ? (
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      const branch = branchOptions.find((item) => item.id === value)
                      if (branch) {
                        form.setValue("latitude", branch.latitude)
                        form.setValue("longitude", branch.longitude)
                      }
                    }}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select branch for this order" />
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
            name="supplierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
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
            name="orderDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedDeliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Delivery</FormLabel>
                <FormControl>
                  <Input type="date" disabled={disabled} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      <SelectValue placeholder="Select order status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {getOrderStatusLabel(status)}
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
            name="supplierEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Email (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="orders@supplier.com"
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
            name="totalAmount"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Total Amount (IQD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    placeholder="0"
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional order notes or delivery instructions..."
                  disabled={disabled}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <OrderFormLocationField
          form={form}
          branchOptions={branchOptions}
          disabled={disabled}
        />

        <FormField
          control={form.control}
          name="bookIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Items (Books)</FormLabel>
              <FormControl>
                <OrderBooksSelector
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
