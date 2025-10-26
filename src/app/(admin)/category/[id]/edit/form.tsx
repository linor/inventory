"use client";

import { Category, CategoryKey } from "@/generated/prisma";
import updateCategoryAction from "./action";
import { useActionState } from "react";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { ignoreEnterKey } from "@/lib/noenter";
import CustomKeys from "../../CustomKeys";

type CategoryWithKeys = Category & {
    keys: CategoryKey[];
};

type CategoryFormProps = {
    original: CategoryWithKeys;
};

export default function EditCategoryForm({ original }: CategoryFormProps) {
    const [state, action, isPending] = useActionState(updateCategoryAction, {
        form: {
            name: original.name ?? undefined,
            description: original.description ?? undefined,
        },
    });

    return (
        <Form action={action}>
            <input type="hidden" name="id" value={original.id} />
            <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Name"
                labelPlacement="inside"
                name="name"
                placeholder="Enter a name for this category"
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
            <CustomKeys initialValue={original.keys} />
            <span className="text-sm text-gray-500 mb-4">
                Note: Changing keys will not update existing items. You will need
                to update items manually.
            </span>
            <Button color="primary" type="submit" disabled={isPending}>
                Save changes
            </Button>
            </Form>
    );
}
