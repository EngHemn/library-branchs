import { CircleAlert, CircleCheck, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

type LoginStatusMessageProps = {
  status: "loading" | "error" | "success"
  message: string
}

export function LoginStatusMessage({
  status,
  message,
}: LoginStatusMessageProps) {
  const Icon =
    status === "success"
      ? CircleCheck
      : status === "loading"
        ? ShieldCheck
        : CircleAlert

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
        status === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
        status === "loading" &&
          "border-border bg-muted/60 text-muted-foreground",
        status === "error" &&
          "border-destructive/30 bg-destructive/10 text-destructive"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
