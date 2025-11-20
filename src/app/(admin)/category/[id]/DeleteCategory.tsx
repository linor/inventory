"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Category, Item } from "@/generated/prisma/client";
import { deleteCategoryAction } from "./actions";

export default function DeleteCategory({ category }: { category: Category | null | undefined }) {
    async function confirmDelete() {
        if (confirm(`Are you sure you want to delete category "${category?.name}"? This action cannot be undone.`)) {
            await deleteCategoryAction(category?.id);
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