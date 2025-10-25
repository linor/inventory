"use server";

import { UpdateCategoryActionState, UpdateCategoryFormSchema } from "./schema";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { determineKeyPairs } from "../../utils";

export default async function updateCategoryAction(
    _prev: UpdateCategoryActionState,
    formData: FormData
): Promise<UpdateCategoryActionState | undefined> {
    const form = Object.fromEntries(formData);

    const validationResult = UpdateCategoryFormSchema.safeParse(form);
    if (!validationResult.success) {
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    const existingCategory = await prisma.category.findUnique({
        where: { id: validationResult.data.id },
        include: { keys: true },
    });

    if (!existingCategory) {
        return {
            form,
            errors: { id: ["Category not found"] },
        };
    }

    const newCategoryKeys = determineKeyPairs(formData);

    await prisma.category.update({
        where: { id: validationResult.data.id },
        data: {
            name: validationResult.data.name,
            description: validationResult.data.description || null,
        },
    });

    const existingKeys = existingCategory.keys;
    const keysToAdd = newCategoryKeys.filter(
        (newKey) => !existingKeys.some((ek) => ek.key === newKey.key)
    );
    const keysToRemove = existingKeys.filter(
        (ek) => !newCategoryKeys.some((nk) => nk.key === ek.key)
    );
    const keysToUpdate = newCategoryKeys.filter((newKey) =>
        existingKeys.some((ek) => ek.key === newKey.key && ek.name !== newKey.value)
    );

    for (const key of keysToUpdate) {
        await prisma.categoryKey.updateMany({
            where: { categoryId: existingCategory.id, key: key.key },
            data: { name: key.value },
        });
    }

    if (keysToAdd.length > 0) {
        await prisma.categoryKey.createMany({
            data: keysToAdd.map((k) => ({
                categoryId: existingCategory.id,
                key: k.key,
                name: k.value,
            })),
        });
    }

    for (const key of keysToRemove) {
        await prisma.categoryKey.delete({
            where: { categoryId_key: { categoryId: existingCategory.id, key: key.key } },
        });
    }

    redirect("/category/" + validationResult.data.id);
}