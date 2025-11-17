"use client";

import { ItemFormStartValue, ItemFormState } from "./SharedFormSchema";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { ignoreEnterKey } from "@/lib/noenter";
import CategorySelect from "./CategorySelect";
import LocationSelectInput from "../location/LocationSelect";
import { Category, StorageLocation } from "@/generated/prisma";
import CategoryKeyValueInput, { CategoryKeyValue, CategoryKeyValueInputState } from "./CategoryKeyValueInput";
import { ItemWithAttributes } from "@/lib/labels";

type SharedFormProps = {
  state?: ItemFormState;
  locations?: StorageLocation[];
  categories?: Category[];
  sourceItem?: ItemFormStartValue | null;
};

export default function SharedItemForm({ state, locations, categories, sourceItem }: SharedFormProps) {
    const startCategoryKeyValues: CategoryKeyValue[] = sourceItem?.categoryKeyValues || [];
    const [categoryKeyValues, setCategoryKeyValues, updateCategoryKeyValue] = CategoryKeyValueInputState(startCategoryKeyValues);

    return (
        <>
            <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Name"
                labelPlacement="inside"
                name="name"
                placeholder="Enter a name for this item"
                type="text"
                defaultValue={state?.form?.name}
                onKeyDown={ignoreEnterKey}
            />
            <Textarea
                label="Description"
                placeholder="Enter your description"
                name="description"
                defaultValue={state?.form?.description}
            />
            <CategorySelect
                categories={categories || []}
                onChange={(i) => updateCategoryKeyValue(i)}
                initialCategoryId={sourceItem?.item.categoryId}
            />
            <LocationSelectInput
                locations={locations || []}
                keyName="locationId"
                label="Storage Location"
                parentId={sourceItem?.item.locationId}
            />

            <CategoryKeyValueInput
                keyvalues={categoryKeyValues}
                updateValues={setCategoryKeyValues}
            />
        </>
    );
}
