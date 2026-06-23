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
import { ORDER_STATUSES } from "@/domain/entities/order/OrderStatus"
import type {
  OrderBookOption,
  OrderBranchOption,
} from "@/domain/repositories/OrderManagementRepository"
import type { OrderFormValues } from "@/domain/schemas/orderFormSchema"
import { OrderBooksSelector } from "@/presentation/components/orders/OrderBooksSelector"
import { OrderFormLocationField } from "@/presentation/components/orders/OrderFormLocationField"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

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
                  <FormLabel>{t("orders.form.branch")}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value)
                      const branch = branchOptions.find(
                        (item) => item.id === value
                      )
                      if (branch) {
                        form.setValue("latitude", branch.latitude)
                        form.setValue("longitude", branch.longitude)
                      }
                    }}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("orders.form.branchPlaceholder")}
                        />
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
                <FormLabel>{t("orders.form.supplierName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("orders.form.supplierNamePlaceholder")}
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
                <FormLabel>{t("orders.form.orderDate")}</FormLabel>
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
                <FormLabel>{t("orders.form.expectedDelivery")}</FormLabel>
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
                <FormLabel>{t("orders.form.status")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("orders.form.statusPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ORDER_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`orders.status.${status}`)}
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
                <FormLabel>{t("orders.form.phoneNumber")}</FormLabel>
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
                <FormLabel>{t("orders.form.supplierEmail")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("orders.form.supplierEmailPlaceholder")}
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
                <FormLabel>{t("orders.form.totalAmount")}</FormLabel>
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
              <FormLabel>{t("orders.form.notes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("orders.form.notesPlaceholder")}
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
              <FormLabel>{t("orders.form.orderItems")}</FormLabel>
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
