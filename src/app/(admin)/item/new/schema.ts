import { z } from "zod";

export const NewItemFormSchema = z.object({
  id: z.string().min(1, { message: "ID is required." }).trim(),
  name: z.string().min(1, { message: "Name is required." }).trim(),
  description: z.string().optional(),
  locationId: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  continueadding: z.string().optional(),
});

export type NewItemActionState = {
  form?: {
    id?: string;
    name?: string;
    description?: string;
    continueadding?: string;
  };
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
  };
};
