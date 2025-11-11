"use client";

import { ItemOrLocationResponse } from "@/app/api/id/[id]/route";
import { StorageLocation } from "@/generated/prisma";
import { editItemAction, redirectToNewItem } from "./ItemActions";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { editLocation, redirectToNewLocation } from "./LocationActions";

export type ActionResponse = {
    message?: string;
    error?: string;
    updatedItem?: ItemOrLocationResponse;
}

export type ActionMap = {
    [key: string]: () => Promise<ActionResponse>;
};

export function isSame(currentItem: ItemOrLocationResponse | undefined | null, barcode: string): boolean {
    if (!currentItem || !("data" in currentItem)) {
        return false;
    }

    return currentItem.data.id === barcode;
}

export function isStorageLocation(item: ItemOrLocationResponse): StorageLocation | undefined {
    if ("type" in item && item.type === "location") {
        return item.data;
    }
    return undefined;
}

export function determineActionsForItem(router: AppRouterInstance, item: ItemOrLocationResponse | undefined | null): ActionMap {
    const actions: ActionMap = {};
    if (!item || !("type" in item)) return actions;

    actions["CLEAR"] = () => Promise.resolve({ message: "Cleared current selection." });
    switch (item.type) {  
        case "item":
            actions["EDIT"] = () => editItemAction(router, item.data);
            break;
        case "location":
            actions["EDIT"] = () => editLocation(router, item.data);
            break;
        case "newitem":
            actions["NEW"] = () => redirectToNewItem(router, item.data.id);
            break;
        case "newlocation":
            actions["NEW"] = () => redirectToNewLocation(router, item.data.id);
            break;
    }

    return actions;
}