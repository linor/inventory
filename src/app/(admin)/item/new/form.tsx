"use client";

import { Category, StorageLocation } from "@/generated/prisma";
import { ignoreEnterKey } from "@/lib/noenter";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { useState, useActionState } from "react";
import { id } from "zod/v4/locales";
import { NewItemActionState, NewItemFormSchema } from "./schema";
import { newItemAction } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import CategorySelect from "../CategorySelect";
import LocationSelectInput from "../../location/LocationSelect";
import { generatedNewItemId } from "./action";
import CategoryKeyValueInput, { CategoryKeyValue, CategoryKeyValueInputState } from "../CategoryKeyValueInput";
import { ItemWithAttributes } from "@/lib/labels";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ItemLabelVariants } from "@/lib/labeltypes";

export type NewItemStartValue = {
    item: ItemWithAttributes;
    categoryKeyValues: CategoryKeyValue[];
};

export type NewItemFormOptions = {
    continueadding?: boolean;
    printlabel?: boolean;
    labelvariant?: string;
}

interface NewItemFormProps {
    categories: Category[];
    locations?: StorageLocation[];
    id?: string;
    source?: NewItemStartValue | null;
    options?: NewItemFormOptions;
}

export default function NewItemForm({ categories, locations, id, source, options }: NewItemFormProps) {
    const initialState: NewItemActionState = {
        form: {
            continueadding: options?.continueadding ? "true" : undefined,
            printlabel: options?.printlabel ? "true" : undefined,
            labelvariant: options?.labelvariant ? options.labelvariant : "default",
        },
    };
    const startCategoryKeyValues: CategoryKeyValue[] = [];

    if (source) {
        initialState.form = {
            ...initialState.form,
            id: source.item.id,
            name: source.item.name,
            description: source.item.description || ""
        };

        startCategoryKeyValues.push(...source.categoryKeyValues);
    }

    const [isGeneratingId, setIsGeneratingId] = useState(false);
    const [state, action, isPending] = useActionState(
        newItemAction,
        initialState
    );
    const [generatedId, setGeneratedId] = useState(id || "");
    const [categoryKeyValues, setCategoryKeyValues, updateCategoryKeyValue] = CategoryKeyValueInputState(startCategoryKeyValues);

    if (!categories) {
        categories = [];
    }

    const generateNewId = () => {
        setIsGeneratingId(true);

        generatedNewItemId()
            .then((id) => {
                setGeneratedId(id);
            })
            .finally(() => setIsGeneratingId(false));
    };

    return (
        <Form action={action}>
            <Input
                isRequired
                errorMessage="Please enter a valid ID"
                label="ID"
                labelPlacement="inside"
                name="id"
                placeholder="Enter a unique ID for this location"
                type="text"
                defaultValue={state?.form?.id}
                value={generatedId}
                onKeyDown={ignoreEnterKey}
                onValueChange={(newvalue) => {
                    setGeneratedId(newvalue);
                }}
                endContent={
                    <Button
                        type="button"
                        onPress={generateNewId}
                        disabled={isGeneratingId}
                        variant="flat"
                    >
                        <FontAwesomeIcon spin={isGeneratingId} icon={faRotate} />
                    </Button>
                }
            />
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
            <CategorySelect categories={categories} onChange={(i) => updateCategoryKeyValue(i)} initialCategoryId={source?.item?.categoryId} />
            <LocationSelectInput
                locations={locations || []}
                keyName="locationId"
                label="Storage Location"
                parentId={source?.item?.locationId}
            />

            <CategoryKeyValueInput keyvalues={categoryKeyValues} updateValues={setCategoryKeyValues} />
            <div className="flex items-center gap-4 mt-4">
                <Button
                    color="primary"
                    type="submit"
                    disabled={isPending}
                >
                    Create item
                </Button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1">
                    <Checkbox id="continueadding" name="continueadding" defaultChecked={state?.form?.continueadding ? true : false} />
                    <Label htmlFor="continueadding">Continue adding items</Label>
                </div>
                <div className="flex items-center gap-1">
                    <Checkbox id="printlabel" name="printlabel" defaultChecked={options?.printlabel ? true : false} />
                    <Label htmlFor="printlabel" className="mr-2">Print label after creation</Label>
                    <Select name="labelvariant" defaultValue={options?.labelvariant}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Label variant" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key="default" value="default">Default Label</SelectItem>
                            {ItemLabelVariants.map(({ variant, label }) => (
                                <SelectItem key={variant} value={variant}>{label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Form>
    );
}
