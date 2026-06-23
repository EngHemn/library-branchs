"use client"

import { useCallback, useId, useRef, useState } from "react"
import {
  EyeIcon,
  ImageIcon,
  Loader2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EntityImage } from "@/components/ui/entity-image"
import { Label } from "@/components/ui/label"
import { readImageFileAsDataUrl, validateImageFile } from "@/lib/imageFile"
import { cn } from "@/lib/utils"

export type ImageUploadProps = {
  value: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
  label?: string
  description?: string
  className?: string
  previewAlt?: string
  accept?: string
  maxSizeMb?: number
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  label = "Image",
  description = "Optional. JPEG, PNG, WebP, or GIF up to 5 MB.",
  className,
  previewAlt = "Uploaded image preview",
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSizeMb = 5,
}: ImageUploadProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const hasImage = Boolean(value)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)
      const validationMessage = validateImageFile(file, maxSizeMb)
      if (validationMessage) {
        setError(validationMessage)
        return
      }

      setIsLoading(true)
      try {
        const dataUrl = await readImageFileAsDataUrl(file)
        onChange(dataUrl)
      } catch {
        setError("Failed to read image. Please try again.")
      } finally {
        setIsLoading(false)
        if (inputRef.current) {
          inputRef.current.value = ""
        }
      }
    },
    [maxSizeMb, onChange]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      void processFile(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(false)
    if (disabled || isLoading) return

    const file = event.dataTransfer.files?.[0]
    if (file) {
      void processFile(file)
    }
  }

  const handleRemove = () => {
    setError(null)
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || isLoading}
        onChange={handleInputChange}
      />

      {hasImage ? (
        <Card className="overflow-hidden rounded-lg py-0">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <button
              type="button"
              className="relative mx-auto aspect-4/3 w-full max-w-[200px] shrink-0 overflow-hidden rounded-md border bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:mx-0"
              onClick={() => setPreviewOpen(true)}
              disabled={disabled}
              aria-label="View full image"
            >
              <EntityImage
                src={value}
                alt={previewAlt}
                fill
                sizes="200px"
                className="size-full"
                imageClassName="object-cover"
                fallback={null}
              />
            </button>

            <div className="flex flex-1 flex-col gap-2 sm:items-start">
              <p className="text-sm text-muted-foreground">
                Image selected. Click the preview or View to enlarge.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isLoading}
                  onClick={() => setPreviewOpen(true)}
                >
                  <EyeIcon className="size-4" />
                  View
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isLoading}
                  onClick={() => inputRef.current?.click()}
                >
                  <UploadIcon className="size-4" />
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isLoading}
                  onClick={handleRemove}
                >
                  <XIcon className="size-4" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div
          role="button"
          tabIndex={disabled || isLoading ? -1 : 0}
          aria-disabled={disabled || isLoading}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              if (!disabled && !isLoading) {
                inputRef.current?.click()
              }
            }
          }}
          onClick={() => {
            if (!disabled && !isLoading) {
              inputRef.current?.click()
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault()
            if (!disabled && !isLoading) {
              setIsDragOver(true)
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault()
            setIsDragOver(false)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            if (!disabled && !isLoading) {
              setIsDragOver(true)
            }
          }}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-8 text-center transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/30",
            (disabled || isLoading) &&
              "pointer-events-none cursor-not-allowed opacity-60"
          )}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Uploading image…</p>
            </>
          ) : (
            <>
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drop an image here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  JPEG, PNG, WebP, or GIF
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation()
                  inputRef.current?.click()
                }}
              >
                <UploadIcon className="size-4" />
                Choose file
              </Button>
            </>
          )}
        </div>
      )}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl sm:max-w-3xl" showCloseButton>
          <DialogHeader>
            <DialogTitle>Image preview</DialogTitle>
          </DialogHeader>
          {value ? (
            <div className="flex max-h-[70vh] items-center justify-center overflow-auto rounded-md bg-muted/30 p-2">
              <EntityImage
                src={value}
                alt={previewAlt}
                width={768}
                height={512}
                className="max-h-[65vh] w-full"
                imageClassName="max-h-[65vh] w-auto max-w-full object-contain"
                fallback={null}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
