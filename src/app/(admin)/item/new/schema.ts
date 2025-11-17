import { z } from "zod";
import type { ItemFormState } from "../SharedFormSchema";

export const NewItemFormSchema = z.object({
  id: z.string().min(1, { message: "ID is required." }).trim(),
  name: z.string().min(1, { message: "Name is required." }).trim(),
  description: z.string().optional(),
  locationId: z.string().optional(),
  categoryId: z.coerce.number().optional(),
  continueadding: z.string().optional(),
  printlabel: z.string().optional(),
  labelvariant: z.string().optional(),
});

export type NewItemActionState = ItemFormState & {
  form?: {
    continueadding?: string;
    printlabel?: string;
    labelvariant?: string;
  };
};
