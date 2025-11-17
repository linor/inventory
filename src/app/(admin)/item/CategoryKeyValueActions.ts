import prisma from "@/lib/prisma";
import { CategoryKeyValue } from "./CategoryKeyValueInput";
import { Category, CategoryKey } from "@/generated/prisma/edge";

function filterUsedValues(ckv: CategoryKeyValue): boolean {
    return typeof ckv.value === "string" && ckv.value.trim() !== "";
}

export type CategoryWithKeys = Category & { keys: CategoryKey[] };

export function mergeKeyValuePairsForCategory(
    category: CategoryWithKeys | null | undefined,
    currentValues: CategoryKeyValue[],
): CategoryKeyValue[] {
    let updatedKeyValues: CategoryKeyValue[] = currentValues.filter(filterUsedValues);

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

    return updatedKeyValues;
}

export function convertFormDataToCustomKeys(
    formData: FormData,
): { key: string; value: string }[] {
    const customKeys: { key: string; value: string }[] = [];

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

    return customKeys;
}
