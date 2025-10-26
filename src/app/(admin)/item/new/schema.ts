import { z } from "zod"

export const NewItemFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }).trim(),
  description: z.string().optional()
})

export type NewItemActionState = {
  form?: {
    id?: string
    name?: string
    description?: string
  }
  errors?: {
    id?: string[]
    name?: string[]
    description?: string[]
  }
}