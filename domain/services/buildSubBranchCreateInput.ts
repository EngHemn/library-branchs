import type { CreateBranchInput } from "@/domain/repositories/BranchManagementRepository"

export type SubBranchCreateFormFields = Omit<
  CreateBranchInput,
  "type" | "parentBranch"
>

export function buildSubBranchCreateInput(
  fields: SubBranchCreateFormFields,
  parentBranchName: string
): CreateBranchInput {
  return {
    ...fields,
    type: "sub",
    parentBranch: parentBranchName,
  }
}
