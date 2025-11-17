"use server";

import { redirect } from "next/dist/client/components/navigation";
import { ItemFormState } from "../../SharedFormSchema";
import { EditItemFormSchema } from "./schema";
import prisma from "@/lib/prisma";
import { determineKeyPairs } from "@/app/(admin)/category/utils";
import { convertFormDataToCustomKeys } from "../../CategoryKeyValueActions";

export async function SaveItemAction(
    _prev: ItemFormState | undefined,
    formData: FormData,
): Promise<ItemFormState | undefined> {
    const form = Object.fromEntries(formData);

    const validationResult = EditItemFormSchema.safeParse(form);
    if (!validationResult.success) {
        console.log("Validation errors:", validationResult.error.flatten().fieldErrors);
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    const existingItem = await prisma.item.findUnique({
        where: { id: formData.get("id") as string },
        include: { attributes: true },
    });

    if (!existingItem) {
        return {
            form,
            errors: { id: ["Item not found"] },
        };
    }

    await prisma.item.update({
        where: { id: formData.get("id") as string },
        data: {
            id: validationResult.data.id,
            name: validationResult.data.name,
            description: validationResult.data.description || null,
            categoryId: validationResult.data.categoryId || null,
            locationId: validationResult.data.locationId || null,
        },
    });

    const newCategoryKeys = convertFormDataToCustomKeys(formData);

    const existingAttributes = existingItem.attributes || [];

    const attributesToAdd = newCategoryKeys.filter((k) => !existingAttributes.some((attr) => attr.key === k.key));
    const attributesToRemove = existingAttributes.filter((attr) => !newCategoryKeys.some((nk) => nk.key === attr.key));
    const attributesToUpdate = newCategoryKeys.filter((newKey) =>
        existingAttributes.some((attr) => attr.key === newKey.key && attr.value !== newKey.value)
    );

    for (const attr of attributesToUpdate) {
        await prisma.itemAttribute.updateMany({
            where: { itemId: existingItem.id, key: attr.key },
            data: { value: attr.value },
        });
    }

    for (const attr of attributesToRemove) {
        await prisma.itemAttribute.deleteMany({
            where: { itemId: existingItem.id, key: attr.key },
        });
    }

    if (attributesToAdd.length > 0) {
        await prisma.itemAttribute.createMany({
            data: attributesToAdd.map((k) => ({
                itemId: existingItem.id,
                key: k.key,
                value: k.value,
            })),
        });
    }

    redirect("/item/" + formData.get("id"));
}
