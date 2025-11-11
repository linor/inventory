import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ActionResponse } from "./Actions";
import { StorageLocation } from "@/generated/prisma";
import { ItemOrLocationResponse } from "@/app/api/id/[id]/route";
import { moveItemToLocation } from "./ItemActions";
import { de } from "zod/v4/locales";

export function redirectToNewLocation(router: AppRouterInstance, id: string): Promise<ActionResponse> {
    router.push(`/location/new?prefill=${encodeURIComponent(id)}`);
    return Promise.resolve({ message: `Redirecting to new location creation page.` });
}

export function editLocation(router: AppRouterInstance, location: StorageLocation): Promise<ActionResponse> {
    router.push(`/location/${encodeURIComponent(location.id)}/edit`);
    return Promise.resolve({ message: `Redirecting to location edit page.` });
}

export function handleScanForLocation(location: StorageLocation, newItem: ItemOrLocationResponse): Promise<ActionResponse> {
    const existingItem: ItemOrLocationResponse = { type: "location", data: location };

    if (!newItem || !("type" in newItem)) {
        return Promise.resolve({
            error: `Scanned entity is not valid.`,
        });
    }

    switch (newItem.type) {
        case "item":
            return moveItemToLocation(newItem.data, location)
                .then((updatedItem) => {
                    return {
                        message: `Moved item ${updatedItem.name} to location ${location.name}`,
                        updatedItem: existingItem,
                    };
                });
        case "location":
            return fetch(`/api/location/${encodeURIComponent(newItem.data.id)}/move?parentId=${encodeURIComponent(location.id)}`, {
                method: 'POST',
            })
                .then((response) => response.json())
                .then((response: StorageLocation | { error: string }): ActionResponse => {
                    if ("error" in response) {
                        return {
                            error: `Error moving location: ${response.error}`,
                            updatedItem: existingItem,
                        };
                    }

                    return {
                        message: `Moved location ${newItem.data.name} to location ${location.name}`,
                        updatedItem: existingItem,
                    };
                });
        default:
            return Promise.resolve({
                error: `Scanned entity is not an item.`,
                updatedItem: existingItem,
            });
    }
}
