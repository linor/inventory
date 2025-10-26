"use server";

import prisma from "@/lib/prisma";
import { NewCategoryActionState, NewCategoryFormSchema } from "./schema";
import { redirect } from "next/navigation";
import { determineKeyPairs } from "../utils";

export async function newCategoryAction(
    _prev: NewCategoryActionState | undefined,
    formData: FormData
): Promise<NewCategoryActionState | undefined> {
    const form = Object.fromEntries(formData);

    const validationResult = NewCategoryFormSchema.safeParse(form);
    if (!validationResult.success) {
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    const categoryData = {
        name: validationResult.data.name,
        description: validationResult.data.description || null,
        keys: { create: determineKeyPairs(formData) }, 
    };

    const result = await prisma.category.create({
        data: categoryData,
    });
    
    redirect("/category/" + result.id);
}
