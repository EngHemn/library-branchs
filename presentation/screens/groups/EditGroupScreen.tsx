"use client"



import { useRouter } from "next/navigation"

import { ArrowLeftIcon, Loader2Icon, SaveIcon } from "lucide-react"



import { Button } from "@/components/ui/button"

import {

  Card,

  CardContent,

  CardDescription,

  CardHeader,

  CardTitle,

} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"

import { Skeleton } from "@/components/ui/skeleton"

import { dashboardPaths } from "@/lib/dashboardPaths"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"

import { GroupFormFields } from "@/presentation/components/groups/GroupFormFields"

import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"

import { useTranslation } from "@/presentation/i18n/useTranslation"

import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"

import { useEditGroupViewModel } from "@/presentation/viewmodels/groups/useEditGroupViewModel"



type EditGroupScreenProps = {

  groupId: string

  authUseCase: AuthUseCase

  groupManagementUseCase: GroupManagementUseCase

}



function LoadingState() {

  return (

    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">

      <div className="space-y-2 pt-4">

        <Skeleton className="h-8 w-48" />

        <Skeleton className="h-4 w-96 max-w-full" />

      </div>

      <Skeleton className="min-h-96 rounded-lg" />

    </div>

  )

}



export function EditGroupScreen({

  groupId,

  authUseCase,

  groupManagementUseCase,

}: EditGroupScreenProps) {

  const router = useRouter()

  const viewModel = useEditGroupViewModel(

    groupId,

    authUseCase,

    groupManagementUseCase

  )

  const { t } = useTranslation()

  const { state, form } = viewModel



  useDashboardBreadcrumbs([

    { label: t("breadcrumbs.workspace"), href: "/dashboard" },

    { label: t("nav.groups"), href: dashboardPaths.groups.list },

    {

      label: state.group?.name ?? t("groups.edit.breadcrumb"),

      href: dashboardPaths.groups.detail(groupId),

    },

    { label: t("common.edit") },

  ])



  const goBack = () => router.push(dashboardPaths.groups.detail(groupId))



  useFormSubmitSuccess(state.isSaved, t("groups.edit.updateSuccess"))



  return (

    <>

      {state.isLoading ? <LoadingState /> : null}



      {state.isNotFound ? (

        <div className="flex flex-1 items-center justify-center p-4">

          <Card className="w-full max-w-md rounded-lg">

            <CardHeader>

              <CardTitle>{t("groups.notFoundTitle")}</CardTitle>

              <CardDescription>

                {t("groups.notFoundDescription")}

              </CardDescription>

            </CardHeader>

            <CardContent>

              <Button

                variant="outline"

                onClick={() => router.push(dashboardPaths.groups.list)}

              >

                <ArrowLeftIcon />

                {t("groups.backToGroups")}

              </Button>

            </CardContent>

          </Card>

        </div>

      ) : null}



      {state.isError ? (

        <div className="flex flex-1 items-center justify-center p-4">

          <Card className="w-full max-w-md rounded-lg">

            <CardHeader>

              <CardTitle>{t("groups.loadErrorTitle")}</CardTitle>

              <CardDescription>

                {state.error ?? t("common.somethingWentWrong")}

              </CardDescription>

            </CardHeader>

          </Card>

        </div>

      ) : null}



      {state.isReady || state.isSaving || state.isSaved ? (

        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">

          <section className="flex items-center justify-between pt-4">

            <div>

              <h1 className="text-2xl font-semibold tracking-normal">

                {t("groups.edit.title")}

              </h1>

              <p className="mt-1 text-sm text-muted-foreground">

                {t("groups.edit.subtitle")}

              </p>

            </div>

            <Button variant="outline" onClick={goBack}>

              <ArrowLeftIcon />

              {t("common.back")}

            </Button>

          </section>



          {state.error && state.isReady ? (

            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">

              <CardContent className="py-3">

                <p className="text-sm font-medium text-red-800 dark:text-red-200">

                  {state.error}

                </p>

              </CardContent>

            </Card>

          ) : null}



          <Card className="rounded-lg">

            <CardHeader>

              <CardTitle>{t("groups.create.detailsTitle")}</CardTitle>

              <CardDescription>

                {t("groups.edit.detailsDescription")}

              </CardDescription>

            </CardHeader>

            <CardContent>

              <GroupFormFields

                form={form}

                bookOptions={state.bookOptions}

                staffOptions={state.staffOptions}

                branchOptions={state.branchOptions}

                showBranchField={state.showBranchField}

                disabled={state.isSaving || state.isSaved}

                onSubmit={(values) => void viewModel.save(values)}

              >

                <Separator />

                <div className="flex justify-end gap-3">

                  <Button

                    type="button"

                    variant="outline"

                    onClick={goBack}

                    disabled={state.isSaving}

                  >

                    {t("common.cancel")}

                  </Button>

                  <Button

                    type="submit"

                    disabled={state.isSaving || state.isSaved}

                  >

                    {state.isSaving ? (

                      <Loader2Icon className="animate-spin" />

                    ) : (

                      <SaveIcon />

                    )}

                    {state.isSaving ? t("common.saving") : t("common.saveChanges")}

                  </Button>

                </div>

              </GroupFormFields>

            </CardContent>

          </Card>

        </div>

      ) : null}

    </>

  )

}


