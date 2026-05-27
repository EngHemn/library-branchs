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
import type { BookFormValues } from "@/domain/schemas/bookFormSchema"

type BookFormFieldsProps = {
  form: UseFormReturn<BookFormValues>
  authors: string[]
  translators: string[]
  categories: string[]
  languages: string[]
  disabled: boolean
  onSubmit: (values: BookFormValues) => void
  onAddAuthor: (name: string) => void
  onAddTranslator: (name: string) => void
  onAddCategory: (name: string) => void
  onAddLanguage: (name: string) => void
  children: React.ReactNode
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
        onChange((val as string) ?? "")
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
              <ComboboxItem key={item} value={item} label={item}>
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
  authors,
  translators,
  categories,
  languages,
  disabled,
  onSubmit,
  onAddAuthor,
  onAddTranslator,
  onAddCategory,
  onAddLanguage,
  children,
}: BookFormFieldsProps) {
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter book title"
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
                <FormLabel>Author</FormLabel>
                <SearchableCombobox
                  options={authors}
                  value={field.value}
                  onChange={field.onChange}
                  onAdd={onAddAuthor}
                  placeholder="Search or add author"
                  disabled={disabled}
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
                <SearchableCombobox
                  options={translators}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onAdd={onAddTranslator}
                  placeholder="Search or add translator (optional)"
                  disabled={disabled}
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
                <FormLabel>Category</FormLabel>
                <SearchableCombobox
                  options={categories}
                  value={field.value}
                  onChange={field.onChange}
                  onAdd={onAddCategory}
                  placeholder="Search or add category"
                  disabled={disabled}
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
                <FormLabel>Publication Date</FormLabel>
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

        {children}
      </form>
    </Form>
  )
}
