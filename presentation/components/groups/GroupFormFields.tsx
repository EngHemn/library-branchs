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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import type { GroupStatus } from "@/domain/entities/group/Group"
import type {
  GroupBookOption,
  GroupBranchOption,
  GroupStaffOption,
} from "@/domain/repositories/GroupRepository"
import type { GroupFormValues } from "@/domain/schemas/groupFormSchema"
import { GroupBooksSelector } from "@/presentation/components/groups/GroupBooksSelector"
import { GroupSelectedBooksTable } from "@/presentation/components/groups/GroupSelectedBooksTable"
import { GroupSelectedStaffTable } from "@/presentation/components/groups/GroupSelectedStaffTable"
import { GroupStaffSelector } from "@/presentation/components/groups/GroupStaffSelector"
import { useTranslation } from "@/presentation/i18n/useTranslation"

const statusOptions: GroupStatus[] = ["active", "inactive"]

type GroupFormFieldsProps = {
  form: UseFormReturn<GroupFormValues>
  bookOptions: GroupBookOption[]
  staffOptions: GroupStaffOption[]
  branchOptions?: GroupBranchOption[]
  showBranchField?: boolean
  disabled?: boolean
  onSubmit: (values: GroupFormValues) => void
  children?: ReactNode
}

export function GroupFormFields({
  form,
  bookOptions,
  staffOptions,
  branchOptions = [],
  showBranchField = true,
  disabled = false,
  onSubmit,
  children,
}: GroupFormFieldsProps) {
  const { t } = useTranslation()
  const selectedBookIds = form.watch("bookIds")
  const selectedStaffIds = form.watch("staffIds")

  const statusLabel = (status: GroupStatus) =>
    status === "active" ? t("common.active") : t("common.inactive")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("groups.fields.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("groups.placeholders.name")}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("groups.fields.description")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("groups.placeholders.description")}
                    disabled={disabled}
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
                <FormLabel>{t("groups.fields.status")}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("groups.placeholders.selectStatus")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {statusLabel(option)}
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
                  <FormLabel>{t("groups.fields.branch")}</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("groups.placeholders.selectBranch")}
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
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
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">
              {t("groups.fields.bookAssignment")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("groups.fields.bookAssignmentDescription")}
            </p>
          </div>
          <FormField
            control={form.control}
            name="bookIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <GroupBooksSelector
                    bookOptions={bookOptions}
                    selectedBookIds={field.value}
                    onSelectedBookIdsChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <GroupSelectedBooksTable
            bookOptions={bookOptions}
            selectedBookIds={selectedBookIds}
            onRemoveBook={(bookId) =>
              form.setValue(
                "bookIds",
                selectedBookIds.filter((id) => id !== bookId)
              )
            }
            disabled={disabled}
          />
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium">
              {t("groups.fields.staffAssignment")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("groups.fields.staffAssignmentDescription")}
            </p>
          </div>
          <FormField
            control={form.control}
            name="staffIds"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <GroupStaffSelector
                    staffOptions={staffOptions}
                    selectedStaffIds={field.value}
                    onSelectedStaffIdsChange={field.onChange}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <GroupSelectedStaffTable
            staffOptions={staffOptions}
            selectedStaffIds={selectedStaffIds}
            onRemoveStaff={(staffId) =>
              form.setValue(
                "staffIds",
                selectedStaffIds.filter((id) => id !== staffId)
              )
            }
            disabled={disabled}
          />
        </div>

        {children}
      </form>
    </Form>
  )
}
