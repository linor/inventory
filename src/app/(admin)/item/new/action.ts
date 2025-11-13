"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NewItemActionState, NewItemFormSchema } from "./schema";
import { flashMessage } from "@thewebartisan7/next-flash-message/actions";
import { printLabelForItem } from "@/lib/labels";

export async function newItemAction(
    _prev: NewItemActionState | undefined,
    formData: FormData,
): Promise<NewItemActionState | undefined> {
    const form = Object.fromEntries(formData);

    const validationResult = NewItemFormSchema.safeParse(form);
    if (!validationResult.success) {
        console.log("Validation errors:", validationResult.error.flatten().fieldErrors);
        return {
            form,
            errors: validationResult.error.flatten().fieldErrors,
        };
    }

    let customKeys = [];
    for (const entry of formData.entries()) {
        const [key, value] = entry;
        if (key.startsWith("param_")) {
            const index = key.split("_")[1];
            const customValue = formData.get(`param_${index}`);
            if (value && customValue && typeof value === "string" && typeof customValue === "string") {
                customKeys.push({ key: index, value: customValue });
            }
        }
    }

    const result = await prisma.item.create({
        data: {
            id: validationResult.data.id,
            name: validationResult.data.name,
            description: validationResult.data.description || null,
            categoryId: validationResult.data.categoryId || null,
            locationId: validationResult.data.locationId || null,
            attributes: {
                create: customKeys,
            },
        },
    });

    let redirectParameters = [];
    let printedLabel = false;

    if (validationResult.data.printlabel) {
        const category = result.categoryId ? await prisma.category.findUnique({
            where: { id: result.categoryId || undefined },
        }) : null;

        const location = result.locationId ? await prisma.storageLocation.findUnique({
            where: { id: result.locationId || undefined },
        }) : null;

        const itemWithAttributes = {
            ...result,
            attributes: customKeys.map(({ key, value }) => ({
                key,
                value,
                itemId: result.id,
            })),
        };

        try {
            await printLabelForItem(itemWithAttributes, category, location,
                validationResult.data.labelvariant || "default");

            await flashMessage("Label sent to printer.", "success");
        } catch (error) {
            await flashMessage("Failed to print label.", "error");
        }

        printedLabel = true;
        redirectParameters.push("printlabel=true");
    }

    if (validationResult.data.labelvariant) {
        redirectParameters.push("labelvariant=" + encodeURIComponent(validationResult.data.labelvariant));
    }

    if (validationResult.data.continueadding) {
        if (!printedLabel) await flashMessage(`Item ${result.id} created.`, "success");
        redirectParameters.push("continueadding=true");
        redirect("/item/new?" + redirectParameters.join("&") + "&copy=" + encodeURIComponent(result.id));
    }

    redirect("/item/" + encodeURIComponent(result.id));
}

export async function generatedNewItemId() {
    const idPrefix = process.env.ITEM_ID_PREFIX || "INV";
    const idLength = parseInt(process.env.ITEM_ID_LENGTH || "12", 10);

    let generatedId = "";
    while (generatedId === "") {
        const randomPart = Math.random()
            .toString(36)
            .substring(2, 2 + idLength)
            .toUpperCase();
        const candidateId = `${idPrefix}${randomPart}`;

        const existingItem = await prisma.item.findUnique({
            where: { id: candidateId },
        });

        if (!existingItem) {
            generatedId = candidateId;
        }
    }

    return generatedId;
}
