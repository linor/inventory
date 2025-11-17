"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Item } from "@/generated/prisma/client";
import { deleteItemAction } from "./actions";

export default function DeleteItem({ item }: { item: Item | null | undefined }) {
    async function confirmDelete() {
        if (confirm(`Are you sure you want to delete item "${item?.name}"? This action cannot be undone.`)) {
            await deleteItemAction(item?.id);
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