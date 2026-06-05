"use client"

import type { UseFormReturn } from "react-hook-form"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import type { Category } from "@/domain/entities/category/Category"
import type { ConcatCategoryFormValues } from "@/domain/schemas/concatCategoryFormSchema"

type ConcatCategoryDialogProps = {
  open: boolean
  categories: Category[]
  form: UseFormReturn<ConcatCategoryFormValues>
  isSaving: boolean
  error: string | null
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ConcatCategoryFormValues) => void
}

export function ConcatCategoryDialog({
  open,
  categories,
  form,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: ConcatCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Concat Categories</DialogTitle>
          <DialogDescription>
            Select at least two categories to merge into one new category.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sourceCategoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories to merge</FormLabel>
                  <FormControl>
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                      {categories.map((category) => {
                        const isChecked = field.value.includes(category.id)

                        return (
                          <label
                            key={category.id}
                            className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted/50"
                          >
                            <Checkbox
                              checked={isChecked}
                              disabled={isSaving}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, category.id])
                                  return
                                }

                                field.onChange(
                                  field.value.filter(
                                    (categoryId) => categoryId !== category.id
                                  )
                                )
                              }}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium">
                                {category.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {category.description}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {category.totalBooks} books
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter merged category name"
                      disabled={isSaving}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter merged category description"
                      disabled={isSaving}
                      rows={3}
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
                  <FormLabel>New status</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSaving}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2Icon className="animate-spin" /> : null}
                {isSaving ? "Merging..." : "Concat Categories"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
