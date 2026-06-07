import { getBranchViewHref } from "@/lib/branchLink"

export const dashboardPaths = {
  events: {
    list: "/dashboard/events",
    create: "/dashboard/events/create",
    detail: (eventId: string) => `/dashboard/events/${eventId}`,
    edit: (eventId: string) => `/dashboard/events/${eventId}/edit`,
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
