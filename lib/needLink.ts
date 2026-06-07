export function getNeedViewHref(needId: string): string {
  return `/dashboard/needs/${needId}`
}

export function getNeedViewTabHref(needId: string, tab: string): string {
  const search = new URLSearchParams({ tab })
  return `/dashboard/needs/${needId}?${search.toString()}`
}

export function getNeedEditHref(needId: string): string {
  return `/dashboard/needs/${needId}/edit`
}
