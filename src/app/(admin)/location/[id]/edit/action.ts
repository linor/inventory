"use server";

import prisma from "@/lib/prisma";
import { UpdateLocationActionState, UpdateLocationFormSchema } from "./schema";
import { redirect } from "next/navigation";

export async function updateLocationAction(
    _prev: UpdateLocationActionState | undefined,
    formData: FormData
): Promise<UpdateLocationActionState | undefined> {
    const form = Object.fromEntries(formData);
    
    const validationResult = UpdateLocationFormSchema.safeParse(form);
    if (!validationResult.success) {
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    await prisma.storageLocation.update({
        where: { id: formData.get("id") as string },
        data: {
            name: validationResult.data.name,
            description: validationResult.data.description || null,
            parentId: validationResult.data.parentId || null,
            contents: validationResult.data.contents || null,
        },
    });

    redirect("/location/" + formData.get("id"));
}
