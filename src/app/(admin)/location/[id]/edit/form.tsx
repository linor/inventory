"use client";

import { StorageLocation } from "@/generated/prisma";
import {
    Button,
    Form,
    Input,
    Textarea,
} from "@heroui/react";
import LocationSelectInput from "../../LocationSelect";
import { useActionState } from "react";
import { updateLocationAction } from "./action";

type LocationFormProps = {
    original: StorageLocation;
    allLocations: StorageLocation[];
};

export default function LocationEditForm({ original, allLocations }: LocationFormProps) {
    const [state, action, isPending] = useActionState(updateLocationAction, { form: {
        name: original.name || "",
        description: original.description || "",
        contents: original.contents || "",
    } });

    return (
        <Form action={action}>
            <input type="hidden" name="id" value={original.id} />
            <Input
                isRequired
                errorMessage="Please enter a valid name"
                label="Name"
                labelPlacement="inside"
                name="name"
                placeholder="Enter a name for this location"
                type="text"
                defaultValue={state?.form?.name}
            />
            <Input
                label="Contents"
                labelPlacement="inside"
                name="contents"
                placeholder="Enter contents summary"
                type="text"
                defaultValue={state?.form?.contents}
            />
            <Textarea
                label="Description"
                placeholder="Enter your description"
                name="description"
                defaultValue={state?.form?.description}
            />
            <LocationSelectInput locations={allLocations} parentId={original.parentId} excludeIds={[original.id]} />
            <Button color="primary" type="submit">
                Save changes
            </Button>
        </Form>
    );
}
