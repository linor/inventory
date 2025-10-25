"use server";

import { redirect } from "next/navigation";
import { NewLocationActionState, NewLocationFormSchema } from "./schema";
import prisma from "@/lib/prisma";

export async function newLocationAction(
    _prev: NewLocationActionState,
    formData: FormData
): Promise<NewLocationActionState | undefined> {
    const form = Object.fromEntries(formData);
    
    const validationResult = NewLocationFormSchema.safeParse(form);
    if (!validationResult.success) {
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    await prisma.storageLocation.create({
        data: {
            id: validationResult.data.id,
            name: validationResult.data.name,
            description: validationResult.data.description || null,
            parentId: validationResult.data.parentId || null,
        },
    });

    redirect("/location/" + validationResult.data.id);
}
