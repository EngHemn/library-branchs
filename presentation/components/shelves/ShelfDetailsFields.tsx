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
import {
  SHELF_TYPES,
  getShelfTypeLabel,
} from "@/domain/entities/shelf/ShelfType"
import type { ShelfFormValues } from "@/domain/schemas/shelfFormSchema"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ShelfDetailsFieldsProps = {
  form: UseFormReturn<ShelfFormValues>
  branchOptions: Array<{ id: string; name: string }>
  canSelectBranch: boolean
  disabled?: boolean
}

export function ShelfDetailsFields({
  form,
  branchOptions,
  canSelectBranch,
  disabled = false,
}: ShelfDetailsFieldsProps) {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t("shelves.form.fields.shelfName")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("shelves.form.fields.shelfNamePlaceholder")}
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
          name="shelfType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("shelves.form.fields.shelfType")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "shelves.form.fields.shelfTypePlaceholder"
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SHELF_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getShelfTypeLabel(type)}
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
          name="branchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("shelves.form.fields.branch")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled || !canSelectBranch}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("shelves.form.fields.branchPlaceholder")}
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

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("shelves.form.fields.capacity")}</FormLabel>
              <FormControl>
                <Input type="number" min={1} disabled={disabled} {...field} />
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
              <FormLabel>{t("shelves.form.fields.status")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("shelves.form.fields.statusPlaceholder")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">{t("common.active")}</SelectItem>
                  <SelectItem value="inactive">
                    {t("common.inactive")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}
