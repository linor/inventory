"use client";

import { useActionState, useCallback, useState } from "react";
import { newLocationAction } from "./action";
import { NewLocationFormSchema } from "./schema";
import { ValidatedInput } from "@/components/ui/validated-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Textarea } from "@heroui/react";
import LocationSelectInput from "../LocationSelect";
import { StorageLocation } from "@/generated/prisma";
import { ignoreEnterKey } from "@/lib/noenter";

export default function NewLocationForm({
    allLocations,
    id
}: {
    allLocations: StorageLocation[];
    id?: string;
}) {
    const [isGeneratingId, setIsGeneratingId] = useState(false);
    const [state, action, isPending] = useActionState(newLocationAction, {}, NewLocationFormSchema);
    const [generatedId, setGeneratedId] = useState(id || "" );

    const generateNewId = () => {
        setIsGeneratingId(true);

        fetch("/api/id/location")
            .then((response) => response.json())
            .then((data) => {
                setGeneratedId(data.id);
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
                defaultValue={state.form?.id}
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
                        <FontAwesomeIcon
                            spin={isGeneratingId}
                            icon={faRotate}
                        />
                    </Button>
                }
            />
            <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Name"
                labelPlacement="inside"
                name="name"
                placeholder="Enter a name for this location"
                type="text"
                defaultValue={state.form?.name}
                onKeyDown={ignoreEnterKey}
            />
            <Textarea
                label="Description"
                placeholder="Enter your description"
                name="description"
                defaultValue={state.form?.description}
            />
            <LocationSelectInput
                locations={allLocations}
                parentId={state.form?.parentId}
            />
            <Button color="primary" type="submit">
                Create location
            </Button>
        </Form>
    );
}
