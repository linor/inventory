"use server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NewItemActionState, NewItemFormSchema } from "./schema";
import { flashMessage } from "@thewebartisan7/next-flash-message/actions";

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

    if (validationResult.data.continueadding) {
      await flashMessage(`Item ${result.id} created.`, "success");
      redirect("/item/new?continueadding=true&copy=" + encodeURIComponent(result.id));
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
