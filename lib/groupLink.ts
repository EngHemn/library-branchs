export function getGroupViewHref(groupId: string): string {
  return `/dashboard/groups/${groupId}`
}

export function getGroupViewTabHref(
  groupId: string,
  tab: string,
  params?: Record<string, string>
): string {
  const search = new URLSearchParams({ tab })
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      search.set(key, value)
    }
  }
  return `/dashboard/groups/${groupId}?${search.toString()}`
}

export function getGroupEditHref(groupId: string): string {
  return `/dashboard/groups/${groupId}/edit`
}
