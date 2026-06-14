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
import type { MemberFormValues } from "@/domain/schemas/memberFormSchema"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type MemberFormFieldsProps = {
  form: UseFormReturn<MemberFormValues>
  disabled: boolean
  onSubmit: (values: MemberFormValues) => void
  children: React.ReactNode
}

export function MemberFormFields({
  form,
  disabled,
  onSubmit,
  children,
}: MemberFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="memberName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("members.fields.fullName")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("members.placeholders.fullName")}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("members.fields.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("members.placeholders.email")}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("members.fields.phone")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("members.placeholders.phone")}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("members.fields.status")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("members.placeholders.selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t("common.active")}</SelectItem>
                    <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
                    <SelectItem value="suspended">{t("members.statuses.suspended")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("members.fields.address")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("members.placeholders.address")}
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
