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
import { ImageUpload } from "@/components/ui/image-upload"
import type {
  TranslatorFormInput,
  TranslatorFormValues,
} from "@/domain/schemas/translatorFormSchema"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type TranslatorFormFieldsProps = {
  form: UseFormReturn<TranslatorFormInput, unknown, TranslatorFormValues>
  disabled: boolean
  onSubmit: (values: TranslatorFormValues) => void
  children: React.ReactNode
}

export function TranslatorFormFields({
  form,
  disabled,
  onSubmit,
  children,
}: TranslatorFormFieldsProps) {
  const { t } = useTranslation()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("translators.fields.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("translators.placeholders.name")}
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
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("translators.fields.language")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("translators.placeholders.language")}
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
                <FormLabel>{t("translators.fields.status")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("translators.placeholders.status")}
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

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("translators.fields.biography")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("translators.placeholders.biography")}
                  rows={5}
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  label={t("translators.photoLabel")}
                  previewAlt={t("translators.photoPreviewAlt")}
                  value={field.value ?? null}
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
