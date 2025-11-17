import { CategoryKeyValue } from "./CategoryKeyValueInput";

export function convertItemAttributesToKeyValuePairs(
    attributes?: { key: string; value: string }[]
): CategoryKeyValue[] {
    if (!attributes) return [];

    return attributes.map((attr) => ({
        key: attr.key,
        name: "",
        value: attr.value,
    }));
}