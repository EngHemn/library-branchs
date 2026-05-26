"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  Building2Icon,
  LanguagesIcon,
  PenLineIcon,
  RefreshCwIcon,
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
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { AuthorsTab } from "@/presentation/components/branch-detail/AuthorsTab"
import { BooksTab } from "@/presentation/components/branch-detail/BooksTab"
import { TranslatorsTab } from "@/presentation/components/branch-detail/TranslatorsTab"
import { StaffDetailsTab } from "@/presentation/components/staff-management/StaffDetailsTab"
import { useViewStaffViewModel } from "@/presentation/viewmodels/staff-management/useViewStaffViewModel"

type ViewStaffScreenProps = {
  staffId: string
  staffManagementUseCase: StaffManagementUseCase
  branchDetailUseCase: BranchDetailUseCase
}

const viewPermissions: BranchPermissions = {
  canEdit: false,
  canDelete: false,
  canDeactivate: false,
  canManageSubBranches: false,
  canViewSubBranches: false,
  canManageBooks: false,
  canManageAuthors: false,
  canManageTranslators: false,
  canManageStaff: false,
  canManageMembers: false,
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
      <Skeleton className="min-h-80 rounded-lg" />
    </div>
  )
}

export function ViewStaffScreen({
  staffId,
  staffManagementUseCase,
  branchDetailUseCase,
}: ViewStaffScreenProps) {
  const router = useRouter()
  const viewModel = useViewStaffViewModel(
    staffId,
    staffManagementUseCase,
    branchDetailUseCase
  )
  const { state } = viewModel

  const goBack = () => {
    router.push("/dashboard/staff")
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
                  <BreadcrumbLink href="/dashboard/staff">
                    Staff Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state.staffMember?.staffName ?? "Staff Details"}
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
                <CardTitle>Staff member not found</CardTitle>
                <CardDescription>
                  The staff member you are looking for does not exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to staff
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
                  Back to staff
                </Button>
                <Button onClick={() => router.refresh()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isLoaded && state.staffMember ? (
          <TooltipProvider>
            <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
              <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-normal">
                    {state.staffMember.staffName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    View staff details and assigned branch resources.
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
                </TabsList>

                <TabsContent value="details">
                  <StaffDetailsTab
                    staffMember={state.staffMember}
                    bookCount={state.books.length}
                    authorCount={state.authors.length}
                    translatorCount={state.translators.length}
                  />
                </TabsContent>

                <TabsContent value="books">
                  <BooksTab
                    books={state.books}
                    permissions={viewPermissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onToggleStatus={() => {}}
                  />
                </TabsContent>

                <TabsContent value="authors">
                  <AuthorsTab
                    authors={state.authors}
                    permissions={viewPermissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onToggleStatus={() => {}}
                  />
                </TabsContent>

                <TabsContent value="translators">
                  <TranslatorsTab
                    translators={state.translators}
                    permissions={viewPermissions}
                    searchQuery={state.searchQuery}
                    onSearchQueryChange={viewModel.setSearchQuery}
                    onView={() => {}}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onToggleStatus={() => {}}
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
