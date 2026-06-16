"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import type { Book } from "@/domain/entities/book/Book"
import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"
import type { BookBranchOption } from "@/lib/bookBranchScope"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"
import { BookFormLocationField } from "@/presentation/components/books/BookFormLocationField"
import { BookTitleSearchCombobox } from "@/presentation/components/books/BookTitleSearchCombobox"
import { useTranslation } from "@/presentation/i18n/useTranslation"

const CREATE_AUTHOR_HREF = "/dashboard/authors/create"
const CREATE_TRANSLATOR_HREF = "/dashboard/translators/create"
const CREATE_CATEGORY_HREF = "/dashboard/categories?create=true"

type BookFormFieldsProps = {
  form: UseFormReturn<BookFormValues>
  books: Book[]
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  branchOptions?: BookBranchOption[]
  showBranchField?: boolean
  disabled: boolean
  onSubmit: (values: BookFormValues) => void
  onAddLanguage: (name: string) => void
  onBookSelect: (bookId: string) => void
  excludeBookId?: string
  locationOptions: ShelfLocationOptions | null
  locationManageError: string | null
  isManagingLocation: boolean
  onAddLocationValue: (stepId: string, value: string) => Promise<void>
  onUpdateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  onDeleteLocationValue: (stepId: string, value: string) => Promise<void>
  onAddLocationStep: (label: string) => Promise<void>
  onUpdateLocationStep: (stepId: string, label: string) => Promise<void>
  onDeleteLocationStep: (stepId: string) => Promise<void>
  children: React.ReactNode
}

function toComboboxOptions(items: string[]): BookingComboboxOption[] {
  return items.map((item) => ({
    value: item,
    label: item,
  }))
}

type SearchableComboboxProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  onAdd: (name: string) => void
  placeholder: string
  disabled: boolean
}

function SearchableCombobox({
  options,
  value,
  onChange,
  onAdd,
  placeholder,
  disabled,
}: SearchableComboboxProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState("")

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  )

  const showAddButton =
    inputValue.trim().length > 0 &&
    !options.some(
      (item) => item.toLowerCase() === inputValue.trim().toLowerCase()
    )

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    onAdd(trimmed)
    onChange(trimmed)
  }

  return (
    <Combobox
      value={value || null}
      onValueChange={(val) => {
        onChange(val ?? "")
      }}
      onInputValueChange={(val) => {
        setInputValue(val)
      }}
      filter={null}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
      <ComboboxContent>
        {filteredOptions.length > 0 ? (
          <ComboboxList>
            {filteredOptions.map((item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            ))}
          </ComboboxList>
        ) : (
          <div className="flex flex-col items-center gap-3 px-3 py-6">
            <p className="text-sm text-muted-foreground">{t("common.noResults")}</p>
            {showAddButton ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleAdd()
                }}
              >
                <PlusIcon className="mr-2 size-4" />
                {t("books.placeholders.addItem", { value: inputValue.trim() })}
              </Button>
            ) : null}
          </div>
        )}
      </ComboboxContent>
    </Combobox>
  )
}

export function BookFormFields({
  form,
  books,
  authors,
  translators,
  categories,
  languages,
  branchOptions = [],
  showBranchField = false,
  disabled,
  onSubmit,
  onAddLanguage,
  onBookSelect,
  excludeBookId,
  locationOptions,
  locationManageError,
  isManagingLocation,
  onAddLocationValue,
  onUpdateLocationValue,
  onDeleteLocationValue,
  onAddLocationStep,
  onUpdateLocationStep,
  onDeleteLocationStep,
  children,
}: BookFormFieldsProps) {
  const { t } = useTranslation()
  const authorOptions = toComboboxOptions(authors)
  const translatorOptions = toComboboxOptions(translators)
  const categoryOptions = toComboboxOptions(categories)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.title")} *</FormLabel>
                <FormControl>
                  <BookTitleSearchCombobox
                    books={books}
                    title={field.value ?? ""}
                    onTitleChange={field.onChange}
                    onBookSelect={onBookSelect}
                    excludeBookId={excludeBookId}
                    disabled={disabled}
                    placeholder={t("books.placeholders.title")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.isbn")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("books.placeholders.isbn")}
                    disabled={disabled}
                    {...field}
                  />
                </FormControl>
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
                  <FormLabel>{t("books.fields.branch")} *</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("books.placeholders.selectBranch")}
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
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.author")} *</FormLabel>
                <BookingSearchCombobox
                  options={authorOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("books.placeholders.author")}
                  disabled={disabled}
                  createHref={CREATE_AUTHOR_HREF}
                  addLabel={t("books.placeholders.addAuthor")}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="translator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.translator")}</FormLabel>
                <BookingSearchCombobox
                  options={translatorOptions}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder={t("books.placeholders.translator")}
                  disabled={disabled}
                  createHref={CREATE_TRANSLATOR_HREF}
                  addLabel={t("books.placeholders.addTranslator")}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.language")}</FormLabel>
                <SearchableCombobox
                  options={languages}
                  value={field.value}
                  onChange={field.onChange}
                  onAdd={onAddLanguage}
                  placeholder={t("books.placeholders.language")}
                  disabled={disabled}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.category")} *</FormLabel>
                <BookingSearchCombobox
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder={t("books.placeholders.category")}
                  disabled={disabled}
                  createHref={CREATE_CATEGORY_HREF}
                  addLabel={t("books.placeholders.addCategory")}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.pages")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
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
            name="publicationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.publicationDate")} *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
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
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.stock")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
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
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.availability")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
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
            name="minAlert"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.minAlert")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
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
            name="initialPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.initialPrice")}</FormLabel>
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

          <FormField
            control={form.control}
            name="finalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books.fields.finalPrice")}</FormLabel>
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

        <BookFormLocationField
          form={form}
          locationOptions={locationOptions}
          disabled={disabled}
          locationManageError={locationManageError}
          isManagingLocation={isManagingLocation}
          onAddLocationValue={onAddLocationValue}
          onUpdateLocationValue={onUpdateLocationValue}
          onDeleteLocationValue={onDeleteLocationValue}
          onAddLocationStep={onAddLocationStep}
          onUpdateLocationStep={onUpdateLocationStep}
          onDeleteLocationStep={onDeleteLocationStep}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("books.fields.description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("books.placeholders.description")}
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
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUpload
                  label={t("books.fields.cover")}
                  previewAlt={t("books.fields.coverPreview")}
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
