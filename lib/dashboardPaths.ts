import { getBranchViewHref } from "@/lib/branchLink"
import { getGroupEditHref, getGroupViewHref, getGroupViewTabHref } from "@/lib/groupLink"
import { getNeedEditHref, getNeedViewHref, getNeedViewTabHref } from "@/lib/needLink"

export const dashboardPaths = {
  needs: {
    list: "/dashboard/needs",
    create: "/dashboard/needs/create",
    detail: getNeedViewHref,
    detailTab: getNeedViewTabHref,
    edit: getNeedEditHref,
  },
  alerts: {
    lowStock: "/dashboard/alerts/low-stock",
  },
  shelves: {
    list: "/dashboard/shelves",
    create: "/dashboard/shelves/create",
    detail: (shelfId: string) => `/dashboard/shelves/${shelfId}`,
    edit: (shelfId: string) => `/dashboard/shelves/${shelfId}/edit`,
    shelfBook: {
      add: (shelfId: string) => `/dashboard/shelves/${shelfId}/books/add`,
      detail: (shelfId: string, shelfBookId: string) =>
        `/dashboard/shelves/${shelfId}/books/${shelfBookId}`,
      edit: (shelfId: string, shelfBookId: string) =>
        `/dashboard/shelves/${shelfId}/books/${shelfBookId}/edit`,
    },
  },
  groups: {
    list: "/dashboard/groups",
    create: "/dashboard/groups/create",
    detail: getGroupViewHref,
    detailTab: getGroupViewTabHref,
    edit: getGroupEditHref,
  },
  needs: {
    list: "/dashboard/needs",
    create: "/dashboard/needs/create",
    detail: getNeedViewHref,
    detailTab: getNeedViewTabHref,
    edit: getNeedEditHref,
  },
  books: {
    list: "/dashboard/books",
    create: "/dashboard/books/create",
    detail: (bookId: string) => `/dashboard/books/${bookId}`,
    edit: (bookId: string) => `/dashboard/books/${bookId}/edit`,
  },
  members: {
    list: "/dashboard/members",
    create: "/dashboard/members/create",
    detail: (memberId: string) => `/dashboard/members/${memberId}`,
    edit: (memberId: string) => `/dashboard/members/${memberId}/edit`,
  },
  authors: {
    list: "/dashboard/authors",
    create: "/dashboard/authors/create",
    detail: (authorId: string) => `/dashboard/authors/${authorId}`,
    edit: (authorId: string) => `/dashboard/authors/${authorId}/edit`,
  },
  translators: {
    list: "/dashboard/translators",
    create: "/dashboard/translators/create",
    detail: (translatorId: string) => `/dashboard/translators/${translatorId}`,
    edit: (translatorId: string) => `/dashboard/translators/${translatorId}/edit`,
  },
  staff: {
    list: "/dashboard/staff",
    create: "/dashboard/staff/create",
    detail: (staffId: string) => `/dashboard/staff/${staffId}`,
    edit: (staffId: string) => `/dashboard/staff/${staffId}/edit`,
  },
  branches: {
    list: "/dashboard/branches",
    create: "/dashboard/branches/create",
    detail: getBranchViewHref,
    edit: (branchId: string) => `/dashboard/branches/${branchId}/edit`,
  },
} as const
