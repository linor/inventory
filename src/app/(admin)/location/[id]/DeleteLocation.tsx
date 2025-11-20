"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { StorageLocation } from "@/generated/prisma/client";
import { deleteLocationAction } from "./actions";

export default function DeleteLocation({ location }: { location: StorageLocation | null | undefined }) {
    async function confirmDelete() {
        if (confirm(`Are you sure you want to delete location "${location?.name || "Unnamed Location"}"? This action cannot be undone.`)) {
            await deleteLocationAction(location?.id);
        };
    }

    return <DropdownMenuItem
        variant="destructive"
        onClick={confirmDelete}
    >
        <FontAwesomeIcon icon={faTrash} />
        Delete
    </DropdownMenuItem>
}