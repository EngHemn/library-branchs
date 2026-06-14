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
import { NEED_CATEGORIES } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES } from "@/domain/entities/need/NeedPriority"
import type {
  NeedBranchOption,
  NeedRequestedByOption,
} from "@/domain/repositories/NeedRepository"
import type { NeedFormValues } from "@/domain/schemas/needFormSchema"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("needs.form.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("needs.form.namePlaceholder")}
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
                <FormLabel>{t("needs.form.category")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("needs.form.categoryPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEED_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`needs.categories.${category}` as any)}
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
                <FormLabel>{t("needs.form.quantity")}</FormLabel>
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
                <FormLabel>{t("needs.form.priority")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("needs.form.priorityPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEED_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {t(`needs.priorities.${priority}` as any)}
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
                  <FormLabel>{t("needs.form.branch")}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("needs.form.branchPlaceholder")} />
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
                <FormLabel>{t("needs.form.requestedBy")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("needs.form.requestedByPlaceholder")} />
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
              <FormLabel>{t("needs.form.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("needs.form.descriptionPlaceholder")}
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
              <FormLabel>{t("needs.form.notes")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("needs.form.notesPlaceholder")}
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
              <FormLabel>{t("needs.form.attachment")}</FormLabel>
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
