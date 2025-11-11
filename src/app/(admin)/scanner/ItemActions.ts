"use client";

import { Item, StorageLocation } from "@/generated/prisma";
import { ItemOrLocationResponse } from "@/app/api/id/[id]/route";
import { ActionResponse, isStorageLocation } from "./Actions";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type ItemOrError = Item | { error: string };

export function moveItemToLocation(
    item: Item,
    location: StorageLocation
): Promise<Item> {
    const existingItem: ItemOrLocationResponse = { type: "item", data: item };

    return fetch(
        `/api/item/${encodeURIComponent(item.id)}/move?locationId=${encodeURIComponent(location.id)}`,
        {
            method: "POST",
        }
    )
        .then((response) => response.json())
        .then((updatedItem: ItemOrError) => {
            if ("error" in updatedItem) {
                throw new Error(updatedItem.error);
            }

            return updatedItem;
        });
}

export function handleScanForItem(item: Item, newItem: ItemOrLocationResponse): Promise<ActionResponse> {
    var target: StorageLocation | undefined;
    if (target = isStorageLocation(newItem)) {
        return moveItemToLocation(item, target).then((updatedItem) => {
            return {
                message: `Moved item ${updatedItem.name} to location ${target!.name}`,
            };
        })
    }

    if ("type" in newItem && newItem.type === "newlocation") {
        const existingItem: ItemOrLocationResponse = { type: "item", data: item };
        return Promise.resolve({ error: "Cannot move item to a new (unsaved) location.", updatedItem: existingItem });
    }

    return Promise.resolve({ updatedItem: newItem });
}

export function redirectToNewItem(router: AppRouterInstance, id: string): Promise<ActionResponse> {
    router.push(`/item/new?prefill=${encodeURIComponent(id)}`);
    return Promise.resolve({ message: `Redirecting to new item creation page.` });
}

export function editItemAction(router: AppRouterInstance, item: Item): Promise<ActionResponse> {
    router.push(`/item/${encodeURIComponent(item.id)}/edit`);
    return Promise.resolve({ message: `Redirecting to item edit page.` });
}