const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

const DEFAULT_MAX_SIZE_MB = 5

export function validateImageFile(
  file: File,
  maxSizeMb: number = DEFAULT_MAX_SIZE_MB
): string | null {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return "Please upload a JPEG, PNG, WebP, or GIF image."
  }

  const maxBytes = maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `Image must be smaller than ${maxSizeMb} MB.`
  }

  return null
}

export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
        return
      }
      reject(new Error("Failed to read image file"))
    }
    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read image file"))
    }
    reader.readAsDataURL(file)
  })
}
