"use client"

import { Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getPermissionRoleLabel } from "@/domain/entities/permission/Permission"
import type { GroupStaffOption } from "@/domain/repositories/GroupRepository"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type GroupSelectedStaffTableProps = {
  staffOptions: GroupStaffOption[]
  selectedStaffIds: string[]
  onRemoveStaff: (staffId: string) => void
  disabled?: boolean
}

export function GroupSelectedStaffTable({
  staffOptions,
  selectedStaffIds,
  onRemoveStaff,
  disabled = false,
}: GroupSelectedStaffTableProps) {
  const { t } = useTranslation()

  const selectedStaff = selectedStaffIds
    .map((staffId) => staffOptions.find((member) => member.id === staffId))
    .filter((member): member is GroupStaffOption => member !== undefined)

  if (selectedStaff.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        {t("groups.selectedStaff.empty")}
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("groups.selectedStaff.staffName")}</TableHead>
            <TableHead>{t("groups.staff.role")}</TableHead>
            <TableHead>{t("groups.staff.email")}</TableHead>
            <TableHead>{t("groups.staff.phone")}</TableHead>
            <TableHead className="w-16 text-right">
              {t("groups.selectedStaff.remove")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedStaff.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.staffName}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getPermissionRoleLabel(member.role)}
                </Badge>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone}</TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={t("groups.selectedStaff.removeAria", {
                    name: member.staffName,
                  })}
                  onClick={() => onRemoveStaff(member.id)}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
