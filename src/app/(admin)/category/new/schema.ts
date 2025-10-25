import { z } from "zod"

export const NewCategoryFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).trim(),
  description: z.string().optional()
})

export type NewCategoryActionState = {
  form?: {
    name?: string
    description?: string
  }
  errors?: {
    name?: string[]
    description?: string[]
  }
}