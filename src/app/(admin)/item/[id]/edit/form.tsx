"use client";

import { Button, Form, Input, Textarea } from "@heroui/react";
import { SaveItemAction } from "./action";
import { useActionState } from "react";
import { Category, StorageLocation } from "@/generated/prisma";
import SharedItemForm from "../../SharedForm";
import { determineInitialFormState, ItemFormStartValue } from "../../SharedFormSchema";

type EditItemFormProps = {
    locations?: StorageLocation[];
    categories?: Category[];
    sourceItem?: ItemFormStartValue | null;
};

export default function EditItemForm({ locations, categories, sourceItem }: EditItemFormProps) {
    const initialState = {
        ...determineInitialFormState(sourceItem),
    };

    const [state, action, isPending] = useActionState(
        SaveItemAction,
        initialState,
    );

    return (
        <Form action={action}>
            <input type="hidden" name="id" value={state?.form?.id} />
            <SharedItemForm
                state={state}
                locations={locations}
                categories={categories}
                sourceItem={sourceItem}
            />
            <div className="mt-4 flex items-center gap-4">
                <Button color="primary" type="submit" disabled={isPending}>
                    Update item
                </Button>
            </div>
        </Form>
    );
}
