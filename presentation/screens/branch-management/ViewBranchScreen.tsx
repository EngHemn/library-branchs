"use client"

import { useRouter } from "next/navigation"
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

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import { AuthorsTab } from "@/presentation/components/branch-detail/AuthorsTab"
import { BooksTab } from "@/presentation/components/branch-detail/BooksTab"
import { BranchDetailsTab } from "@/presentation/components/branch-detail/BranchDetailsTab"
import { BranchLocationTab } from "@/presentation/components/branch-detail/BranchLocationTab"
import { MembersTab } from "@/presentation/components/branch-detail/MembersTab"
import { StaffTab } from "@/presentation/components/branch-detail/StaffTab"
import { SubBranchesTab } from "@/presentation/components/branch-detail/SubBranchesTab"
import { TranslatorsTab } from "@/presentation/components/branch-detail/TranslatorsTab"
import { useBranchDetailViewModel } from "@/presentation/viewmodels/branch-management/useBranchDetailViewModel"

type ViewBranchScreenProps = {
  branchId: string
  branchDetailUseCase: BranchDetailUseCase
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

export function ViewBranchScreen({
  branchId,
  branchDetailUseCase,
}: ViewBranchScreenProps) {
  const router = useRouter()
  const viewModel = useBranchDetailViewModel(branchId, branchDetailUseCase)
  const { state } = viewModel

  const goBack = () => {
    router.push("/dashboard/branches")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/branches">
                    Branch Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state.branchDetail?.branchName ?? "Branch Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingState /> : null}

        {state.isNotFound ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Branch not found</CardTitle>
                <CardDescription>
                  The branch you are looking for does not exist or has been
                  removed.
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
              <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-normal">
                    {state.branchDetail.branchName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View and manage branch details, resources, and team.
                  </p>
                </div>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back
                </Button>
              </section>

              <Tabs
                defaultValue="details"
                value={state.activeTab}
                onValueChange={(value) =>
                  viewModel.setActiveTab(
                    value as typeof state.activeTab
                  )
                }
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
                      onView={(branch) => {
                        router.push(`/dashboard/branches/${branch.id}`)
                      }}
                      onEdit={(branch) => {
                        router.push(`/dashboard/branches/${branch.id}/edit`)
                      }}
                      onDelete={(branch) => {
                        const confirmed = window.confirm(
                          `Delete ${branch.branchName}?`
                        )

                        if (confirmed) {
                          void viewModel.deleteSubBranch(branch.id)
                        }
                      }}
                      onToggleStatus={(branch) => {
                        void viewModel.toggleSubBranchStatus(branch.id)
                      }}
                    />
                  </TabsContent>
                ) : null}

                <TabsContent value="books">
                  <BooksTab
                    books={state.books}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={(book) => {
                      const confirmed = window.confirm(
                        `Delete "${book.title}"?`
                      )

                      if (confirmed) {
                        void viewModel.deleteBook(book.id)
                      }
                    }}
                    onToggleStatus={(book) => {
                      void viewModel.toggleBookStatus(book.id)
                    }}
                  />
                </TabsContent>

                <TabsContent value="authors">
                  <AuthorsTab
                    authors={state.authors}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={(author) => {
                      const confirmed = window.confirm(
                        `Delete ${author.name}?`
                      )

                      if (confirmed) {
                        void viewModel.deleteAuthor(author.id)
                      }
                    }}
                    onToggleStatus={(author) => {
                      void viewModel.toggleAuthorStatus(author.id)
                    }}
                  />
                </TabsContent>

                <TabsContent value="translators">
                  <TranslatorsTab
                    translators={state.translators}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={(translator) => {
                      const confirmed = window.confirm(
                        `Delete ${translator.name}?`
                      )

                      if (confirmed) {
                        void viewModel.deleteTranslator(translator.id)
                      }
                    }}
                    onToggleStatus={(translator) => {
                      void viewModel.toggleTranslatorStatus(translator.id)
                    }}
                  />
                </TabsContent>

                <TabsContent value="staff">
                  <StaffTab
                    staff={state.staff}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={(staffMember) => {
                      const confirmed = window.confirm(
                        `Delete ${staffMember.staffName}?`
                      )

                      if (confirmed) {
                        void viewModel.deleteStaff(staffMember.id)
                      }
                    }}
                    onToggleStatus={(staffMember) => {
                      void viewModel.toggleStaffStatus(staffMember.id)
                    }}
                  />
                </TabsContent>

                <TabsContent value="members">
                  <MembersTab
                    members={state.members}
                    permissions={state.permissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={(member) => {
                      const confirmed = window.confirm(
                        `Delete ${member.memberName}?`
                      )

                      if (confirmed) {
                        void viewModel.deleteMember(member.id)
                      }
                    }}
                    onToggleStatus={(member) => {
                      void viewModel.toggleMemberStatus(member.id)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TooltipProvider>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
