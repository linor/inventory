"use server";

import prisma from "@/lib/prisma";
import { NewItemActionState } from "./schema";

export async function newItemAction(
  _prev: NewItemActionState | undefined,
  formData: FormData,
): Promise<NewItemActionState | undefined> {
  return;
}

export async function determineCategoryKeys() {
  return "some response";
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
