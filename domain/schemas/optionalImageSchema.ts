import * as z from "zod"

/** Image URL field that is never required but may be null (no file uploaded). */
export const optionalImageUrlSchema = z.string().nullable()
