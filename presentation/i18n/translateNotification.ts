"use client"

export function translateNotificationTitle(title: string, t: (key: any, params?: any) => string): string {
  switch (title) {
    case "Overdue book reminder":
      return t("notifications.titles.overdueReminder")
    case "New member registered":
      return t("notifications.titles.newMember")
    case "Low stock alert":
      return t("notifications.titles.lowStock")
    case "New need request":
      return t("notifications.titles.newNeed")
    case "Daily sales summary":
      return t("notifications.titles.salesSummary")
    case "Permission update":
      return t("notifications.titles.permissionUpdate")
    case "Need request approved":
      return t("notifications.titles.needApproved")
    case "Need request rejected":
      return t("notifications.titles.needRejected")
    case "Book out of stock":
      return t("notifications.titles.outOfStock")
    default:
      return title
  }
}

export function translateNotificationMessage(message: string, t: (key: any, params?: any) => string): string {
  // 1. Overdue reminder
  // "Member MBR-0182 has 2 books past due date."
  {
    const match = message.match(/^Member\s+(MBR-\d+)\s+has\s+(\d+)\s+books?\s+past\s+due\s+date\.$/i)
    if (match) {
      return t("notifications.messages.overdueReminder", {
        memberId: match[1],
        count: match[2],
      })
    }
  }

  // 2. New member registered
  // "Sara Al-Masri joined Central Library & Bookshop."
  {
    const match = message.match(/^(.+?)\s+joined\s+Central\s+Library\s+&\s+Bookshop\.$/i)
    if (match) {
      return t("notifications.messages.newMember", { name: match[1] })
    }
  }

  // 3. Low stock alert
  // "The Silent Patient" has only 2 copies left at BR-002.
  // or "The Silent Patient" has 2 copies left at Central Library.
  {
    const match = message.match(/^"(.+?)"\s+has\s+(?:only\s+)?(\d+)\s+copies?\s+left\s+at\s+(.+?)\.$/i)
    if (match) {
      return t("notifications.messages.lowStock", {
        title: match[1],
        count: match[2],
        branch: match[3],
      })
    }
  }

  // 4. New need request
  // "Network Switch Upgrade requested at Northside Books (Critical)."
  // or "Network Switch Upgrade requested at Northside Books (critical priority)."
  {
    const match = message.match(
      /^(.+?)\s+requested\s+at\s+(.+?)\s+\((Critical|High|Medium|Low|critical|high|medium|low)(?:\s+priority)?\)\.$/i
    )
    if (match) {
      const priorityKey = match[3].toLowerCase()
      const priorityTranslated = t(`notifications.priorities.${priorityKey}`)
      return t("notifications.messages.newNeed", {
        name: match[1],
        branch: match[2],
        priority: priorityTranslated,
      })
    }
  }

  // 5. Daily sales summary
  // "Yesterday's sales totaled $1,240.50 across all branches."
  {
    const match = message.match(/^Yesterday's\s+sales\s+totaled\s+\$(.+?)\s+across\s+all\s+branches\.$/i)
    if (match) {
      return t("notifications.messages.salesSummary", { amount: match[1] })
    }
  }

  // 6. Permission update
  // "Staff role permissions were updated for Brian Foster."
  {
    const match = message.match(/^Staff\s+role\s+permissions\s+were\s+updated\s+for\s+(.+?)\.$/i)
    if (match) {
      return t("notifications.messages.permissionUpdate", { name: match[1] })
    }
  }

  // 7. Need request approved
  // "Network Switch Upgrade" at Northside Books has been approved.
  {
    const match = message.match(/^"(.+?)"\s+at\s+(.+?)\s+has\s+been\s+approved\.$/i)
    if (match) {
      return t("notifications.messages.needApproved", {
        name: match[1],
        branch: match[2],
      })
    }
  }

  // 8. Need request rejected
  // "Network Switch Upgrade" at Northside Books was rejected.
  {
    const match = message.match(/^"(.+?)"\s+at\s+(.+?)\s+was\s+rejected\.$/i)
    if (match) {
      return t("notifications.messages.needRejected", {
        name: match[1],
        branch: match[2],
      })
    }
  }

  // 9. Book out of stock
  // "The Silent Patient" is out of stock at Central Library.
  {
    const match = message.match(/^"(.+?)"\s+is\s+out\s+of\s+stock\s+at\s+(.+?)\.$/i)
    if (match) {
      return t("notifications.messages.outOfStock", {
        title: match[1],
        branch: match[2],
      })
    }
  }

  return message
}
