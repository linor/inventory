"use server";

import prisma from "@/lib/prisma";
import { CategoryKeyValue } from "./CategoryKeyValueInput";

function filterUsedValues(ckv: CategoryKeyValue): boolean {
    return typeof ckv.value === "string" && ckv.value.trim() !== "";
}

export async function determineKeyValuePairsForCategory(
  categoryId: number | null,
  currentValues: CategoryKeyValue[],
): Promise<CategoryKeyValue[]> {
    let updatedKeyValues: CategoryKeyValue[] = currentValues.filter(filterUsedValues);

    if (categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId || undefined },
            include: { keys: true },
        });

        if (category) {
            for (const key of category.keys) {
                const exists = updatedKeyValues.find((ckv) => ckv.key === key.key);
                if (!exists) {
                    updatedKeyValues.push({
                        key: key.key,
                        name: key.name || key.key,
                        value: "",
                    });
                } else {
                    exists.name = key.name || key.key;
                }
            }
        }
    }

    return updatedKeyValues;
}

