import { z } from "zod"

export const NewLocationFormSchema = z.object({
    id: z.string().min(1, { message: "ID is required." }).trim(),
    name: z.string().min(1, { message: "Name is required." }).trim(),
    description: z.string().optional(),
    parentId: z.string().nullable().optional(),
    contents: z.string().optional(),
})

export type NewLocationActionState = {
  form?: {
    id?: string
    name?: string
    description?: string
    contents?: string
    parentId?: string | null
  }
  errors?: {
    id?: string[]
    name?: string[]
    description?: string[]
    parentId?: string[]
    contents?: string[]
  }
}