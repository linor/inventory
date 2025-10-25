import { z } from "zod";

export const UpdateCategoryFormSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, { message: "Name is required." }).trim(),
    description: z.string().optional(),
});

export type UpdateCategoryActionState = {
    form?: {
        name?: string;
        description?: string;
    };
    errors?: {
        id?: string[];
        name?: string[];
        description?: string[];
    };
};
