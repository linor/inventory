"use server";

import { Category, Item, ItemAttribute, StorageLocation } from "@/generated/prisma";
import prisma from "./prisma";
import zmq from "zeromq";
import { CategoryWithKeys } from "./types";

async function printLabel(data: any) {
    const printQueueAddress = process.env.PRINT_QUEUE_ADDRESS;
    if (!printQueueAddress) {
        throw new Error("PRINT_QUEUE_ADDRESS is not defined in environment variables");
    }

    const sock = new zmq.Push({ ipv6: true, immediate: (process.env.PRINT_QUEUE_IMMEDIATE === "true") });
    await sock.connect(printQueueAddress);
    await sock.send(JSON.stringify(data));
    await sock.close();
}

async function determineLocationParents(location: StorageLocation): Promise<string[]> {
    const parents: string[] = [];
    let currentLocation: StorageLocation | null = location;

    while (currentLocation && currentLocation.parentId) {
        const parent: StorageLocation | null = await prisma.storageLocation.findUnique({
            where: { id: currentLocation.parentId },
        });

        if (!parent) {
            break;
        }

        parents.push(parent.id);
        currentLocation = parent;
    }

    return parents;
}

export async function printLabelForLocation(location: StorageLocation, variant: string = "default") {
    const label = {
        type: "location",
        id: location.id,
        name: location.name,
        contents: location.contents,
        description: location.description,
        parents: await determineLocationParents(location),
        variant: variant,
    }

    return printLabel(label);
}

export type ItemWithAttributes = Item & {
    attributes: ItemAttribute[];
};

export async function printLabelForItem(item: ItemWithAttributes, category?: CategoryWithKeys | null, location?: StorageLocation | null, variant: string = "default") {
    const itemAttributes = Object.fromEntries((item.attributes || []).map(attr => [attr.key, attr.value]));
    if (category?.keys) {
        for (const key of category.keys) {
            if (key.key && !itemAttributes[key.key] && key.defaultValue) {
                itemAttributes[key.key] = key.defaultValue;
            }
        }
    }

    if (variant === "default" && category?.defaultLabelVariant && category.defaultLabelVariant !== "") {
        variant = category.defaultLabelVariant;
    }

    const label = {
        type: "item",
        id: item.id,
        name: item.name,
        description: item.description,
        attributes: itemAttributes,
        location: location?.id,
        ...(category && { category: { id: category.id, name: category.name } }),
        variant: variant,
    };
    return printLabel(label);
}



