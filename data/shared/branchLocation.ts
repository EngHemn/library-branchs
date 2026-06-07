import { fakeBranches } from "@/data/fake/fakeBranches"

export function getBranchLocation(branchId: string): string {
  return fakeBranches.find((branch) => branch.id === branchId)?.address ?? "—"
}

export function getBranchCoordinates(branchId: string): {
  latitude: number | null
  longitude: number | null
} {
  const branch = fakeBranches.find((item) => item.id === branchId)

  return {
    latitude:
      typeof branch?.latitude === "number" && Number.isFinite(branch.latitude)
        ? branch.latitude
        : null,
    longitude:
      typeof branch?.longitude === "number" && Number.isFinite(branch.longitude)
        ? branch.longitude
        : null,
  }
}

export function resolveOrderCoordinates(
  branchId: string,
  latitude?: number | null,
  longitude?: number | null
): { latitude: number | null; longitude: number | null } {
  const normalizedLatitude =
    typeof latitude === "number" && Number.isFinite(latitude) ? latitude : null
  const normalizedLongitude =
    typeof longitude === "number" && Number.isFinite(longitude) ? longitude : null

  if (normalizedLatitude !== null && normalizedLongitude !== null) {
    return { latitude: normalizedLatitude, longitude: normalizedLongitude }
  }

  return getBranchCoordinates(branchId)
}
