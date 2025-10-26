"use client"; // for Next.js App Router

import { useState, useActionState } from "react";
import { newCategoryAction } from "./action";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { ignoreEnterKey } from "@/lib/noenter";
import CustomKeys from "../CustomKeys";

export default function NewCategoryForm() {
    const [state, action, isPending] = useActionState(newCategoryAction, {});

    return (
        <Form action={action}>
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

            <CustomKeys initialValue={[]} />

            <Button color="primary" type="submit" className="mt-4" disabled={isPending}>
                Create category
            </Button>
        </Form>
    );
}
