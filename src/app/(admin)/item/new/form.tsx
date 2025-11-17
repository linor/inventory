"use client";

import { Category, StorageLocation } from "@/generated/prisma";
import { ignoreEnterKey } from "@/lib/noenter";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { useState, useActionState } from "react";
import { NewItemActionState, NewItemFormSchema } from "./schema";
import { newItemAction } from "./action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { generatedNewItemId } from "./action";
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
import { Share } from "next/font/google";
import SharedItemForm from "../SharedForm";
import { determineInitialFormState, ItemFormStartValue } from "../SharedFormSchema";

export type NewItemFormOptions = {
    continueadding?: boolean;
    printlabel?: boolean;
    labelvariant?: string;
}

interface NewItemFormProps {
    categories: Category[];
    locations?: StorageLocation[];
    id?: string;
    source?: ItemFormStartValue | null;
    options?: NewItemFormOptions;
}

export default function NewItemForm({ categories, locations, id, source, options }: NewItemFormProps) {
    const initialState: NewItemActionState = {
        form: {
            ...determineInitialFormState(source)?.form,
            continueadding: options?.continueadding ? "true" : undefined,
            printlabel: options?.printlabel ? "true" : undefined,
            labelvariant: options?.labelvariant ? options.labelvariant : "default",
        },
    };

    const [isGeneratingId, setIsGeneratingId] = useState(false);
    const [state, action, isPending] = useActionState(
        newItemAction,
        initialState
    );
    const [generatedId, setGeneratedId] = useState(id || "");

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
            <SharedItemForm state={state} locations={locations} categories={categories} sourceItem={source}/>
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
