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
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import type { NotificationsFormValues } from "@/domain/schemas/settingsFormSchema"

type NotificationsSectionProps = {
  form: UseFormReturn<NotificationsFormValues>
  isSaving: boolean
  error: string | null
  success: boolean
  onSubmit: (values: NotificationsFormValues) => void
}

type NotificationFieldConfig = {
  name: keyof NotificationsFormValues
  label: string
  description: string
}

const notificationFields: NotificationFieldConfig[] = [
  {
    name: "emailNotifications",
    label: "Email Notifications",
    description: "Send general notifications to members via email.",
  },
  {
    name: "smsNotifications",
    label: "SMS Notifications",
    description: "Send text message alerts to members with a registered phone.",
  },
  {
    name: "overdueReminders",
    label: "Overdue Reminders",
    description:
      "Automatically remind members when a book is past its due date.",
  },
  {
    name: "newMemberWelcome",
    label: "New Member Welcome",
    description: "Send a welcome message when a new member registers.",
  },
  {
    name: "dueDateReminders",
    label: "Due Date Reminders",
    description: "Notify members a few days before their book is due.",
  },
]

export function NotificationsSection({
  form,
  isSaving,
  error,
  success,
  onSubmit,
}: NotificationsSectionProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-6"
      >
        <div className="space-y-1">
          {notificationFields.map((config, index) => (
            <div key={config.name}>
              <FormField
                control={form.control}
                name={config.name}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between py-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">
                        {config.label}
                      </FormLabel>
                      <FormDescription className="text-sm">
                        {config.description}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {index < notificationFields.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        {error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
            <CheckCircle2Icon className="h-4 w-4 shrink-0" />
            Notification preferences saved successfully.
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
