import { ItemWithAttributes } from "@/lib/labels";
import { CategoryKeyValue } from "./CategoryKeyValueInput";

export type ItemFormState = {
  form?: {
    id?: string;
    name?: string;
    description?: string;
  };
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
  };
};

export type ItemFormStartValue = {
    item: ItemWithAttributes;
    categoryKeyValues: CategoryKeyValue[];
};

export function determineInitialFormState(sourceItem?: ItemFormStartValue | null): ItemFormState {
    if (!sourceItem) {
        return {};
    }

    return {
        form: {
            id: sourceItem.item.id,
            name: sourceItem.item.name,
            description: sourceItem.item.description || "",
        },
    };
}