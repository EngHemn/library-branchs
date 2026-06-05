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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import type { Book } from "@/domain/entities/book/Book"
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"
import { BookTitleSearchCombobox } from "@/presentation/components/books/BookTitleSearchCombobox"

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
  disabled: boolean
  onSubmit: (values: BookFormValues) => void
  onAddLanguage: (name: string) => void
  onBookSelect: (bookId: string) => void
  excludeBookId?: string
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
            <p className="text-sm text-muted-foreground">No results found.</p>
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
                Add &quot;{inputValue.trim()}&quot;
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
  disabled,
  onSubmit,
  onAddLanguage,
  onBookSelect,
  excludeBookId,
  children,
}: BookFormFieldsProps) {
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
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <BookTitleSearchCombobox
                    books={books}
                    title={field.value ?? ""}
                    onTitleChange={field.onChange}
                    onBookSelect={onBookSelect}
                    excludeBookId={excludeBookId}
                    disabled={disabled}
                    placeholder="Search or enter book title"
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
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="978-0000000000"
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
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author *</FormLabel>
                <BookingSearchCombobox
                  options={authorOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search author..."
                  disabled={disabled}
                  createHref={CREATE_AUTHOR_HREF}
                  addLabel="Add author"
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
                <FormLabel>Translator</FormLabel>
                <BookingSearchCombobox
                  options={translatorOptions}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Search translator..."
                  disabled={disabled}
                  createHref={CREATE_TRANSLATOR_HREF}
                  addLabel="Add translator"
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
                <FormLabel>Language</FormLabel>
                <SearchableCombobox
                  options={languages}
                  value={field.value}
                  onChange={field.onChange}
                  onAdd={onAddLanguage}
                  placeholder="Search or add language"
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
                <FormLabel>Category *</FormLabel>
                <BookingSearchCombobox
                  options={categoryOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Search category..."
                  disabled={disabled}
                  createHref={CREATE_CATEGORY_HREF}
                  addLabel="Add category"
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
                <FormLabel>Pages</FormLabel>
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
                <FormLabel>Publication Date *</FormLabel>
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
                <FormLabel>Stock</FormLabel>
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
                <FormLabel>Availability</FormLabel>
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
                <FormLabel>Min Alert</FormLabel>
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
                <FormLabel>Initial Price</FormLabel>
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
                <FormLabel>Final Price</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter book description"
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
                  label="Book cover"
                  previewAlt="Book cover preview"
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
