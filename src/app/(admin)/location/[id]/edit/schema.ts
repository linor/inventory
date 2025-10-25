import { z } from "zod"

export const UpdateLocationFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }).trim(),
    description: z.string().optional(),
    parentId: z.string().nullable().optional()
})

export type UpdateLocationActionState = {
  form?: {
    name?: string
    description?: string
    parentId?: string | null
  }
  errors?: {
    name?: string[]
    description?: string[]
    parentId?: string[]
  }
}