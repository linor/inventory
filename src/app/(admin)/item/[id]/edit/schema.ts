import { z } from "zod";

export const EditItemFormSchema = z.object({
  id: z.string().min(1, { message: "ID is required." }).trim(),
  name: z.string().min(1, { message: "Name is required." }).trim(),
  description: z.string().optional(),
  locationId: z.string().optional(),
  categoryId: z.coerce.number().optional(),
});