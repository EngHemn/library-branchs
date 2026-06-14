"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BookOpenIcon,
  Building2Icon,
  LanguagesIcon,
  PenLineIcon,
  RefreshCwIcon,
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
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
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

export function ViewStaffScreen({ staffId, staffManagementUseCase, branchDetailUseCase }: ViewStaffScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useViewStaffViewModel(staffId, staffManagementUseCase, branchDetailUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.staff"), href: "/dashboard/staff" },
    { label: state.staffMember?.staffName ?? t("staff.view.breadcrumbFallback") },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("staff.view.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("staff.view.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("staff.view.backToStaff")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("common.somethingWentWrong")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("staff.view.backToStaff")}
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.staffMember ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <EntityImage
                  src={state.staffMember.imageUrl}
                  alt={state.staffMember.staffName}
                  fill
                  sizes="80px"
                  className="size-20 rounded-lg"
                  imageClassName="rounded-lg"
                  fallback={<UsersRoundIcon className="size-10 text-muted-foreground" />}
                />
                <div>
                  <h1 className="text-2xl font-semibold tracking-normal">
                    {state.staffMember.staffName}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("staff.view.subtitle")}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
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
                  <span className="hidden sm:inline">{t("staff.view.tabs.details")}</span>
                </TabsTrigger>
                <TabsTrigger value="books" className="gap-1.5">
                  <BookOpenIcon className="size-3.5" />
                  <span className="hidden sm:inline">{t("staff.view.tabs.books")}</span>
                </TabsTrigger>
                <TabsTrigger value="authors" className="gap-1.5">
                  <PenLineIcon className="size-3.5" />
                  <span className="hidden sm:inline">{t("staff.view.tabs.authors")}</span>
                </TabsTrigger>
                <TabsTrigger value="translators" className="gap-1.5">
                  <LanguagesIcon className="size-3.5" />
                  <span className="hidden sm:inline">{t("staff.view.tabs.translators")}</span>
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
                  branchAuthors={state.branchAuthors}
                  branchTranslators={state.branchTranslators}
                  permissions={viewPermissions}
                  searchQuery={state.searchQuery}
                  onSearchQueryChange={viewModel.setSearchQuery}
                  onView={(book) => router.push(`/dashboard/books/${book.id}`)}
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
                  onView={(author) => router.push(`/dashboard/authors/${author.id}`)}
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
                  onView={(translator) =>
                    router.push(`/dashboard/translators/${translator.id}`)
                  }
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onToggleStatus={() => {}}
                />
              </TabsContent>
            </Tabs>
          </div>
        </TooltipProvider>
      ) : null}
    </>
  )
}
