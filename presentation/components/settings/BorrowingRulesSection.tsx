import { CheckCircle2Icon, LoaderCircleIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { BorrowingRulesFormValues } from "@/domain/schemas/settingsFormSchema"

type BorrowingRulesSectionProps = {
  form: UseFormReturn<BorrowingRulesFormValues>
  isSaving: boolean
  error: string | null
  success: boolean
  onSubmit: (values: BorrowingRulesFormValues) => void
}

export function BorrowingRulesSection({
  form,
  isSaving,
  error,
  success,
  onSubmit,
}: BorrowingRulesSectionProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="loanDurationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Duration (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  How many days a member can keep a book.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxRenewals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Renewals</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Number of times a booking can be renewed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxActiveBookings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Active Bookings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Maximum books a member can borrow at once.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="finePerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fine Per Day ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Overdue fine charged per day after grace period.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gracePeriodDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grace Period (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Days after due date before fines start applying.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            <CheckCircle2Icon className="h-4 w-4 shrink-0" />
            Borrowing rules saved successfully.
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <LoaderCircleIcon className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  )
}
