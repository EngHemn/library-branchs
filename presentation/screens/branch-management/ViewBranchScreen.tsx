"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
<<<<<<< HEAD
import { useQueryClient } from "@tanstack/react-query"
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import {
  ArrowLeftIcon,
  BookOpenIcon,
  Building2Icon,
  GitBranchIcon,
  LanguagesIcon,
  MapPinIcon,
  PenLineIcon,
  RefreshCwIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { EntityImage } from "@/components/ui/entity-image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
<<<<<<< HEAD
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import type { Member } from "@/domain/entities/member/Member"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import { AuthorsTab } from "@/presentation/components/branch-detail/AuthorsTab"
import { BooksTab } from "@/presentation/components/branch-detail/BooksTab"
import { BranchDetailsTab } from "@/presentation/components/branch-detail/BranchDetailsTab"
import { BranchLocationTab } from "@/presentation/components/branch-detail/BranchLocationTab"
import { MembersTab } from "@/presentation/components/branch-detail/MembersTab"
import { StaffTab } from "@/presentation/components/branch-detail/StaffTab"
import { SubBranchesTab } from "@/presentation/components/branch-detail/SubBranchesTab"
import { TranslatorsTab } from "@/presentation/components/branch-detail/TranslatorsTab"
<<<<<<< HEAD
import { EditBookDialog } from "@/presentation/components/books/EditBookDialog"
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useBranchDetailViewModel } from "@/presentation/viewmodels/branch-management/useBranchDetailViewModel"

type ViewBranchScreenProps = {
  branchId: string
  branchDetailUseCase: BranchDetailUseCase
<<<<<<< HEAD
  getBooksUseCase: GetBooksUseCase
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
}

type PendingDelete =
  | { kind: "subBranch"; item: Branch }
  | { kind: "book"; item: Book }
  | { kind: "author"; item: Author }
  | { kind: "translator"; item: Translator }
  | { kind: "staff"; item: StaffMember }
  | { kind: "member"; item: Member }

function getDeleteDialogContent(pendingDelete: PendingDelete | null) {
  if (!pendingDelete) {
    return null
  }

  switch (pendingDelete.kind) {
    case "subBranch":
      return {
        title: "Delete Sub Branch",
        description: `Are you sure you want to delete "${pendingDelete.item.branchName}"? This action cannot be undone.`,
      }
    case "book":
      return {
        title: "Delete Book",
        description: `Are you sure you want to delete "${pendingDelete.item.title}"? This action cannot be undone.`,
      }
    case "author":
      return {
        title: "Delete Author",
        description: `Are you sure you want to delete "${pendingDelete.item.name}"? This action cannot be undone.`,
      }
    case "translator":
      return {
        title: "Delete Translator",
        description: `Are you sure you want to delete "${pendingDelete.item.name}"? This action cannot be undone.`,
      }
    case "staff":
      return {
        title: "Delete Staff Member",
        description: `Are you sure you want to delete "${pendingDelete.item.staffName}"? This action cannot be undone.`,
      }
    case "member":
      return {
        title: "Delete Member",
        description: `Are you sure you want to delete "${pendingDelete.item.memberName}"? This action cannot be undone.`,
      }
  }
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

<<<<<<< HEAD
export function ViewBranchScreen({
  branchId,
  branchDetailUseCase,
  getBooksUseCase,
}: ViewBranchScreenProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const viewModel = useBranchDetailViewModel(branchId, branchDetailUseCase)
  const { state } = viewModel
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [editBookId, setEditBookId] = useState<string | null>(null)
=======
export function ViewBranchScreen({ branchId, branchDetailUseCase }: ViewBranchScreenProps) {
  const router = useRouter()
  const viewModel = useBranchDetailViewModel(branchId, branchDetailUseCase)
  const { state } = viewModel
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
  const deleteDialog = getDeleteDialogContent(pendingDelete)

  const handleConfirmDelete = () => {
    if (!pendingDelete) {
      return
    }

    switch (pendingDelete.kind) {
      case "subBranch":
        void viewModel.deleteSubBranch(pendingDelete.item.id)
        break
      case "book":
        void viewModel.deleteBook(pendingDelete.item.id)
        break
      case "author":
        void viewModel.deleteAuthor(pendingDelete.item.id)
        break
      case "translator":
        void viewModel.deleteTranslator(pendingDelete.item.id)
        break
      case "staff":
        void viewModel.deleteStaff(pendingDelete.item.id)
        break
      case "member":
        void viewModel.deleteMember(pendingDelete.item.id)
        break
    }

    setPendingDelete(null)
  }

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Branch Management", href: "/dashboard/branches" },
    { label: state.branchDetail?.branchName ?? "Branch Details" },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Branch not found</CardTitle>
              <CardDescription>
                The branch you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to branches
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to branches
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.branchDetail && state.permissions ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <EntityImage
                  src={state.branchDetail.imageUrl ?? state.branchDetail.logoUrl}
                  alt={state.branchDetail.branchName}
                  fill
                  sizes="80px"
                  className="size-20 rounded-lg"
                  imageClassName="rounded-lg"
                  fallback={<Building2Icon className="size-10 text-muted-foreground" />}
                />
                <div>
                  <h1 className="text-2xl font-semibold tracking-normal">
                    {state.branchDetail.branchName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View and manage branch details, resources, and team.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back
              </Button>
            </section>

            <Tabs
              defaultValue="details"
              value={state.activeTab}
              onValueChange={(value) => viewModel.setActiveTab(value as typeof state.activeTab)}
              className="gap-4"
            >
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 sm:w-fit">
                <TabsTrigger value="details" className="gap-1.5">
                  <Building2Icon className="size-3.5" />
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger value="location" className="gap-1.5">
                  <MapPinIcon className="size-3.5" />
                  <span className="hidden sm:inline">Location</span>
                </TabsTrigger>
                {state.branchDetail.type === "main" ? (
                  <TabsTrigger value="sub-branches" className="gap-1.5">
                    <GitBranchIcon className="size-3.5" />
                    <span className="hidden sm:inline">Sub Branches</span>
                  </TabsTrigger>
                ) : null}
                <TabsTrigger value="books" className="gap-1.5">
                  <BookOpenIcon className="size-3.5" />
                  <span className="hidden sm:inline">Books</span>
                </TabsTrigger>
                <TabsTrigger value="authors" className="gap-1.5">
                  <PenLineIcon className="size-3.5" />
                  <span className="hidden sm:inline">Authors</span>
                </TabsTrigger>
                <TabsTrigger value="translators" className="gap-1.5">
                  <LanguagesIcon className="size-3.5" />
                  <span className="hidden sm:inline">Translators</span>
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-1.5">
                  <UsersRoundIcon className="size-3.5" />
                  <span className="hidden sm:inline">Staff</span>
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-1.5">
                  <UserRoundIcon className="size-3.5" />
                  <span className="hidden sm:inline">Members</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <BranchDetailsTab branchDetail={state.branchDetail} />
              </TabsContent>

              <TabsContent value="location">
                <BranchLocationTab branchDetail={state.branchDetail} />
              </TabsContent>

              {state.branchDetail.type === "main" ? (
                <TabsContent value="sub-branches">
                  <SubBranchesTab
                    subBranches={state.subBranches}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={(branch) => router.push(`/dashboard/branches/${branch.id}`)}
                    onEdit={(branch) => router.push(`/dashboard/branches/${branch.id}/edit`)}
                    onDelete={(branch) => setPendingDelete({ kind: "subBranch", item: branch })}
                    onToggleStatus={(branch) => void viewModel.toggleSubBranchStatus(branch.id)}
                  />
                </TabsContent>
              ) : null}

              <TabsContent value="books">
                <BooksTab
                  books={state.books}
                  branchAuthors={state.branchAuthors}
                  branchTranslators={state.branchTranslators}
                  permissions={state.permissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(book) => router.push(`/dashboard/books/${book.id}`)}
<<<<<<< HEAD
                  onEdit={(book) => setEditBookId(book.id)}
=======
                  onEdit={(book) => router.push(`/dashboard/books/${book.id}/edit`)}
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
                  onDelete={(book) => setPendingDelete({ kind: "book", item: book })}
                  onToggleStatus={(book) => void viewModel.toggleBookStatus(book.id)}
                />
              </TabsContent>

              <TabsContent value="authors">
                <AuthorsTab
                  authors={state.authors}
                  permissions={state.permissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(author) => router.push(`/dashboard/authors/${author.id}`)}
                  onEdit={(author) => router.push(`/dashboard/authors/${author.id}/edit`)}
                  onDelete={(author) => setPendingDelete({ kind: "author", item: author })}
                  onToggleStatus={(author) => void viewModel.toggleAuthorStatus(author.id)}
                />
              </TabsContent>

              <TabsContent value="translators">
                <TranslatorsTab
                  translators={state.translators}
                  permissions={state.permissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(translator) => router.push(`/dashboard/translators/${translator.id}`)}
                  onEdit={(translator) =>
                    router.push(`/dashboard/translators/${translator.id}/edit`)
                  }
                  onDelete={(translator) =>
                    setPendingDelete({ kind: "translator", item: translator })
                  }
                  onToggleStatus={(translator) => void viewModel.toggleTranslatorStatus(translator.id)}
                />
              </TabsContent>

              <TabsContent value="staff">
                <StaffTab
                  staff={state.staff}
                  permissions={state.permissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(staffMember) => router.push(`/dashboard/staff/${staffMember.id}`)}
                  onEdit={(staffMember) =>
                    router.push(`/dashboard/staff/${staffMember.id}/edit`)
                  }
                  onDelete={(staffMember) =>
                    setPendingDelete({ kind: "staff", item: staffMember })
                  }
                  onToggleStatus={(staffMember) => void viewModel.toggleStaffStatus(staffMember.id)}
                />
              </TabsContent>

              <TabsContent value="members">
                <MembersTab
                  members={state.members}
                  permissions={state.permissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(member) => router.push(`/dashboard/members/${member.id}`)}
                  onEdit={(member) => router.push(`/dashboard/members/${member.id}/edit`)}
                  onDelete={(member) => setPendingDelete({ kind: "member", item: member })}
                  onToggleStatus={(member) => void viewModel.toggleMemberStatus(member.id)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{deleteDialog?.title ?? ""}</DialogTitle>
            <DialogDescription>{deleteDialog?.description ?? ""}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
<<<<<<< HEAD

      <EditBookDialog
        open={editBookId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditBookId(null)
        }}
        bookId={editBookId ?? ""}
        getBooksUseCase={getBooksUseCase}
        onSaved={() => {
          void queryClient.invalidateQueries({ queryKey: ["branchDetail", branchId] })
        }}
      />
=======
>>>>>>> 33f2422d67e1849f7e306e3181ce5ea148a85013
    </>
  )
}
